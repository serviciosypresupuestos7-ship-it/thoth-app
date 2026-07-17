import os
import json
import sqlite3
import logging
import sys
import argparse
from pathlib import Path
import requests

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("upload_to_supabase")

def load_env(path=".env"):
    """Loads environment variables from a .env file without external dependencies."""
    env_path = Path(path)
    if env_path.exists():
        logger.info(f"Loading environment from {env_path.resolve()}...")
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip()
    else:
        logger.warning(f"No .env file found at {env_path.resolve()}")

def get_openai_embedding(text: str, api_key: str) -> list[float] | None:
    """Generates a 1536-dimensional embedding using OpenAI API."""
    url = "https://api.openai.com/v1/embeddings"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "input": text,
        "model": "text-embedding-3-small"
    }
    try:
        r = requests.post(url, headers=headers, json=data, timeout=15)
        r.raise_for_status()
        res = r.json()
        return res["data"][0]["embedding"]
    except Exception as e:
        logger.error(f"Error generating OpenAI embedding: {e}")
        return None

def get_mock_embedding() -> list[float]:
    """Generates a mock 1536-dimensional embedding for testing/offline mode."""
    import random
    # Generate a normalized random vector of size 1536
    vec = [random.uniform(-1, 1) for _ in range(1536)]
    norm = sum(x*x for x in vec) ** 0.5
    return [x/norm for x in vec]

def supabase_request(method: str, table: str, data: list | dict, supabase_url: str, supabase_key: str) -> bool:
    """Sends a request to the Supabase REST API (PostgREST)."""
    url = f"{supabase_url.rstrip('/')}/rest/v1/{table}"
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates" # Upsert behavior
    }
    try:
        if method.upper() == "POST":
            r = requests.post(url, headers=headers, json=data, timeout=30)
        elif method.upper() == "PUT":
            r = requests.put(url, headers=headers, json=data, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")
            
        r.raise_for_status()
        return True
    except Exception as e:
        # Print response body if available for debugging
        response_body = ""
        if 'r' in locals() and hasattr(r, 'text'):
            response_body = r.text
        logger.error(f"Supabase request to {table} failed: {e}. Response: {response_body}")
        return False

def main() -> int:
    parser = argparse.ArgumentParser(description="Uploads collected normative to Supabase")
    parser.add_argument("--domain", required=True, help="Domain name (e.g., ai_literacy, autonomos)")
    parser.add_argument("--display-name", help="Display name for the domain")
    parser.add_argument("--db-path", help="Path to the SQLite database file")
    parser.add_argument("--env-file", default=".env", help="Path to the .env file")
    parser.add_argument("--mock-embeddings", action="store_true", help="Use mock embeddings instead of calling OpenAI API")
    args = parser.parse_args()

    load_env(args.env_file)

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")

    if not supabase_url or not supabase_key:
        logger.error("SUPABASE_URL and SUPABASE_KEY must be set in the environment or .env file.")
        return 1

    domain = args.domain
    display_name = args.display_name or domain.replace("_", " ").title()

    # Determine SQLite database path
    db_path = args.db_path
    if not db_path:
        db_path = f"./corpus_normativa/{domain}/corpus_{domain}.sqlite"
        
    db_file = Path(db_path)
    if not db_file.exists():
        logger.error(f"SQLite database not found at {db_file.resolve()}")
        return 1

    logger.info(f"Connecting to SQLite database at {db_file.resolve()}...")
    conn = sqlite3.connect(db_file)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. Ensure domain exists in Supabase
    logger.info(f"Ensuring domain '{domain}' exists in Supabase...")
    domain_data = {"id": domain, "display_name": display_name}
    if not supabase_request("POST", "legal_domains", [domain_data], supabase_url, supabase_key):
        logger.error("Failed to upsert domain in Supabase.")
        return 1

    # 2. Upload documents
    logger.info("Reading documents from SQLite...")
    cursor.execute("SELECT * FROM documents")
    db_docs = cursor.fetchall()
    logger.info(f"Found {len(db_docs)} documents.")

    supabase_docs = []
    for doc in db_docs:
        topics = json.loads(doc["topics_json"]) if doc["topics_json"] else []
        supabase_docs.append({
            "id": doc["document_id"],
            "domain_id": domain,
            "title": doc["title"],
            "url": doc["url"],
            "final_url": doc["final_url"],
            "authority": doc["authority"],
            "jurisdiction": doc["jurisdiction"],
            "document_type": doc["document_type"],
            "binding_level": doc["binding_level"],
            "topics": topics,
            "language": doc["language"],
            "content_type": doc["content_type"],
            "retrieved_at": doc["retrieved_at"],
            "sha256": doc["sha256"],
            "text": doc["text"],
            "source_file": doc["source_file"]
        })

    if supabase_docs:
        logger.info(f"Uploading {len(supabase_docs)} documents to Supabase...")
        # Upload in batches of 10 to avoid payload limits
        batch_size = 10
        for i in range(0, len(supabase_docs), batch_size):
            batch = supabase_docs[i:i+batch_size]
            if not supabase_request("POST", "legal_documents", batch, supabase_url, supabase_key):
                logger.error(f"Failed to upload document batch {i//batch_size + 1}")
                return 1
    else:
        logger.info("No documents to upload.")

    # 3. Upload chunks
    logger.info("Reading chunks from SQLite...")
    cursor.execute("SELECT * FROM chunks")
    db_chunks = cursor.fetchall()
    logger.info(f"Found {len(db_chunks)} chunks.")

    supabase_chunks = []
    for idx, chunk in enumerate(db_chunks):
        topics = json.loads(chunk["topics_json"]) if chunk["topics_json"] else []
        
        # Generate embedding
        embedding = None
        if args.mock_embeddings or not openai_key:
            if not args.mock_embeddings:
                logger.warning("OPENAI_API_KEY not found. Using mock embeddings.")
            embedding = get_mock_embedding()
        else:
            logger.info(f"[{idx+1}/{len(db_chunks)}] Generating embedding for chunk {chunk['chunk_id']}...")
            embedding = get_openai_embedding(chunk["text"], openai_key)
            if not embedding:
                logger.warning(f"Failed to generate embedding for chunk {chunk['chunk_id']}. Using mock embedding.")
                embedding = get_mock_embedding()
                
        supabase_chunks.append({
            "id": chunk["chunk_id"],
            "document_id": chunk["document_id"],
            "domain_id": domain,
            "chunk_index": chunk["chunk_index"],
            "title": chunk["title"],
            "section": chunk["section"],
            "text": chunk["text"],
            "url": chunk["url"],
            "authority": chunk["authority"],
            "jurisdiction": chunk["jurisdiction"],
            "document_type": chunk["document_type"],
            "binding_level": chunk["binding_level"],
            "topics": topics,
            "sha256": chunk["sha256"],
            "embedding": embedding
        })

    if supabase_chunks:
        logger.info(f"Uploading {len(supabase_chunks)} chunks to Supabase...")
        # Upload in batches of 20
        batch_size = 20
        for i in range(0, len(supabase_chunks), batch_size):
            batch = supabase_chunks[i:i+batch_size]
            if not supabase_request("POST", "legal_chunks", batch, supabase_url, supabase_key):
                logger.error(f"Failed to upload chunk batch {i//batch_size + 1}")
                return 1
    else:
        logger.info("No chunks to upload.")

    logger.info("Upload completed successfully!")
    conn.close()
    return 0

if __name__ == "__main__":
    sys.exit(main())

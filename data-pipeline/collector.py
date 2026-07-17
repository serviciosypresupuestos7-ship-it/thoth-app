#!/usr/bin/env python3
"""
Thoth Collector - Recolector modular y multidominio de normativa y guías oficiales.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import re
import sqlite3
import sys
import time
import yaml
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse

import requests

# Import connectors
from connectors.boe_connector import download_boe_consolidated
from connectors.html_connector import extract_html, normalize_url, clean_text
from connectors.pdf_connector import extract_pdf

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("thoth_collector")

USER_AGENT = (
    "Mozilla/5.0 (compatible; Thoth-Collector/1.0; "
    "+https://example.invalid/research)"
)

@dataclass
class Document:
    document_id: str
    title: str
    url: str
    final_url: str
    authority: str
    jurisdiction: str
    document_type: str
    binding_level: str
    topics: list[str]
    language: str
    content_type: str
    retrieved_at: str
    sha256: str
    text: str
    source_file: str

@dataclass
class Chunk:
    chunk_id: str
    document_id: str
    chunk_index: int
    title: str
    section: str
    text: str
    url: str
    authority: str
    jurisdiction: str
    document_type: str
    binding_level: str
    topics: list[str]
    sha256: str
    concepts: list[dict] = None # List of {"name": "...", "description": "..."}
    relationships: list[dict] = None # List of {"target_concept": "...", "type": "...", "source": "explicit"|"inferred"}
    opportunities: list[dict] = None # List of {"title": "...", "description": "...", "type": "...", "reasoning": "...", "conditions": [...], "limitations": [...], "conflicts": [...]}


def extract_concepts_with_ai(text: str, api_key: str) -> list[dict]:
    """
    Uses OpenAI to extract abstract legal concepts from a chunk of text.
    Returns a list of dictionaries with 'name' and 'description'.
    """
    if not api_key:
        return []
        
    prompt = f"""
    Eres un investigador jurídico experto. Tu tarea es extraer CONCEPTOS JURÍDICOS abstractos y valiosos del siguiente texto legal.
    No extraigas entidades nombradas (como nombres de ministerios) ni resúmenes. Extrae conceptos como "Buena fe contractual", "Responsabilidad solidaria", "Silencio administrativo positivo", etc.
    
    Texto:
    {text}
    
    Responde ÚNICAMENTE con un array JSON válido donde cada elemento sea un objeto con 'name' (el concepto) y 'description' (breve explicación de cómo aplica aquí).
    Ejemplo: [{{"name": "Buena fe", "description": "Obligación de actuar honestamente"}}]
    Si no hay conceptos relevantes, responde [].
    """
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "response_format": { "type": "json_object" }
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            for v in parsed.values():
                if isinstance(v, list):
                    return v
            return []
        elif isinstance(parsed, list):
            return parsed
        return []
    except Exception as e:
        logger.error(f"Error extracting concepts: {e}")
        return []


def extract_relationships_with_ai(text: str, concepts: list[dict], api_key: str) -> list[dict]:
    """
    Uses OpenAI to extract typed relationships between the text and the concepts.
    """
    if not api_key or not concepts:
        return []
        
    concept_names = [c["name"] for c in concepts]
    prompt = f"""
    Eres un investigador jurídico experto. Tu tarea es identificar RELACIONES JURÍDICAS entre el texto legal y los siguientes conceptos extraídos: {concept_names}.
    
    Tipos de relación permitidos: desarrolla, modifica, deroga, complementa, limita, crea excepción, entra en conflicto, aplica conjuntamente, prevalece sobre, exige procedimiento, concede derecho, impone obligación.
    Origen de la relación (source): 'explicit' (el texto lo dice literalmente) o 'inferred' (se deduce lógicamente).
    
    Texto:
    {text}
    
    Responde ÚNICAMENTE con un array JSON válido donde cada elemento sea un objeto con 'target_concept' (nombre del concepto), 'type' (uno de los tipos permitidos) y 'source' ('explicit' o 'inferred').
    Ejemplo: [{{"target_concept": "Buena fe", "type": "impone obligación", "source": "inferred"}}]
    Si no hay relaciones relevantes, responde [].
    """
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "response_format": { "type": "json_object" }
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            for v in parsed.values():
                if isinstance(v, list):
                    return v
            return []
        elif isinstance(parsed, list):
            return parsed
        return []
    except Exception as e:
        logger.error(f"Error extracting relationships: {e}")
        return []


def extract_opportunities_with_ai(text: str, api_key: str) -> list[dict]:
    """
    Uses OpenAI to discover hidden legal opportunities (benefits, exceptions, procedural advantages).
    """
    if not api_key:
        return []
        
    prompt = f"""
    Eres un investigador jurídico experto. Tu tarea es descubrir OPORTUNIDADES JURÍDICAS OCULTAS en el siguiente texto legal.
    Una oportunidad es un beneficio, una excepción poco conocida, una ventaja procesal o un derecho que no es obvio a primera vista.
    
    CRÍTICO: No inventes oportunidades. Si el texto no contiene una base suficiente y clara para una oportunidad, DEBES responder con un array vacío []. Es preferible no encontrar nada a generar un falso positivo.
    
    Si encuentras una oportunidad real, debes extraerla con extremo rigor epistemológico.
    
    Texto:
    {text}
    
    Responde ÚNICAMENTE con un array JSON válido donde cada elemento sea un objeto con:
    - 'title': Título corto de la oportunidad.
    - 'description': Descripción detallada.
    - 'type': Tipo de oportunidad (ej. 'beneficio fiscal', 'excepción procesal', 'derecho oculto').
    - 'reasoning': Resumen de tu razonamiento jurídico para extraer esta oportunidad.
    - 'conditions': Array de strings con las condiciones estrictas para que aplique.
    - 'limitations': Array de strings con las limitaciones de esta oportunidad.
    - 'conflicts': Array de strings con posibles conflictos con otras normas o jurisprudencia.
    
    Si no hay base suficiente, responde [].
    """
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.1,
                "response_format": { "type": "json_object" }
            },
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            for v in parsed.values():
                if isinstance(v, list):
                    return v
            return []
        elif isinstance(parsed, list):
            return parsed
        return []
    except Exception as e:
        logger.error(f"Error extracting opportunities: {e}")
        return []


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_filename(url: str, content_type: str) -> str:
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]
    path_name = Path(urlparse(url).path).name or "index"
    path_name = re.sub(r"[^A-Za-z0-9._-]+", "_", path_name)[:80]
    ext = ".pdf" if "pdf" in content_type else ".html"
    if not path_name.lower().endswith(ext):
        path_name += ext
    return f"{digest}_{path_name}"


def guess_metadata(url: str, parent: dict | None, allowed_domains: list[str]) -> dict:
    parent = parent or {}
    host = urlparse(url).netloc.lower()
    
    authority, jurisdiction = "Comisión Europea", "UE"
    for domain in allowed_domains:
        if domain in host:
            if "aesia" in domain:
                authority, jurisdiction = "AESIA", "España"
            elif "aepd" in domain:
                authority, jurisdiction = "AEPD", "España"
            elif "boe.es" in domain:
                authority, jurisdiction = "BOE", "España"
            elif "congreso.es" in domain:
                authority, jurisdiction = "Congreso de los Diputados", "España"
            elif "eur-lex" in domain:
                authority, jurisdiction = "Unión Europea - EUR-Lex", "UE"
            elif "agenciatributaria" in domain:
                authority, jurisdiction = "AEAT", "España"
            elif "seg-social" in domain:
                authority, jurisdiction = "Seguridad Social", "España"
            elif "sepe" in domain:
                authority, jurisdiction = "SEPE", "España"
            elif "mites" in domain:
                authority, jurisdiction = "Ministerio de Trabajo", "España"
            elif "gobiernodecanarias" in domain:
                authority, jurisdiction = "Gobierno de Canarias", "Canarias"
            elif "tributoscanarias" in domain:
                authority, jurisdiction = "Agencia Tributaria Canaria", "Canarias"
            break

    return {
        "title": parent.get("title", ""),
        "authority": parent.get("authority", authority),
        "jurisdiction": parent.get("jurisdiction", jurisdiction),
        "document_type": "official_document",
        "binding_level": parent.get("binding_level", "official_guidance"),
        "topics": parent.get("topics", ["normativa"]),
        "follow_links": False,
    }


def sectioned_chunks(text: str, max_chars: int = 3500, overlap: int = 350) -> Iterable[tuple[str, str]]:
    current_section = "Documento"
    buffer = ""

    parts = re.split(r"(?m)(?=^##\s+|^Artículo\s+\d+|^Artículo\s+[IVXLCDM]+|^ANEXO\s+)", text)
    for part in parts:
        part = part.strip()
        if not part:
            continue

        first_line = part.splitlines()[0].strip()
        if first_line.startswith("## "):
            current_section = first_line[3:].strip()
        elif re.match(r"^(Artículo|ANEXO)\s+", first_line, re.I):
            current_section = first_line[:240]

        candidate = f"{buffer}\n\n{part}".strip() if buffer else part
        while len(candidate) > max_chars:
            cut = candidate.rfind("\n", 0, max_chars)
            if cut < max_chars // 2:
                cut = candidate.rfind(". ", 0, max_chars)
            if cut < max_chars // 2:
                cut = max_chars
            piece = candidate[:cut].strip()
            if piece:
                yield current_section, piece
            candidate = candidate[max(0, cut - overlap):].strip()
        buffer = candidate

    if buffer:
        yield current_section, buffer


def init_db(path: Path) -> sqlite3.Connection:
    conn = sqlite3.connect(path)
    conn.executescript("""
    PRAGMA journal_mode=WAL;

    CREATE TABLE IF NOT EXISTS documents (
        document_id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        final_url TEXT NOT NULL,
        authority TEXT,
        jurisdiction TEXT,
        document_type TEXT,
        binding_level TEXT,
        topics_json TEXT,
        language TEXT,
        content_type TEXT,
        retrieved_at TEXT,
        sha256 TEXT,
        text TEXT,
        source_file TEXT,
        vigente BOOLEAN DEFAULT 1,
        derogada BOOLEAN DEFAULT 0,
        texto_consolidado BOOLEAN DEFAULT 0,
        fecha_ultima_modificacion TEXT
    );

    CREATE TABLE IF NOT EXISTS document_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        text TEXT NOT NULL,
        retrieved_at TEXT NOT NULL,
        FOREIGN KEY(document_id) REFERENCES documents(document_id)
    );

    CREATE TABLE IF NOT EXISTS chunks (
        chunk_id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        title TEXT,
        section TEXT,
        text TEXT NOT NULL,
        url TEXT NOT NULL,
        authority TEXT,
        jurisdiction TEXT,
        document_type TEXT,
        binding_level TEXT,
        topics_json TEXT,
        sha256 TEXT,
        sector_json TEXT,
        departamento_json TEXT,
        legal_effect_json TEXT,
        relevance_score REAL,
        confidence_score REAL,
        practical_value_score REAL,
        use_cases_json TEXT,
        FOREIGN KEY(document_id) REFERENCES documents(document_id)
    );

    CREATE TABLE IF NOT EXISTS chunk_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chunk_id TEXT NOT NULL,
        version_number INTEGER NOT NULL,
        sha256 TEXT NOT NULL,
        text TEXT NOT NULL,
        retrieved_at TEXT NOT NULL,
        FOREIGN KEY(chunk_id) REFERENCES chunks(chunk_id)
    );

    CREATE TABLE IF NOT EXISTS legal_changes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id TEXT NOT NULL,
        change_type TEXT NOT NULL,
        description TEXT,
        detected_at TEXT NOT NULL,
        FOREIGN KEY(document_id) REFERENCES documents(document_id)
    );

    CREATE TABLE IF NOT EXISTS legal_concepts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'proposed',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS legal_relationships (
        id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL,
        source_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        target_type TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        relationship_source TEXT NOT NULL,
        status TEXT DEFAULT 'proposed',
        created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS legal_opportunities (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        opportunity_type TEXT NOT NULL,
        source_fragment_id TEXT NOT NULL,
        source_document_id TEXT NOT NULL,
        source_article TEXT,
        reasoning_summary TEXT NOT NULL,
        confidence_score REAL,
        status TEXT DEFAULT 'proposed',
        valid_from TEXT,
        valid_until TEXT,
        conditions_json TEXT,
        limitations_json TEXT,
        conflicts_json TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(source_fragment_id) REFERENCES chunks(chunk_id),
        FOREIGN KEY(source_document_id) REFERENCES documents(document_id)
    );

    CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id);
    CREATE INDEX IF NOT EXISTS idx_chunks_authority ON chunks(authority);
    CREATE INDEX IF NOT EXISTS idx_chunks_type ON chunks(document_type);
    CREATE INDEX IF NOT EXISTS idx_chunks_binding ON chunks(binding_level);

    CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
        chunk_id UNINDEXED,
        title,
        section,
        text,
        authority,
        topics,
        content='chunks',
        content_rowid='rowid'
    );


    CREATE TRIGGER IF NOT EXISTS chunks_ai AFTER INSERT ON chunks BEGIN
        INSERT INTO chunks_fts(rowid, chunk_id, title, section, text, authority, topics)
        VALUES (new.rowid, new.chunk_id, new.title, new.section, new.text, new.authority, new.topics_json);
    END;

    CREATE TRIGGER IF NOT EXISTS chunks_ad AFTER DELETE ON chunks BEGIN
        INSERT INTO chunks_fts(chunks_fts, rowid, chunk_id, title, section, text, authority, topics)
        VALUES ('delete', old.rowid, old.chunk_id, old.title, old.section, old.text, old.authority, old.topics_json);
    END;

    CREATE TRIGGER IF NOT EXISTS chunks_au AFTER UPDATE ON chunks BEGIN
        INSERT INTO chunks_fts(chunks_fts, rowid, chunk_id, title, section, text, authority, topics)
        VALUES ('delete', old.rowid, old.chunk_id, old.title, old.section, old.text, old.authority, old.topics_json);
        INSERT INTO chunks_fts(rowid, chunk_id, title, section, text, authority, topics)
        VALUES (new.rowid, new.chunk_id, new.title, new.section, new.text, new.authority, new.topics_json);
    END;
    """)
    return conn


def store_document(conn: sqlite3.Connection, doc: Document, chunks: list[Chunk]) -> None:
    # Check if document exists and if it changed
    cursor = conn.cursor()
    cursor.execute("SELECT sha256 FROM documents WHERE document_id = ?", (doc.document_id,))
    row = cursor.fetchone()
    
    is_new = row is None
    is_changed = not is_new and row[0] != doc.sha256
    
    if is_new or is_changed:
        conn.execute("""
            INSERT OR REPLACE INTO documents 
            (document_id, title, url, final_url, authority, jurisdiction, document_type, binding_level, topics_json, language, content_type, retrieved_at, sha256, text, source_file)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc.document_id, doc.title, doc.url, doc.final_url, doc.authority,
            doc.jurisdiction, doc.document_type, doc.binding_level,
            json.dumps(doc.topics, ensure_ascii=False), doc.language,
            doc.content_type, doc.retrieved_at, doc.sha256, doc.text, doc.source_file
        ))
        
        # Insert into document_versions
        cursor.execute("SELECT MAX(version_number) FROM document_versions WHERE document_id = ?", (doc.document_id,))
        v_row = cursor.fetchone()
        next_version = (v_row[0] or 0) + 1 if v_row else 1
        
        conn.execute("""
            INSERT INTO document_versions (document_id, version_number, sha256, text, retrieved_at)
            VALUES (?, ?, ?, ?, ?)
        """, (doc.document_id, next_version, doc.sha256, doc.text, doc.retrieved_at))
        
        # Log change
        change_type = "new_document" if is_new else "document_updated"
        conn.execute("""
            INSERT INTO legal_changes (document_id, change_type, description, detected_at)
            VALUES (?, ?, ?, ?)
        """, (doc.document_id, change_type, f"Document {'created' if is_new else 'updated'} with version {next_version}", now_iso()))

    # Handle chunks
    for c in chunks:
        cursor.execute("SELECT sha256 FROM chunks WHERE chunk_id = ?", (c.chunk_id,))
        c_row = cursor.fetchone()
        
        c_is_new = c_row is None
        c_is_changed = not c_is_new and c_row[0] != c.sha256
        
        if c_is_new or c_is_changed:
            conn.execute("""
                INSERT OR REPLACE INTO chunks 
                (chunk_id, document_id, chunk_index, title, section, text, url, authority, jurisdiction, document_type, binding_level, topics_json, sha256)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c.chunk_id, c.document_id, c.chunk_index, c.title, c.section,
                c.text, c.url, c.authority, c.jurisdiction, c.document_type,
                c.binding_level, json.dumps(c.topics, ensure_ascii=False), c.sha256
            ))
            
            # Insert into chunk_versions
            cursor.execute("SELECT MAX(version_number) FROM chunk_versions WHERE chunk_id = ?", (c.chunk_id,))
            cv_row = cursor.fetchone()
            next_c_version = (cv_row[0] or 0) + 1 if cv_row else 1
            
            conn.execute("""
                INSERT INTO chunk_versions (chunk_id, version_number, sha256, text, retrieved_at)
                VALUES (?, ?, ?, ?, ?)
            """, (c.chunk_id, next_c_version, c.sha256, c.text, now_iso()))
            
            if c_is_changed:
                conn.execute("""
                    INSERT INTO legal_changes (document_id, change_type, description, detected_at)
                    VALUES (?, ?, ?, ?)
                """, (c.document_id, "chunk_updated", f"Chunk {c.chunk_id} updated to version {next_c_version}", now_iso()))
                
            # Handle concepts and relationships
            if c.concepts:
                for concept in c.concepts:
                    concept_name = concept.get("name")
                    concept_desc = concept.get("description")
                    if not concept_name:
                        continue
                        
                    # Generate a deterministic ID for the concept based on its name
                    concept_id = hashlib.sha256(concept_name.lower().encode("utf-8")).hexdigest()[:16]
                    
                    # Insert concept (ignore if exists, or update description if we want)
                    conn.execute("""
                        INSERT OR IGNORE INTO legal_concepts (id, name, description, status, created_at)
                        VALUES (?, ?, ?, 'proposed', ?)
                    """, (concept_id, concept_name, concept_desc, now_iso()))
                    
                    # Create relationship between chunk and concept (contains_concept)
                    rel_id = hashlib.sha256(f"{c.chunk_id}_{concept_id}".encode("utf-8")).hexdigest()[:16]
                    conn.execute("""
                        INSERT OR IGNORE INTO legal_relationships 
                        (id, source_id, source_type, target_id, target_type, relationship_type, relationship_source, status, created_at)
                        VALUES (?, ?, 'chunk', ?, 'concept', 'contains_concept', 'inferred', 'proposed', ?)
                    """, (rel_id, c.chunk_id, concept_id, now_iso()))
                    
            if c.relationships:
                for rel in c.relationships:
                    target_concept_name = rel.get("target_concept")
                    rel_type = rel.get("type")
                    rel_source = rel.get("source", "inferred")
                    
                    if not target_concept_name or not rel_type:
                        continue
                        
                    target_concept_id = hashlib.sha256(target_concept_name.lower().encode("utf-8")).hexdigest()[:16]
                    
                    # Insert the target concept just in case it wasn't extracted in the concepts list
                    conn.execute("""
                        INSERT OR IGNORE INTO legal_concepts (id, name, description, status, created_at)
                        VALUES (?, ?, ?, 'proposed', ?)
                    """, (target_concept_id, target_concept_name, "", now_iso()))
                    
                    # Create the typed relationship between the chunk and the concept
                    rel_id = hashlib.sha256(f"{c.chunk_id}_{target_concept_id}_{rel_type}".encode("utf-8")).hexdigest()[:16]
                    conn.execute("""
                        INSERT OR IGNORE INTO legal_relationships 
                        (id, source_id, source_type, target_id, target_type, relationship_type, relationship_source, status, created_at)
                        VALUES (?, ?, 'chunk', ?, 'concept', ?, ?, 'proposed', ?)
                    """, (rel_id, c.chunk_id, target_concept_id, rel_type, rel_source, now_iso()))
                    
            if c.opportunities:
                for opp in c.opportunities:
                    title = opp.get("title")
                    description = opp.get("description")
                    opp_type = opp.get("type")
                    reasoning = opp.get("reasoning")
                    
                    if not title or not description or not opp_type or not reasoning:
                        continue
                        
                    opp_id = hashlib.sha256(f"{c.chunk_id}_{title}".encode("utf-8")).hexdigest()[:16]
                    
                    conditions_json = json.dumps(opp.get("conditions", []), ensure_ascii=False)
                    limitations_json = json.dumps(opp.get("limitations", []), ensure_ascii=False)
                    conflicts_json = json.dumps(opp.get("conflicts", []), ensure_ascii=False)
                    
                    conn.execute("""
                        INSERT OR IGNORE INTO legal_opportunities 
                        (id, title, description, opportunity_type, source_fragment_id, source_document_id, source_article, reasoning_summary, status, conditions_json, limitations_json, conflicts_json, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'proposed', ?, ?, ?, ?)
                    """, (opp_id, title, description, opp_type, c.chunk_id, c.document_id, c.section, reasoning, conditions_json, limitations_json, conflicts_json, now_iso()))
                
    conn.commit()


def fetch(session: requests.Session, item: dict, downloads: Path, relevant_terms: list[str], allowed_domains: list[str]) -> tuple[Document, list[str]]:
    url = normalize_url(item["url"])
    
    boe_match = re.search(r'id=(BOE-[A-Z]-[0-9-]+)', url)
    if boe_match:
        boe_id = boe_match.group(1)
        logger.info(f"Detected BOE ID {boe_id} in URL, using BOE XML API...")
        boe_doc = download_boe_consolidated(boe_id)
        if boe_doc:
            file_name = f"{boe_id}.xml"
            file_path = downloads / file_name
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(boe_doc["text"])
                
            content_sha = hashlib.sha256(boe_doc["text"].encode("utf-8")).hexdigest()
            document_id = hashlib.sha256(url.encode("utf-8")).hexdigest()
            
            doc = Document(
                document_id=document_id,
                title=item.get("title") or boe_doc["title"],
                url=url,
                final_url=boe_doc["final_url"],
                authority=item.get("authority") or boe_doc["authority"],
                jurisdiction=item.get("jurisdiction") or boe_doc["jurisdiction"],
                document_type=item.get("document_type") or boe_doc["document_type"],
                binding_level=item.get("binding_level") or boe_doc["binding_level"],
                topics=item.get("topics") or ["normativa"],
                language="es",
                content_type="text/xml",
                retrieved_at=now_iso(),
                sha256=content_sha,
                text=boe_doc["text"],
                source_file=str(file_path),
            )
            return doc, []

    response = session.get(url, timeout=45, allow_redirects=True)
    response.raise_for_status()

    content_type = response.headers.get("content-type", "").lower()
    data = response.content
    discovered: list[str] = []

    if "pdf" in content_type or response.url.lower().endswith(".pdf"):
        text = extract_pdf(data)
        extracted_title = ""
        content_type = "application/pdf"
    else:
        extracted_title, text, discovered = extract_html(data, response.url, relevant_terms, allowed_domains)
        content_type = "text/html"

    if len(text) < 200:
        raise ValueError(f"Texto extraído demasiado corto ({len(text)} caracteres)")

    file_name = safe_filename(response.url, content_type)
    file_path = downloads / file_name
    file_path.write_bytes(data)

    content_sha = hashlib.sha256(text.encode("utf-8")).hexdigest()
    document_id = hashlib.sha256(response.url.encode("utf-8")).hexdigest()
    title = item.get("title") or extracted_title or Path(urlparse(response.url).path).name

    doc = Document(
        document_id=document_id,
        title=title,
        url=url,
        final_url=response.url,
        authority=item.get("authority") or guess_metadata(response.url, item, allowed_domains)["authority"],
        jurisdiction=item.get("jurisdiction") or guess_metadata(response.url, item, allowed_domains)["jurisdiction"],
        document_type=item.get("document_type") or guess_metadata(response.url, item, allowed_domains)["document_type"],
        binding_level=item.get("binding_level") or guess_metadata(response.url, item, allowed_domains)["binding_level"],
        topics=item.get("topics") or guess_metadata(response.url, item, allowed_domains)["topics"],
        language="es" if "/ES/" in response.url or "/es/" in response.url else "unknown",
        content_type=content_type,
        retrieved_at=now_iso(),
        sha256=content_sha,
        text=text,
        source_file=str(file_path),
    )
    return doc, discovered


def make_chunks(doc: Document, api_key: str) -> list[Chunk]:
    result = []
    for index, (section, text) in enumerate(sectioned_chunks(doc.text)):
        chunk_sha = hashlib.sha256(text.encode("utf-8")).hexdigest()
        
        # Extract concepts using AI
        concepts = extract_concepts_with_ai(text, api_key)
        
        # Extract relationships using AI
        relationships = extract_relationships_with_ai(text, concepts, api_key)
        
        # Extract opportunities using AI
        opportunities = extract_opportunities_with_ai(text, api_key)
        
        result.append(Chunk(
            chunk_id=f"{doc.document_id}:{index}",
            document_id=doc.document_id,
            chunk_index=index,
            title=doc.title,
            section=section,
            text=text,
            url=doc.final_url,
            authority=doc.authority,
            jurisdiction=doc.jurisdiction,
            document_type=doc.document_type,
            binding_level=doc.binding_level,
            topics=doc.topics,
            sha256=chunk_sha,
            concepts=concepts,
            relationships=relationships,
            opportunities=opportunities
        ))
    return result


def main() -> int:
    parser = argparse.ArgumentParser(description="Thoth Collector - Recolector modular de normativa")
    parser.add_argument("--config", required=True, help="Ruta al archivo YAML de configuración del dominio")
    parser.add_argument("--output", default="./corpus_normativa")
    parser.add_argument("--max-pages", type=int, default=100)
    parser.add_argument("--delay", type=float, default=0.8)
    args = parser.parse_args()

    config_path = Path(args.config)
    if not config_path.exists():
        logger.error(f"Archivo de configuración no encontrado: {args.config}")
        return 1
        
    with open(config_path, "r", encoding="utf-8") as f:
        if config_path.suffix == '.json':
            config = json.load(f)
        else:
            config = yaml.safe_load(f)
        
    domain_name = config["name"]
    allowed_domains = config["allowed_domains"]
    relevant_link_terms = config["relevant_link_terms"]
    seeds = config["seeds"]
    
    logger.info(f"Iniciando recolector para el dominio de conocimiento: {config.get('display_name', domain_name)}")

    output = Path(args.output).resolve() / domain_name
    downloads = output / "downloads"
    output.mkdir(parents=True, exist_ok=True)
    downloads.mkdir(parents=True, exist_ok=True)

    db_path = output / f"corpus_{domain_name}.sqlite"
    docs_path = output / f"documents_{domain_name}.jsonl"
    chunks_path = output / f"chunks_{domain_name}.jsonl"
    errors_path = output / f"errors_{domain_name}.jsonl"

    conn = init_db(db_path)
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "es,en;q=0.8"})
    
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY no está configurada. No se extraerán conceptos con IA.")

    queue = list(seeds)
    seen: set[str] = set()
    documents: list[Document] = []
    all_chunks: list[Chunk] = []
    errors = []

    while queue and len(seen) < args.max_pages:
        item = queue.pop(0)
        url = normalize_url(item["url"])
        
        domain_allowed = urlparse(url).netloc.lower() in allowed_domains
        if url in seen or not domain_allowed:
            continue
        seen.add(url)

        logger.info(f"[{len(seen)}/{args.max_pages}] {url}")
        try:
            doc, links = fetch(session, item, downloads, relevant_link_terms, allowed_domains)
            chunks = make_chunks(doc, api_key)
            store_document(conn, doc, chunks)
            documents.append(doc)
            all_chunks.extend(chunks)

            if item.get("follow_links"):
                for link in links:
                    if link not in seen:
                        meta = guess_metadata(link, item, allowed_domains)
                        meta["url"] = link
                        if link.lower().endswith(".pdf") or (urlparse(link).netloc.lower() in allowed_domains):
                            queue.append(meta)
        except Exception as exc:
            error = {"url": url, "error": repr(exc), "retrieved_at": now_iso()}
            errors.append(error)
            logger.error(f"Error procesando {url}: {exc}")

        time.sleep(args.delay)

    with docs_path.open("w", encoding="utf-8") as fh:
        for doc in documents:
            fh.write(json.dumps(asdict(doc), ensure_ascii=False) + "\n")

    with chunks_path.open("w", encoding="utf-8") as fh:
        for chunk in all_chunks:
            fh.write(json.dumps(asdict(chunk), ensure_ascii=False) + "\n")

    with errors_path.open("w", encoding="utf-8") as fh:
        for error in errors:
            fh.write(json.dumps(error, ensure_ascii=False) + "\n")

    manifest = {
        "domain": domain_name,
        "generated_at": now_iso(),
        "documents": len(documents),
        "chunks": len(all_chunks),
        "errors": len(errors),
        "database": str(db_path),
        "documents_jsonl": str(docs_path),
        "chunks_jsonl": str(chunks_path),
        "allowed_domains": sorted(allowed_domains),
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    logger.info("Recolección terminada con éxito.")
    logger.info(json.dumps(manifest, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())

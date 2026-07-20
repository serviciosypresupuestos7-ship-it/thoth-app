import os
import hashlib
import time
from datetime import datetime, timezone
from supabase import create_client

SUPABASE_URL = "https://vgrhircrjgbdouihjvqy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A"
FOLDER_PATH = r"D:\proyectos antigravity\THOTH_Leyes_Descargadas"

def chunk_text(text, max_size=2000):
    chunks, current = [], ""
    for sentence in text.split(". "):
        if len(current) + len(sentence) > max_size and current:
            chunks.append(current.strip())
            current = ""
        current += sentence + ". "
    if current.strip():
        chunks.append(current.strip())
    return chunks

def upload_laws():
    print("Conectando a Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("OK.\n")

    files = sorted([f for f in os.listdir(FOLDER_PATH) if f.endswith(".txt")])
    print(f"Archivos encontrados: {len(files)}\n")

    ok, errors = 0, []
    now = datetime.now(timezone.utc).isoformat()

    for i, filename in enumerate(files):
        file_path = os.path.join(FOLDER_PATH, filename)
        title = filename.replace(".txt", "").replace("_", " ")
        print(f"[{i+1}/{len(files)}] {title}...")

        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                text = f.read()

            limited = text[:30000]
            doc_hash = hashlib.sha256(limited.encode()).hexdigest()

            # Comprobar duplicado por sha256
            existing = supabase.table("legal_documents").select("id").eq("sha256", doc_hash).execute()
            if existing.data:
                print(f"  -> Ya existe. Omitido.")
                ok += 1
                continue

            # Insertar documento con esquema exacto de la tabla
            supabase.table("legal_documents").insert({
                "id": doc_hash,
                "domain_id": "ai_literacy",
                "tenant_id": None,
                "title": title,
                "url": "",
                "final_url": "",
                "authority": "BOE / EUR-Lex",
                "jurisdiction": "ES",
                "document_type": "regulation",
                "binding_level": "binding",
                "topics": ["IA", "cumplimiento normativo", "alfabetizacion"],
                "language": "es",
                "content_type": "text/plain",
                "retrieved_at": now,
                "sha256": doc_hash,
                "text": limited[:8000],
            }).execute()

            # Insertar chunks en legal_chunks
            chunks = chunk_text(limited)
            insertados = 0
            for j, chunk in enumerate(chunks[:20]):
                chunk_hash = hashlib.sha256(chunk.encode()).hexdigest()
                try:
                    supabase.table("legal_chunks").insert({
                        "document_id": doc_hash,
                        "tenant_id": None,
                        "domain_id": "ai_literacy",
                        "chunk_index": j,
                        "title": f"{title} - Parte {j+1}",
                        "text": chunk,
                        "sha256": chunk_hash,
                    }).execute()
                    insertados += 1
                except Exception:
                    pass

            print(f"  -> OK | {insertados} chunks")
            ok += 1

        except Exception as e:
            msg = str(e)[:120]
            print(f"  -> ERROR: {msg}")
            errors.append((filename, msg))

        time.sleep(0.3)

    print(f"\n===========================================")
    print(f"COMPLETADO: {ok}/{len(files)} OK")
    if errors:
        print(f"\nErrores ({len(errors)}):")
        for fname, err in errors:
            print(f"  - {fname}: {err}")
    print(f"===========================================")

if __name__ == "__main__":
    upload_laws()

from supabase import create_client
import json

SUPABASE_URL = "https://vgrhircrjgbdouihjvqy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A"

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# Test insert minimal
import hashlib, uuid
test_text = "Test de insercion"
doc_hash = hashlib.sha256(test_text.encode()).hexdigest()

try:
    r = sb.table("legal_documents").insert({
        "id": doc_hash,
        "domain_id": "ai_literacy",
        "title": "Test Documento",
        "url": "https://test.com",
        "final_url": "https://test.com",
        "authority": "Test",
        "jurisdiction": "UE",
        "document_type": "regulation",
        "binding_level": "binding",
        "topics": ["test"],
        "language": "es",
        "content_type": "text/plain",
        "sha256": doc_hash,
        "text": test_text,
    }).execute()
    print("INSERT OK:", r.data)
except Exception as e:
    print("ERROR:", e)

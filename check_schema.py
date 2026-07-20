from supabase import create_client
import hashlib, json

SUPABASE_URL = "https://vgrhircrjgbdouihjvqy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A"
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

r = sb.table("legal_documents").select("*").limit(1).execute()
with open("schema_full.json", "w", encoding="utf-8") as f:
    json.dump(r.data, f, indent=2, ensure_ascii=False, default=str)
print("Guardado en schema_full.json")

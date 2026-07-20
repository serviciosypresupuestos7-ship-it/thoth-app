from supabase import create_client

SUPABASE_URL = "https://vgrhircrjgbdouihjvqy.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Get total documents
    docs_res = supabase.table("legal_documents").select("*", count="exact").execute()
    docs_count = docs_res.count
    
    # Get total chunks
    chunks_res = supabase.table("legal_chunks").select("*", count="exact").execute()
    chunks_count = chunks_res.count
    
    print(f"--- ESTADO DE LA BASE DE DATOS ---")
    print(f"Total Documentos Legales: {docs_count}")
    print(f"Total Chunks (Fragmentos): {chunks_count}")
    
    # Get titles of documents
    docs_data = supabase.table("legal_documents").select("title").execute()
    print("\nDocumentos subidos:")
    for d in docs_data.data:
        print(f"- {d['title']}")
        
except Exception as e:
    print(f"Error: {e}")

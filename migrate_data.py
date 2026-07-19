import sqlite3
import psycopg2
import json

sqlite_path = 'data-pipeline/corpus_normativa/ai_literacy/corpus_ai_literacy.sqlite'
pg_conn_str = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres'

def main():
    print("Connecting to SQLite...")
    sl_conn = sqlite3.connect(sqlite_path)
    sl_conn.row_factory = sqlite3.Row
    sl_cur = sl_conn.cursor()

    print("Connecting to Postgres...")
    pg_conn = psycopg2.connect(pg_conn_str)
    pg_cur = pg_conn.cursor()

    # 1. Domains
    print("Inserting domain...")
    pg_cur.execute("""
        INSERT INTO legal_domains (id, display_name) 
        VALUES (%s, %s) 
        ON CONFLICT (id) DO NOTHING
    """, ('ai_literacy', 'Alfabetización en IA y Normativa'))
    pg_conn.commit()

    # 2. Documents
    sl_cur.execute("SELECT * FROM documents")
    docs = sl_cur.fetchall()
    print(f"Found {len(docs)} documents.")
    for d in docs:
        topics = json.loads(d['topics_json']) if d['topics_json'] else []
        pg_cur.execute("""
            INSERT INTO legal_documents (
                id, domain_id, title, url, final_url, authority, jurisdiction, 
                document_type, binding_level, topics, language, content_type, 
                retrieved_at, sha256, text, source_file
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (
            d['document_id'], 'ai_literacy', d['title'], d['url'], d['final_url'], 
            d['authority'], d['jurisdiction'], d['document_type'], d['binding_level'], 
            topics, d['language'], d['content_type'], d['retrieved_at'], 
            d['sha256'], d['text'], d['source_file']
        ))
    pg_conn.commit()

    # 3. Chunks
    sl_cur.execute("SELECT * FROM chunks")
    chunks = sl_cur.fetchall()
    print(f"Found {len(chunks)} chunks.")
    
    import random
    def get_mock_embedding():
        vec = [random.uniform(-1, 1) for _ in range(1536)]
        norm = sum(x*x for x in vec) ** 0.5
        return [x/norm for x in vec]

    for i, c in enumerate(chunks):
        emb = get_mock_embedding()
        
        pg_cur.execute("""
            INSERT INTO legal_chunks (
                id, document_id, domain_id, chunk_index, title, section, text, 
                url, authority, sha256, embedding
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, (
            c['chunk_id'], c['document_id'], 'ai_literacy', c['chunk_index'], 
            c['title'], c['section'], c['text'], c['url'], c['authority'], 
            c['sha256'], emb
        ))
        if i % 50 == 0:
            print(f"Inserted {i} chunks...")
            pg_conn.commit()
            
    pg_conn.commit()
    print("Done!")

    sl_conn.close()
    pg_conn.close()

if __name__ == '__main__':
    main()

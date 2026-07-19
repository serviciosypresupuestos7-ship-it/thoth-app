const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const sql = `
      -- 1. Tabla relacional para trazabilidad real
      CREATE TABLE IF NOT EXISTS module_source_chunks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          module_content_id UUID REFERENCES module_contents(id) ON DELETE CASCADE,
          legal_chunk_id TEXT REFERENCES legal_chunks(id) ON DELETE CASCADE,
          legal_document_id TEXT REFERENCES legal_documents(id) ON DELETE CASCADE,
          article_reference VARCHAR(255),
          source_url TEXT,
          source_version VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(module_content_id, legal_chunk_id)
      );

      -- Habilitar RLS
      ALTER TABLE module_source_chunks ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Admin full access module_source_chunks" ON module_source_chunks;
      CREATE POLICY "Admin full access module_source_chunks" ON module_source_chunks FOR ALL USING (true);

      -- 2. Ajuste en courses para manejar la versión activa
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS is_active_version BOOLEAN DEFAULT true;
    `;

        await client.query(sql);
        console.log("Tabla module_source_chunks creada y courses actualizado.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

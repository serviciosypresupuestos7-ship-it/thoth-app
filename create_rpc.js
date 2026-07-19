const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        // Create the match_legal_chunks function
        const sql = `
      CREATE OR REPLACE FUNCTION match_legal_chunks(
        query_embedding vector(1536),
        match_threshold float,
        match_count int,
        p_tenant_id uuid DEFAULT NULL
      )
      RETURNS TABLE (
        id uuid,
        document_id text,
        title text,
        section text,
        text text,
        similarity float
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          legal_chunks.id,
          legal_chunks.document_id,
          legal_chunks.title,
          legal_chunks.section,
          legal_chunks.text,
          1 - (legal_chunks.embedding <=> query_embedding) AS similarity
        FROM legal_chunks
        WHERE 1 - (legal_chunks.embedding <=> query_embedding) > match_threshold
          -- If p_tenant_id is provided, only match chunks belonging to that tenant OR official chunks (tenant_id IS NULL)
          AND (p_tenant_id IS NULL OR legal_chunks.tenant_id = p_tenant_id OR legal_chunks.tenant_id IS NULL)
        ORDER BY legal_chunks.embedding <=> query_embedding
        LIMIT match_count;
      END;
      $$;
    `;
        await client.query(sql);
        console.log("Function match_legal_chunks created successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

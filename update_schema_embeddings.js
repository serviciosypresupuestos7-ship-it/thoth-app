const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        // 1. Remove embedding settings from tenant_settings
        await client.query(`
      ALTER TABLE tenant_settings 
      DROP COLUMN IF EXISTS embedding_provider,
      DROP COLUMN IF EXISTS embedding_model;
    `);

        // 2. Add embedding metadata to legal_chunks
        await client.query(`
      ALTER TABLE legal_chunks 
      ADD COLUMN IF NOT EXISTS embedding_provider VARCHAR(50) DEFAULT 'openai',
      ADD COLUMN IF NOT EXISTS embedding_model VARCHAR(100) DEFAULT 'text-embedding-3-small',
      ADD COLUMN IF NOT EXISTS embedding_dimensions INTEGER DEFAULT 1536,
      ADD COLUMN IF NOT EXISTS embedding_version VARCHAR(50) DEFAULT '1.0';
    `);

        console.log("Database schema updated successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

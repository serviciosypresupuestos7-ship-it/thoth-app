const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const sql = `
      ALTER TABLE tenant_settings 
      ADD COLUMN IF NOT EXISTS embedding_provider VARCHAR(50) DEFAULT 'openai',
      ADD COLUMN IF NOT EXISTS embedding_model VARCHAR(100) DEFAULT 'text-embedding-3-small',
      ADD COLUMN IF NOT EXISTS llm_provider VARCHAR(50) DEFAULT 'openai',
      ADD COLUMN IF NOT EXISTS llm_model VARCHAR(100) DEFAULT 'gpt-4o-mini';
    `;
        await client.query(sql);
        console.log("tenant_settings updated successfully.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

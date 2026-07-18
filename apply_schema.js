import { Client } from 'pg';
import { readFileSync } from 'fs';
import path from 'path';

// Supabase connection string (password URL‑encoded)
const DB_URL = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34espa%C3%B1a@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function main() {
    const client = new Client({ connectionString: DB_URL });
    try {
        await client.connect();
        console.log('✅ Connected to Supabase');
        const sqlPath = path.resolve('database', 'thoth_v2_schema.sql');
        const sql = readFileSync(sqlPath, 'utf8');
        await client.query(sql);
        console.log('✅ Schema V2 applied successfully');
    } catch (err) {
        console.error('❌ Error applying schema:', err.message);
    } finally {
        await client.end();
    }
}

main();

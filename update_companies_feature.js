const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const sql = `
      ALTER TABLE companies 
      ADD COLUMN IF NOT EXISTS feature_editorial_engine BOOLEAN DEFAULT false;
    `;
        await client.query(sql);
        console.log("companies table updated with feature_editorial_engine flag.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

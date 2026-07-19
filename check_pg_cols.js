const { Client } = require('pg');
const fs = require('fs');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'legal_documents'
    `);
        fs.writeFileSync('pg_cols.json', JSON.stringify(res.rows.map(r => r.column_name), null, 2));
        console.log('Done');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        await client.query("ALTER TABLE legal_domains DISABLE ROW LEVEL SECURITY;");
        await client.query("ALTER TABLE legal_documents DISABLE ROW LEVEL SECURITY;");
        await client.query("ALTER TABLE legal_chunks DISABLE ROW LEVEL SECURITY;");
        console.log("RLS disabled.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

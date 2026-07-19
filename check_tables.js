const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        res.rows.forEach(r => console.log(r.table_name));
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

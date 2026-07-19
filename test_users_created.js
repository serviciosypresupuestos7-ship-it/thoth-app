const { Client } = require('pg');
async function test() {
    const url = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34espa%C3%B1a@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';
    const client = new Client({ connectionString: url });
    await client.connect();
    const res = await client.query("SELECT email FROM auth.users");
    console.log(res.rows.map(r => r.email).join(', '));
    await client.end();
}
test();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({
    connectionString,
});

async function run() {
    try {
        await client.connect();
        console.log('Connected to Supabase Postgres!');

        const sqlPath = path.join(__dirname, 'database', 'tenant_settings.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);
        console.log('SQL executed successfully! Table tenant_settings created.');

        // Let's also insert a default company if none exists, so we can link settings to it
        const res = await client.query('SELECT id FROM companies LIMIT 1');
        if (res.rows.length === 0) {
            console.log('No companies found. Creating a default company...');
            await client.query(`INSERT INTO companies (name, plan) VALUES ('Acme Corp Demo', 'Enterprise')`);
            console.log('Default company created.');
        } else {
            console.log('Company already exists.');
        }

    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();

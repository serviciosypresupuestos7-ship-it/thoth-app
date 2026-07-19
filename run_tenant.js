const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        console.log('Dropping existing tenant_settings table...');
        await client.query('DROP TABLE IF EXISTS tenant_settings CASCADE');

        const tenantPath = path.join(__dirname, 'database', 'tenant_settings.sql');
        let tenantSql = fs.readFileSync(tenantPath, 'utf8');
        tenantSql = tenantSql.replace(/CREATE POLICY "([^"]+)" ON (\w+)/g, 'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2');

        console.log('Creating new tenant_settings table...');
        await client.query(tenantSql);
        console.log('Table created successfully!');

        // Insert default company
        const res = await client.query('SELECT id FROM companies LIMIT 1');
        if (res.rows.length === 0) {
            console.log('No companies found. Creating a default company...');
            await client.query(`INSERT INTO companies (name, plan) VALUES ('Acme Corp Demo', 'Enterprise')`);
            console.log('Default company created.');
        } else {
            console.log('Company already exists.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

run();

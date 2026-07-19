const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();
        console.log('Connected to Supabase Postgres!');

        // First execute the main schema
        const schemaPath = path.join(__dirname, 'database', 'thoth_v2_schema.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Replace CREATE POLICY with DROP POLICY IF EXISTS ...; CREATE POLICY ...
        schemaSql = schemaSql.replace(/CREATE POLICY "([^"]+)" ON (\w+)/g, 'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2');

        console.log('Executing main schema...');
        await client.query(schemaSql);
        console.log('Main schema executed successfully!');

        // Then execute tenant_settings
        const tenantPath = path.join(__dirname, 'database', 'tenant_settings.sql');
        let tenantSql = fs.readFileSync(tenantPath, 'utf8');
        tenantSql = tenantSql.replace(/CREATE POLICY "([^"]+)" ON (\w+)/g, 'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2');

        console.log('Executing tenant_settings schema...');
        await client.query(tenantSql);
        console.log('tenant_settings executed successfully!');

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
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();

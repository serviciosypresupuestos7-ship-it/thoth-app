const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const sql = `
      -- Añadir versionado a los cursos
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '1.0',
      ADD COLUMN IF NOT EXISTS parent_course_id UUID REFERENCES courses(id) ON DELETE SET NULL;

      -- Actualizar estados permitidos en module_contents (esto es conceptual, en VARCHAR podemos meter lo que queramos, pero lo documentamos)
      -- Estados: draft, in_review, published, needs_update, archived
      
      -- Añadir un campo para guardar las referencias legibles (cache) para no tener que hacer JOINs complejos siempre
      ALTER TABLE module_contents
      ADD COLUMN IF NOT EXISTS source_references JSONB DEFAULT '[]';
    `;

        await client.query(sql);
        console.log("Tablas actualizadas con versionado y referencias.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

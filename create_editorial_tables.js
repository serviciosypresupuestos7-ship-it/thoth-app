const { Client } = require('pg');
const connectionString = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34españa@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const client = new Client({ connectionString });

async function run() {
    try {
        await client.connect();

        const sql = `
      -- 1. Tabla de Cursos
      CREATE TABLE IF NOT EXISTS courses (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          tenant_id UUID REFERENCES companies(id) ON DELETE CASCADE, -- NULL significa que es un curso global de THOTH
          title VARCHAR(255) NOT NULL,
          description TEXT,
          target_role VARCHAR(100),
          status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 2. Tabla de Módulos (Capítulos)
      CREATE TABLE IF NOT EXISTS course_modules (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          order_index INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- 3. Tabla de Contenidos del Módulo (El material elaborado)
      CREATE TABLE IF NOT EXISTS module_contents (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
          content_json JSONB NOT NULL, -- Guarda la estructura: objetivo, explicacion, checklist, etc.
          source_chunks UUID[] DEFAULT '{}', -- Trazabilidad: IDs de los legal_chunks usados
          status VARCHAR(50) DEFAULT 'draft', -- draft, needs_review, published
          last_reviewed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Habilitar RLS
      ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
      ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
      ALTER TABLE module_contents ENABLE ROW LEVEL SECURITY;

      -- Políticas básicas (simplificadas para el admin por ahora)
      DROP POLICY IF EXISTS "Admin full access courses" ON courses;
      CREATE POLICY "Admin full access courses" ON courses FOR ALL USING (true);
      
      DROP POLICY IF EXISTS "Admin full access modules" ON course_modules;
      CREATE POLICY "Admin full access modules" ON course_modules FOR ALL USING (true);
      
      DROP POLICY IF EXISTS "Admin full access contents" ON module_contents;
      CREATE POLICY "Admin full access contents" ON module_contents FOR ALL USING (true);
    `;

        await client.query(sql);
        console.log("Tablas del Motor Editorial creadas con éxito.");
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
run();

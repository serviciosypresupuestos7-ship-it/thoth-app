-- ==========================================
-- THOTH V2 - SCHEMA DEFINITION
-- ==========================================

-- 1. EMPRESAS (Tenants)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) DEFAULT 'Starter', -- Starter, Pro, Enterprise
    status VARCHAR(50) DEFAULT 'Activa', -- Activa, Prueba, Suspendida
    ai_consumption_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USUARIOS (Extendiendo auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'worker', -- worker, hr, superadmin
    department VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. COMPETENCIAS (Catálogo Global)
CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COMPETENCIAS DE USUARIO (Progreso)
CREATE TABLE IF NOT EXISTS user_competencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES competencies(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 0, -- 0 to 100
    status VARCHAR(50) DEFAULT 'En progreso', -- En progreso, Competente
    last_assessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, competency_id)
);

-- 5. MISIONES (Catálogo Global)
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL, -- Límite para evitar payloads masivos
    target_action VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'Media', -- Baja, Media, Alta
    ai_confidence INTEGER,
    status VARCHAR(50) DEFAULT 'pending_validation', -- pending_validation, active, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MISIONES DE USUARIO (Asignaciones)
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, failed
    score INTEGER,
    feedback VARCHAR(2000), -- Límite para evitar payloads masivos
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DOCUMENTOS / FORMACIÓN (Biblioteca)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- PDF, Manual, Guía
    category VARCHAR(100),
    content_url VARCHAR(1000),
    summary VARCHAR(2000), -- Límite para evitar payloads masivos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PROGRESO DE LECTURA (Usuarios - Documentos)
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- 0 to 100
    status VARCHAR(50) DEFAULT 'pending', -- pending, reading, completed
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, document_id)
);

-- 9. EVIDENCIAS (Log Inmutable para Auditoría)
CREATE TABLE IF NOT EXISTS evidences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    evidence_type VARCHAR(100) NOT NULL, -- Misión Superada, Examen Aprobado, Lectura Completada
    detail VARCHAR(2000) NOT NULL, -- Límite para evitar payloads masivos
    hash_id VARCHAR(255) NOT NULL UNIQUE, -- Simulación de inmutabilidad/blockchain
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- RLS (Row Level Security) Policies
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidences ENABLE ROW LEVEL SECURITY;

-- Example Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Example Policy: HR can see all profiles in their company
CREATE POLICY "HR can view company profiles" ON profiles
    FOR SELECT USING (
        company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()) 
        AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'hr'
    );

-- Example Policy: Superadmin can see everything
CREATE POLICY "Superadmin can view all companies" ON companies
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- Seguridad: Evitar inserciones maliciosas (Verificar tenant_id/company_id)
CREATE POLICY "Users can only insert their own evidences" ON evidences
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can only insert their own missions" ON user_missions
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
    );

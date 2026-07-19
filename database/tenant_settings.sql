-- Tabla para guardar la configuración global y las API Keys de cada empresa (Tenant)
CREATE TABLE IF NOT EXISTS tenant_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    
    -- Estado de conexión de los proveedores
    provider_openai BOOLEAN DEFAULT true,
    provider_anthropic BOOLEAN DEFAULT false,
    provider_gemini BOOLEAN DEFAULT false,
    provider_groq BOOLEAN DEFAULT false,
    provider_custom BOOLEAN DEFAULT false,
    
    -- API Keys (En producción real deberían estar encriptadas, aquí las guardamos en texto plano para la demo)
    api_key_openai TEXT,
    api_key_anthropic TEXT,
    api_key_gemini TEXT,
    api_key_groq TEXT,
    api_key_custom TEXT,
    
    -- Configuración Custom
    custom_base_url TEXT,
    custom_model_name TEXT,
    
    -- Parámetros globales
    default_temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2048,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(company_id)
);

-- Habilitar RLS
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los Superadmins pueden ver y editar todas las configuraciones
CREATE POLICY "Superadmin can manage all tenant settings" ON tenant_settings
    FOR ALL USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'superadmin'
    );

-- RRHH solo puede ver la configuración de su propia empresa
CREATE POLICY "HR can view own tenant settings" ON tenant_settings
    FOR SELECT USING (
        company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
        AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'hr'
    );

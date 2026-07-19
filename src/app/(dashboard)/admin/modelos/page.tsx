'use client';

import { useState, useEffect } from 'react';

export default function AdminModelosPage() {
    const [activeTab, setActiveTab] = useState('configuracion');

    // Initialize state with defaults
    const [providers, setProviders] = useState({
        openai: true,
        anthropic: false,
        gemini: false,
        groq: false,
        custom: false
    });

    const [apiKeys, setApiKeys] = useState({
        openai: 'sk-proj-****************************************',
        anthropic: '',
        gemini: '',
        groq: '',
        custom: '',
        customUrl: '',
        customModel: ''
    });

    const [globalParams, setGlobalParams] = useState({
        temperature: 0.7,
        maxTokens: 2048
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load from Supabase on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Dynamic import to avoid breaking if client is not fully set up
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('tenant_settings')
                    .select('*')
                    .limit(1)
                    .single();

                if (data) {
                    setProviders({
                        openai: data.provider_openai,
                        anthropic: data.provider_anthropic,
                        gemini: data.provider_gemini,
                        groq: data.provider_groq,
                        custom: data.provider_custom
                    });
                    setApiKeys({
                        openai: data.api_key_openai || '',
                        anthropic: data.api_key_anthropic || '',
                        gemini: data.api_key_gemini || '',
                        groq: data.api_key_groq || '',
                        custom: data.api_key_custom || '',
                        customUrl: data.custom_base_url || '',
                        customModel: data.custom_model_name || ''
                    });
                    setGlobalParams({
                        temperature: data.default_temperature || 0.7,
                        maxTokens: data.max_tokens || 2048
                    });
                } else {
                    loadFromLocalStorage();
                }
            } catch (err) {
                console.error('Error fetching settings from Supabase:', err);
                loadFromLocalStorage();
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const loadFromLocalStorage = () => {
        const savedProviders = localStorage.getItem('thoth_providers');
        const savedApiKeys = localStorage.getItem('thoth_apiKeys');
        if (savedProviders) setProviders(JSON.parse(savedProviders));
        if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            // Save to localStorage as backup
            localStorage.setItem('thoth_providers', JSON.stringify(providers));
            localStorage.setItem('thoth_apiKeys', JSON.stringify(apiKeys));

            const { createClient } = await import('@/utils/supabase/client');
            const supabase = createClient();

            // Check if a record exists
            const { data: existing } = await supabase.from('tenant_settings').select('id').limit(1).single();

            const payload = {
                provider_openai: providers.openai,
                provider_anthropic: providers.anthropic,
                provider_gemini: providers.gemini,
                provider_groq: providers.groq,
                provider_custom: providers.custom,
                api_key_openai: apiKeys.openai,
                api_key_anthropic: apiKeys.anthropic,
                api_key_gemini: apiKeys.gemini,
                api_key_groq: apiKeys.groq,
                api_key_custom: apiKeys.custom,
                custom_base_url: apiKeys.customUrl,
                custom_model_name: apiKeys.customModel,
                default_temperature: globalParams.temperature,
                max_tokens: globalParams.maxTokens,
                updated_at: new Date().toISOString()
            };

            if (existing) {
                const { error } = await supabase.from('tenant_settings').update(payload).eq('id', existing.id);
                if (error) throw error;
            } else {
                // We need a company_id. For demo, let's fetch the first company
                const { data: company } = await supabase.from('companies').select('id').limit(1).single();
                if (company) {
                    const { error } = await supabase.from('tenant_settings').insert([{ ...payload, company_id: company.id }]);
                    if (error) throw error;
                } else {
                    throw new Error("No company found to attach settings to.");
                }
            }

            alert('Configuración guardada correctamente en Supabase.');
        } catch (error: any) {
            console.error('Error saving settings:', error);
            alert('Error al guardar en Supabase. Se ha guardado localmente.\n\n¿Has ejecutado el script SQL de tenant_settings?');
        } finally {
            setSaving(false);
        }
    };

    // Mock data for companies billing
    const companiesBilling = [
        { id: 1, name: 'TechCorp S.A.', plan: 'Enterprise', tokensUsed: 12500000, cost: 250.00, status: 'Al día' },
        { id: 2, name: 'Innovatech', plan: 'Pro', tokensUsed: 3200000, cost: 64.00, status: 'Al día' },
        { id: 3, name: 'Global Services', plan: 'Starter', tokensUsed: 850000, cost: 17.00, status: 'Pendiente' },
        { id: 4, name: 'DataFlow Inc.', plan: 'Enterprise', tokensUsed: 28000000, cost: 560.00, status: 'Al día' },
    ];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Configuración y Consumo IA 🤖
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Gestiona los modelos de lenguaje, claves de API y monitoriza la facturación por consumo de tokens de las empresas usuarias.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('configuracion')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'configuracion' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'configuracion' ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeTab === 'configuracion' ? 600 : 400
                    }}
                >
                    Configuración de Modelos
                </button>
                <button
                    onClick={() => setActiveTab('facturacion')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        color: activeTab === 'facturacion' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'facturacion' ? '2px solid var(--primary)' : '2px solid transparent',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeTab === 'facturacion' ? 600 : 400
                    }}
                >
                    Facturación por Empresa
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {activeTab === 'configuracion' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>🔑</span> Proveedores de IA
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* OpenAI */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#10a37f', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>OA</div>
                                            <h3 style={{ margin: 0 }}>OpenAI</h3>
                                        </div>
                                        <span className={`badge ${providers.openai ? 'badge-success' : ''}`} style={!providers.openai ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                            {providers.openai ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>API Key</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type={providers.openai ? "password" : "text"} placeholder="Introduce la API Key de OpenAI..." value={apiKeys.openai} onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })} readOnly={providers.openai} className="form-input" style={{ flex: 1, background: providers.openai ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.openai ? 'var(--text-muted)' : '#fff' }} />
                                            <button className={providers.openai ? "btn btn-secondary" : "btn btn-primary"} onClick={() => setProviders({ ...providers, openai: !providers.openai })}>
                                                {providers.openai ? 'Desconectar' : 'Conectar'}
                                            </button>
                                        </div>
                                    </div>
                                    {providers.openai && (
                                        <div style={{ display: 'flex', gap: '2rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modelo Principal:</span>
                                                <span style={{ marginLeft: '0.5rem', fontWeight: 500 }}>gpt-4o</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Modelo Rápido:</span>
                                                <span style={{ marginLeft: '0.5rem', fontWeight: 500 }}>gpt-4o-mini</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Anthropic */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#d97757', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AN</div>
                                            <h3 style={{ margin: 0 }}>Anthropic</h3>
                                        </div>
                                        <span className={`badge ${providers.anthropic ? 'badge-success' : ''}`} style={!providers.anthropic ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                            {providers.anthropic ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>API Key</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type={providers.anthropic ? "password" : "text"} placeholder="Introduce la API Key de Anthropic..." value={apiKeys.anthropic} onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })} readOnly={providers.anthropic} className="form-input" style={{ flex: 1, background: providers.anthropic ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.anthropic ? 'var(--text-muted)' : '#fff' }} />
                                            <button className={providers.anthropic ? "btn btn-secondary" : "btn btn-primary"} onClick={() => setProviders({ ...providers, anthropic: !providers.anthropic })}>
                                                {providers.anthropic ? 'Desconectar' : 'Conectar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Google Gemini */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#4285f4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>GE</div>
                                            <h3 style={{ margin: 0 }}>Google Gemini</h3>
                                        </div>
                                        <span className={`badge ${providers.gemini ? 'badge-success' : ''}`} style={!providers.gemini ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                            {providers.gemini ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>API Key</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type={providers.gemini ? "password" : "text"} placeholder="Introduce la API Key de Google Studio..." value={apiKeys.gemini} onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })} readOnly={providers.gemini} className="form-input" style={{ flex: 1, background: providers.gemini ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.gemini ? 'var(--text-muted)' : '#fff' }} />
                                            <button className={providers.gemini ? "btn btn-secondary" : "btn btn-primary"} onClick={() => setProviders({ ...providers, gemini: !providers.gemini })}>
                                                {providers.gemini ? 'Desconectar' : 'Conectar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Groq */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#f55036', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>GR</div>
                                            <h3 style={{ margin: 0 }}>Groq (Inferencia Ultrarrápida)</h3>
                                        </div>
                                        <span className={`badge ${providers.groq ? 'badge-success' : ''}`} style={!providers.groq ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                            {providers.groq ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>API Key</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <input type={providers.groq ? "password" : "text"} placeholder="Introduce la API Key de Groq..." value={apiKeys.groq} onChange={(e) => setApiKeys({ ...apiKeys, groq: e.target.value })} readOnly={providers.groq} className="form-input" style={{ flex: 1, background: providers.groq ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.groq ? 'var(--text-muted)' : '#fff' }} />
                                            <button className={providers.groq ? "btn btn-secondary" : "btn btn-primary"} onClick={() => setProviders({ ...providers, groq: !providers.groq })}>
                                                {providers.groq ? 'Desconectar' : 'Conectar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom API / Local Models */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>⚙️</div>
                                            <div>
                                                <h3 style={{ margin: 0 }}>API Personalizada / Modelos Locales</h3>
                                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compatible con Ollama, HuggingFace, Mistral, etc.</p>
                                            </div>
                                        </div>
                                        <span className={`badge ${providers.custom ? 'badge-success' : ''}`} style={!providers.custom ? { background: 'rgba(255,255,255,0.1)' } : {}}>
                                            {providers.custom ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Base URL</label>
                                            <input type="text" placeholder="https://api.tu-servidor.com/v1" value={apiKeys.customUrl} onChange={(e) => setApiKeys({ ...apiKeys, customUrl: e.target.value })} readOnly={providers.custom} className="form-input" style={{ width: '100%', background: providers.custom ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.custom ? 'var(--text-muted)' : '#fff' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>API Key (Opcional)</label>
                                            <input type={providers.custom ? "password" : "text"} placeholder="Introduce la API Key..." value={apiKeys.custom} onChange={(e) => setApiKeys({ ...apiKeys, custom: e.target.value })} readOnly={providers.custom} className="form-input" style={{ width: '100%', background: providers.custom ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.custom ? 'var(--text-muted)' : '#fff' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input type="text" placeholder="Nombre del modelo (ej. llama3, mistral-large)" value={apiKeys.customModel} onChange={(e) => setApiKeys({ ...apiKeys, customModel: e.target.value })} readOnly={providers.custom} className="form-input" style={{ flex: 1, background: providers.custom ? 'rgba(0,0,0,0.4)' : 'var(--bg-dark)', color: providers.custom ? 'var(--text-muted)' : '#fff' }} />
                                        <button className={providers.custom ? "btn btn-secondary" : "btn btn-primary"} onClick={() => setProviders({ ...providers, custom: !providers.custom })}>
                                            {providers.custom ? 'Desconectar' : 'Conectar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚙️</span> Parámetros Globales
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Temperatura por Defecto (Simulador): {globalParams.temperature}</label>
                                    <input type="range" min="0" max="1" step="0.1" value={globalParams.temperature} onChange={(e) => setGlobalParams({ ...globalParams, temperature: parseFloat(e.target.value) })} style={{ width: '100%', marginBottom: '0.5rem' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <span>Preciso (0.0)</span>
                                        <span>Creativo (1.0)</span>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Límite de Tokens por Respuesta</label>
                                    <input type="number" value={globalParams.maxTokens} onChange={(e) => setGlobalParams({ ...globalParams, maxTokens: parseInt(e.target.value) })} className="form-input" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={saveSettings} disabled={saving}>
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'facturacion' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Resumen de Facturación */}
                        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Consumo Total (Mes Actual)</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>44.5M <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>tokens</span></div>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Coste API Estimado</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>$891.00</div>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Margen de Beneficio IA</div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>+340%</div>
                            </div>
                        </div>

                        {/* Tabla de Consumo por Empresa */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Desglose por Empresa</h2>
                                <button className="btn btn-secondary">Exportar CSV</button>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Empresa</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Plan</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Tokens Consumidos</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Coste Facturable</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado Pago</th>
                                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {companiesBilling.map(company => (
                                            <tr key={company.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#fff' }}>{company.name}</td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{company.plan}</span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>
                                                    {(company.tokensUsed / 1000000).toFixed(1)}M
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', color: 'var(--warning)', fontWeight: 500 }}>
                                                    ${company.cost.toFixed(2)}
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem' }}>
                                                    <span className={`badge ${company.status === 'Al día' ? 'badge-success' : 'badge-warning'}`}>
                                                        {company.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Ver Detalle</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';

export default function InfraestructuraPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Simular carga inicial de métricas
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Cargando métricas del sistema...</div>;
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                        Estado del Sistema e Infraestructura ⚡
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        Monitorización en tiempo real de costes de IA, base de datos (Supabase) y despliegue (Vercel).
                    </p>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={handleRefresh}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <span style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none', display: 'inline-block' }}>🔄</span>
                    {refreshing ? 'Actualizando...' : 'Refrescar Métricas'}
                </button>
            </div>

            {/* ========================================== */}
            {/* 1. COSTES Y CONSUMO DE IA (GLOBAL) */}
            {/* ========================================== */}
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🤖</span> Consumo Global de IA (Mes Actual)
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(16, 163, 127, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(16, 163, 127, 0.3)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Coste Estimado Total</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>$342.50</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>+12% vs mes anterior</div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tokens Procesados (Input)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>14.2M</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Principalmente RAG y normativas</div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Tokens Generados (Output)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>3.8M</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Evaluaciones y Simulador</div>
                </div>
                <div className="card">
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Llamadas a API (OpenAI/Anthropic)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>45,210</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--error)', marginTop: '0.5rem' }}>12 errores (Rate Limit)</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* ========================================== */}
                {/* 2. ESTADO DE LA BASE DE DATOS (SUPABASE) */}
                {/* ========================================== */}
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🗄️</span> Supabase (leyes 34)
                    </h2>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                                <span style={{ fontWeight: 600 }}>Conexión Activa</span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>eu-north-1</span>
                        </div>
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Almacenamiento (Database)</span>
                                <span style={{ fontWeight: 500 }}>142 MB / 500 MB</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                <div style={{ width: '28%', height: '100%', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Vectores (pgvector)</span>
                                <span style={{ fontWeight: 500 }}>45,000 chunks</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Políticas RLS</span>
                                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Activas (12 tablas)</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Conexiones Pool (pgBouncer)</span>
                                <span style={{ fontWeight: 500 }}>14 / 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================== */}
                {/* 3. ESTADO DEL DESPLIEGUE (VERCEL) */}
                {/* ========================================== */}
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>▲</span> Vercel Edge & Serverless
                    </h2>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
                                <span style={{ fontWeight: 600 }}>Producción Operativa</span>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>thoth-app.vercel.app</span>
                        </div>
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Solicitudes (Últimas 24h)</span>
                                <span style={{ fontWeight: 500 }}>12,450</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Tiempo de respuesta (P90)</span>
                                <span style={{ fontWeight: 500 }}>240ms</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Errores 5xx</span>
                                <span style={{ color: 'var(--success)', fontWeight: 500 }}>0.01% (Saludable)</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Último Despliegue</span>
                                <span style={{ fontWeight: 500 }}>Hace 12 min (main)</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* ========================================== */}
            {/* 4. PANEL DE ALERTAS Y PROBLEMAS */}
            {/* ========================================== */}
            <h2 style={{ fontSize: '1.2rem', margin: '2.5rem 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🚨</span> Diagnóstico y Alertas
            </h2>
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--error)' }}>Rate Limit Alcanzado (OpenAI)</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hace 45 minutos el tenant "TechCorp" superó el límite de tokens por minuto. Las misiones se encolaron correctamente.</div>
                    </div>
                    <button className="btn btn-secondary" style={{ marginLeft: 'auto', fontSize: '0.85rem' }}>Ver Logs</button>
                </div>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>✅</span>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--success)' }}>Backup de Base de Datos</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Copia de seguridad diaria completada con éxito (Tamaño: 142MB).</div>
                    </div>
                </div>
                <div style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>✅</span>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--success)' }}>Sincronización Vectorial</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>El índice de pgvector está sincronizado y optimizado.</div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}

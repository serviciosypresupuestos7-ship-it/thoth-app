'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function WorkerPanelPage() {
    const [pendingMissions, setPendingMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('user_missions')
                .select(`
                    id,
                    status,
                    missions (
                        id,
                        title,
                        description,
                        difficulty
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'pending')
                .limit(3);

            if (data && data.length > 0) {
                setPendingMissions(data);
            } else {
                // Mock data fallback
                setPendingMissions([
                    { missions: { title: 'Resumir contrato de confidencialidad', description: 'Aprende a extraer datos clave sin exponer información sensible.', difficulty: 'Media' } },
                    { missions: { title: 'Escribir correo a cliente enfadado', description: 'Usa la IA para redactar una respuesta empática y profesional.', difficulty: 'Alta' } }
                ]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>
                    ¡Hola, Trabajador! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Tienes <strong style={{ color: 'var(--warning)' }}>{pendingMissions.length} misiones</strong> pendientes para mantener tu cualificación.
                </p>
            </div>

            {/* ========================================== */}
            {/* 🏛️ LA NUEVA JERARQUÍA VISUAL (HERO SECTION) */}
            {/* ========================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 1. Botón Principal: Acceso a Cualificación */}
                    <Link href="/worker/misiones" style={{
                        flex: 2,
                        background: 'linear-gradient(135deg, var(--primary) 0%, #b38b1d 100%)',
                        color: '#000',
                        padding: '2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 30px rgba(201, 162, 39, 0.3)',
                        transition: 'transform 0.2s ease'
                    }} className="hover-scale">
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>El Camino Oficial</div>
                            <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>Acceso a Cualificación</h2>
                            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>Entra directo a tu misión activa. Sin rodeos.</p>
                            <div style={{ marginTop: '1rem', display: 'inline-block', background: 'rgba(0,0,0,0.3)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                ⚠️ Paso 1: Prueba de Nivel Pendiente
                            </div>
                        </div>
                        <div style={{ fontSize: '4rem' }}>🎯</div>
                    </Link>

                    {/* 2. Botón Secundario: Ruta Express */}
                    <Link href="/express" style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, var(--error) 0%, #cc3a3a 100%)',
                        color: '#fff',
                        padding: '2rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                        transition: 'transform 0.2s ease'
                    }} className="hover-scale">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontSize: '3rem' }}>🚀</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(0,0,0,0.2)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>Intensivo</div>
                        </div>
                        <h2 style={{ fontSize: '1.8rem', margin: '1rem 0 0.5rem 0', fontWeight: 700 }}>Ruta Express</h2>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Completa toda tu evaluación de forma continua en una sola sesión.</p>
                    </Link>
                </div>

                {/* 3. Botón de Práctica: Simulador IA */}
                <Link href="/worker/simulador" style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-secondary)',
                    padding: '1.25rem 2rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                }} className="hover-glow">
                    <span style={{ fontSize: '1.5rem' }}>🤖</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Entrar al Simulador IA (Entorno Seguro de Práctica)</span>
                    <span style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem' }}>No afecta a tus métricas</span>
                </Link>

            </div>

            {/* Separador Visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', opacity: 0.5 }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tu Panel de Consulta</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>

            {/* ========================================== */}
            {/* 📉 LO QUE PASA A SEGUNDO PLANO (CONSULTA) */}
            {/* ========================================== */}

            {/* Los Contadores (Fila de tarjetas pequeñas) */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>📈</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Progreso</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>78%</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>🎯</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Misiones</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>{pendingMissions.length}</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>🧠</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Competencias</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>4/6</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '2rem' }}>🏆</div>
                    <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Certificados</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>1</div>
                    </div>
                </div>
            </div>

            {/* Formación Continua */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(16, 163, 127, 0.05) 0%, rgba(0,0,0,0.2) 100%)', border: '1px solid rgba(16, 163, 127, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🔄</span>
                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--success)' }}>Formación Continua</h3>
                    </div>
                    <span className="badge badge-success">Novedades</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    Mantente al día. Aquí aparecerán las nuevas políticas de la empresa y los módulos de actualización mensual para mantener tu cualificación activa.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Actualización: Uso de Copilot</div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Octubre 2026</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Nuevas directrices sobre cómo usar Microsoft Copilot con documentos internos.</div>
                        <Link href="/worker/formacion" style={{ color: 'var(--success)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>Iniciar módulo (10 min) →</Link>
                    </div>
                </div>
            </div>

            {/* Biblioteca y Lecturas Recomendadas */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📚 Biblioteca y Lecturas Recomendadas</h3>
                    <Link href="/worker/formacion" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Ver todo el Generador de Temarios →</Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>📄</div>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Guía Práctica AI Act</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Conceptos clave sobre la nueva normativa.</div>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>🛡️</div>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>Política Interna de Datos</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Actualización Q3 sobre manejo de datos.</div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-scale:hover { transform: translateY(-4px); }
                .hover-glow:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; color: #fff !important; }
            `}} />
        </div>
    );
}

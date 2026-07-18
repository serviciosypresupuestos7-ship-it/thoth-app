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
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    ¡Hola, Trabajador! 👋
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Aquí tienes un resumen de tu progreso y misiones pendientes.
                </p>
            </div>

            {/* Top Metrics */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '0' }}>
                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(201, 162, 39, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Progreso General</h3>
                        <span style={{ fontSize: '1.5rem' }}>📈</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.5rem' }}>
                        78%
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
                        <div style={{ width: '78%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Misiones Pendientes</h3>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)', marginTop: '0.5rem' }}>
                        {pendingMissions.length}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {pendingMissions.filter(m => m.missions?.difficulty === 'Alta').length} de alta prioridad
                    </p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Competencias</h3>
                        <span style={{ fontSize: '1.5rem' }}>🧠</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '0.5rem' }}>
                        4/6
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Nivel intermedio alcanzado
                    </p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>Certificados</h3>
                        <span style={{ fontSize: '1.5rem' }}>🏆</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginTop: '0.5rem' }}>
                        1
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Uso Seguro de IA (Básico)
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Misiones Pendientes */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Misiones Pendientes</h2>
                            <Link href="/worker/misiones" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Ver todas →</Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loading ? (
                                <div style={{ color: 'var(--text-muted)' }}>Cargando misiones...</div>
                            ) : pendingMissions.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)' }}>No tienes misiones pendientes. ¡Buen trabajo!</div>
                            ) : (
                                pendingMissions.map((pm, idx) => (
                                    <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span className={`badge ${pm.missions?.difficulty === 'Alta' ? 'badge-danger' : 'badge-warning'}`}>
                                                    {pm.missions?.difficulty || 'Media'}
                                                </span>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{pm.missions?.title}</h4>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{pm.missions?.description}</p>
                                        </div>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Iniciar</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Formación Recomendada */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Formación Recomendada</h2>
                            <Link href="/worker/formacion" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Ir a Biblioteca →</Link>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="card" style={{ padding: '1.25rem', background: 'rgba(30, 78, 140, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Guía Práctica AI Act</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Conceptos clave sobre la nueva normativa europea.</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', flex: 1 }}>Leer Resumen</button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', flex: 1 }}>Chat IA</button>
                                </div>
                            </div>

                            <div className="card" style={{ padding: '1.25rem', background: 'rgba(30, 78, 140, 0.2)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Política Interna de Datos</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Actualización Q3 sobre manejo de datos de clientes.</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', flex: 1 }}>Leer Resumen</button>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', flex: 1 }}>Chat IA</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Avisos / Actualizaciones */}
                    <div className="card" style={{ border: '1px solid var(--primary-glow)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🔔</span> Avisos Importantes
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>NUEVA NORMATIVA</span>
                                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Se ha actualizado la guía AESIA. Tienes 1 nueva misión asignada.</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 'bold', textTransform: 'uppercase' }}>LOGRO DESBLOQUEADO</span>
                                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Has alcanzado el 92% en Protección de Datos.</p>
                            </div>
                        </div>
                    </div>

                    {/* Laboratorio IA Promo */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(30, 78, 140, 0.4) 0%, rgba(201, 162, 39, 0.1) 100%)', textAlign: 'center', padding: '2rem 1.5rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Laboratorio IA</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Practica libremente, mejora tus prompts o simula escenarios sin afectar tus métricas.
                        </p>
                        <Link href="/worker/laboratorio" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                            Entrar al Laboratorio
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}

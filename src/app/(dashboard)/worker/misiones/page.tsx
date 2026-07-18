'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Mission {
    id: string;
    title: string;
    action: string;
    difficulty: string;
    status: string;
    time: string;
}

export default function MisionesPage() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
    const supabase = createClient();

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch user missions joined with missions table
            const { data, error } = await supabase
                .from('user_missions')
                .select(`
                    id,
                    status,
                    missions (
                        id,
                        title,
                        target_action,
                        difficulty
                    )
                `)
                .eq('user_id', user.id);

            if (error) throw error;

            if (data && data.length > 0) {
                const formattedMissions = data.map((um: any) => ({
                    id: um.missions.id,
                    title: um.missions.title,
                    action: um.missions.target_action || 'Acción general',
                    difficulty: um.missions.difficulty || 'Media',
                    status: um.status,
                    time: '15 min' // Simulated time
                }));
                setMissions(formattedMissions);
            } else {
                // Fallback to mock data if DB is empty so the UI doesn't look broken
                setMissions([
                    { id: '1', title: 'Escribir correo a cliente enfadado', action: 'Redactar correos', difficulty: 'Alta', status: 'pending', time: '10 min' },
                    { id: '2', title: 'Resumir contrato de confidencialidad', action: 'Resumir documentos', difficulty: 'Media', status: 'pending', time: '15 min' },
                    { id: '3', title: 'Analizar CV para puesto técnico', action: 'Analizar CV', difficulty: 'Baja', status: 'completed', time: '5 min' },
                    { id: '4', title: 'Generar presupuesto de servicios', action: 'Generar presupuesto', difficulty: 'Media', status: 'completed', time: '12 min' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching missions:', error);
        } finally {
            setLoading(false);
        }
    };

    const pendingCount = missions.filter(m => m.status === 'pending').length;
    const completedCount = missions.filter(m => m.status === 'completed').length;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Tus Misiones 🎯
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Situaciones reales basadas en tu puesto de trabajo. Resuélvelas utilizando IA para demostrar tu competencia y ganar certificados.
                    </p>
                </div>
                <button className="btn btn-primary">+ Generar Nueva Misión</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                <div
                    onClick={() => setActiveTab('pending')}
                    style={{ paddingBottom: '1rem', borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'pending' ? 600 : 400, cursor: 'pointer' }}
                >
                    Pendientes ({pendingCount})
                </div>
                <div
                    onClick={() => setActiveTab('completed')}
                    style={{ paddingBottom: '1rem', borderBottom: activeTab === 'completed' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'completed' ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: activeTab === 'completed' ? 600 : 400, cursor: 'pointer' }}
                >
                    Completadas ({completedCount})
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando misiones...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {missions.filter(m => m.status === activeTab).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            No tienes misiones en esta categoría.
                        </div>
                    ) : (
                        missions.filter(m => m.status === activeTab).map(mission => (
                            <div key={mission.id} className="card" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '12px',
                                        background: mission.difficulty === 'Alta' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: mission.difficulty === 'Alta' ? 'var(--error)' : 'var(--warning)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                                    }}>
                                        {mission.difficulty === 'Alta' ? '🔥' : '⚡'}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{mission.title}</h3>
                                            <span className={`badge ${mission.difficulty === 'Alta' ? 'badge-danger' : 'badge-warning'}`}>
                                                {mission.difficulty}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <span>Acción: {mission.action}</span>
                                            <span>•</span>
                                            <span>⏱️ Tiempo est: {mission.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                                    {activeTab === 'pending' ? 'Iniciar Misión' : 'Revisar Resultados'}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

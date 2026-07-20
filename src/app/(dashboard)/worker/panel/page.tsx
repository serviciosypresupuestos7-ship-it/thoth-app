'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface WorkerProfile {
    id: string;
    full_name: string | null;
    role: string | null;
    company_id: string | null;
    companies?: { name: string } | null;
}

interface Evidence {
    id: string;
    evidence_type: string;
    detail: string;
    created_at: string;
}

export default function WorkerPanelPage() {
    const [profile, setProfile] = useState<WorkerProfile | null>(null);
    const [evidences, setEvidences] = useState<Evidence[]>([]);
    const [loading, setLoading] = useState(true);
    const [qualLevel, setQualLevel] = useState<string | null>(null);
    const [testDone, setTestDone] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const testPrevio = localStorage.getItem('thoth_test_previo_done');
        setTestDone(testPrevio === 'true');
        const level = localStorage.getItem('thoth_qualification_level');
        setQualLevel(level);
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: prof } = await supabase
                .from('profiles')
                .select('id, full_name, role, company_id')
                .eq('id', user.id)
                .single();

            if (prof) setProfile(prof);

            const { data: evid } = await supabase
                .from('evidences')
                .select('id, evidence_type, detail, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3);

            if (evid) setEvidences(evid);
        } catch (e) {
            // Fallback mock
            setProfile({ id: '1', full_name: 'Trabajador Demo', role: 'worker', company_id: null });
        } finally {
            setLoading(false);
        }
    };

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'TK';

    const levelInfo = {
        inicial: { label: 'Nivel Inicial', color: 'var(--success)', icon: '🌱' },
        media: { label: 'Nivel Medio', color: 'var(--warning)', icon: '⚡' },
        express: { label: 'Certificado Express', color: 'var(--primary)', icon: '🚀' },
    };

    const currentLevel = qualLevel ? levelInfo[qualLevel as keyof typeof levelInfo] : null;

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Cargando tu panel...</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '1.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>

            {/* ===== TARJETA DE IDENTIDAD DEL TRABAJADOR ===== */}
            <div className="card" style={{
                padding: '2rem',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(20,20,20,0.9) 100%)',
                border: '1px solid rgba(201,162,39,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                flexWrap: 'wrap'
            }}>
                {/* Avatar */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), #b38b1d)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 800, color: '#000', flexShrink: 0,
                    boxShadow: '0 0 30px rgba(201,162,39,0.3)'
                }}>
                    {initials}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>
                        Trabajador Identificado ✓
                    </div>
                    <h1 style={{ fontSize: '1.8rem', margin: '0 0 0.25rem 0', color: '#fff' }}>
                        {profile?.full_name || 'Trabajador'}
                    </h1>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {profile?.role || 'Empleado'} · Sistema THOTH de Competencias en IA
                    </div>
                </div>

                {/* Estado de Cualificación */}
                <div style={{ textAlign: 'center' }}>
                    {currentLevel ? (
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: `rgba(${currentLevel.color === 'var(--success)' ? '16,163,127' : currentLevel.color === 'var(--warning)' ? '245,158,11' : '201,162,39'},0.1)`,
                            border: `1px solid ${currentLevel.color}`,
                            borderRadius: '12px', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{currentLevel.icon}</div>
                            <div style={{ fontSize: '0.8rem', color: currentLevel.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {currentLevel.label}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Cualificación activa</div>
                        </div>
                    ) : (
                        <div style={{
                            padding: '1rem 1.5rem',
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '12px', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>⚠️</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Sin Cualificar
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Obligatorio por ley</div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== ALERTA DE FORMACIÓN CONTINUA (si ya tiene nivel) ===== */}
            {currentLevel && (
                <div style={{
                    padding: '1rem 1.5rem',
                    background: 'rgba(16,163,127,0.08)',
                    border: '1px solid rgba(16,163,127,0.2)',
                    borderRadius: '10px',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🔔</span>
                    <div>
                        <strong style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Formación Continua — Actualización disponible</strong>
                        <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Nuevas directrices sobre el AI Act (Art. 4) actualizadas en Julio 2026. Completa el módulo de actualización para mantener tu certificado activo.
                        </p>
                    </div>
                    <Link href="/worker/autoevaluacion" className="btn btn-secondary" style={{ textDecoration: 'none', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        Ver actualización →
                    </Link>
                </div>
            )}

            {/* ===== TARJETAS DE ACCESO PRINCIPAL ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>

                {/* Card 1: Test de Conocimiento Previo (PUERTA DE ENTRADA) */}
                <Link href="/worker/autoevaluacion" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        padding: '2rem',
                        border: testDone ? '1px solid rgba(16,163,127,0.3)' : '1px solid rgba(201,162,39,0.4)',
                        background: testDone
                            ? 'linear-gradient(135deg, rgba(16,163,127,0.05) 0%, rgba(0,0,0,0.3) 100%)'
                            : 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(0,0,0,0.3) 100%)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                        {!testDone && (
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'var(--primary)', color: '#000',
                                fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                                borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>PASO 1</div>
                        )}
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{testDone ? '✅' : '📋'}</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>
                            Test de Conocimiento Previo
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                            {testDone
                                ? 'Completado. Puedes repetirlo para formación continua.'
                                : 'Obligatorio antes de acceder a la cualificación oficial. Basado en la normativa vigente.'}
                        </p>
                        <div style={{ marginTop: '1.5rem', color: testDone ? 'var(--success)' : 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {testDone ? '✓ Completado · Repetir →' : 'Comenzar test →'}
                        </div>
                    </div>
                </Link>

                {/* Card 2: Mi Cualificación Oficial */}
                <Link href={testDone ? '/worker/cualificacion' : '/worker/autoevaluacion'} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        padding: '2rem',
                        border: currentLevel ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(135deg, rgba(201,162,39,0.05) 0%, rgba(0,0,0,0.3) 100%)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        opacity: testDone ? 1 : 0.6,
                        position: 'relative'
                    }}
                        onMouseEnter={e => { if (testDone) e.currentTarget.style.transform = 'translateY(-3px)'; }}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                        {!testDone && (
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)',
                                fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '20px'
                            }}>🔒 Requiere test previo</div>
                        )}
                        {testDone && (
                            <div style={{
                                position: 'absolute', top: '1rem', right: '1rem',
                                background: 'var(--primary)', color: '#000',
                                fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                                borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px'
                            }}>PASO 2</div>
                        )}
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>
                            Mi Cualificación Oficial
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                            3 niveles disponibles: Inicial, Medio y Express. Cada nivel incluye formación por temas y test de verificación.
                        </p>
                        <div style={{ marginTop: '1.5rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {currentLevel ? `${currentLevel.icon} ${currentLevel.label} activo · Mejorar nivel →` : 'Seleccionar nivel →'}
                        </div>
                    </div>
                </Link>

                {/* Card 3: Simulador IA */}
                <Link href="/worker/simulador" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        padding: '2rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        display: 'flex', flexDirection: 'column'
                    }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>
                            Simulador IA Seguro
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5, flex: 1 }}>
                            Practica con escenarios reales de tu puesto en un entorno seguro. No afecta a tus métricas oficiales.
                        </p>
                        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '4px', display: 'inline-block', color: 'var(--text-muted)' }}>
                            Entorno de práctica · Sin consecuencias
                        </div>
                    </div>
                </Link>

                {/* Card 4: Mi Progreso */}
                <Link href="/worker/progreso" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                        padding: '2rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease'
                    }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fff' }}>
                            Mi Progreso y Evidencias
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                            Consulta tu historial de resultados, certificados obtenidos y evidencias legales guardadas.
                        </p>
                        <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            {evidences.length > 0 ? `${evidences.length} evidencias registradas →` : 'Ver mi historial →'}
                        </div>
                    </div>
                </Link>
            </div>

            {/* ===== ÚLTIMAS EVIDENCIAS ===== */}
            {evidences.length > 0 && (
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📁</span> Últimas Evidencias Registradas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {evidences.map(ev => (
                            <div key={ev.id} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '0.75rem 1rem',
                                background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>
                                    {ev.evidence_type?.includes('Aprobado') ? '✅' : '📋'}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500 }}>{ev.evidence_type}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{ev.detail?.slice(0, 80)}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {new Date(ev.created_at).toLocaleDateString('es-ES')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== FORMACIÓN CONTINUA: CAPACITACIONES NUEVAS ===== */}
            <div className="card" style={{
                padding: '1.5rem', marginTop: '1.5rem',
                border: '1px solid rgba(16,163,127,0.15)',
                background: 'linear-gradient(135deg, rgba(16,163,127,0.03) 0%, rgba(0,0,0,0.2) 100%)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🔄</span> Capacitaciones y Formación Continua
                    </h3>
                    <span className="badge badge-success">Actualizado</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                        { icon: '⚖️', title: 'AI Act — Art. 4 actualizado', desc: 'Nuevas obligaciones de alfabetización IA · Julio 2026', estado: 'Nuevo', color: 'var(--error)' },
                        { icon: '🛡️', title: 'RGPD e IA Generativa', desc: 'Cómo usar IA sin comprometer datos personales', estado: 'Disponible', color: 'var(--warning)' },
                        { icon: '🤖', title: 'Sistemas de Alto Riesgo', desc: 'Identificar cuándo la IA afecta decisiones críticas', estado: 'Avanzado', color: 'var(--primary)' },
                        { icon: '📝', title: 'Uso Responsable de Prompts', desc: 'Anonimización y buenas prácticas al usar IA', estado: 'Básico', color: 'var(--success)' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px',
                            borderLeft: `3px solid ${item.color}`,
                            display: 'flex', gap: '1rem', alignItems: 'flex-start'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '0.25rem' }}>{item.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.desc}</div>
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                                    borderRadius: '20px', background: `${item.color}22`, color: item.color
                                }}>{item.estado}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                    <Link href="/worker/cualificacion" className="btn btn-secondary" style={{ textDecoration: 'none', fontSize: '0.85rem' }}>
                        Ver todos los módulos de formación →
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';

export default function ActivityPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading the nightly activity data
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="activity-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '2.5rem' }}>🧠</span> Actividad de THOTH
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    THOTH analiza el BOE, EUR-Lex y fuentes oficiales continuamente. Aquí puedes ver el trabajo realizado en segundo plano durante las últimas 24 horas.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                    Recopilando registros de actividad del motor...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Resumen de la noche */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--primary)' }}>●</span> Resumen de las últimas 24h
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>3</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Leyes nuevas analizadas</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>47</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Conceptos nuevos</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#8b5cf6', lineHeight: '1' }}>12</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Relaciones detectadas</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--success)', lineHeight: '1' }}>6</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Oportunidades propuestas</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--danger)', lineHeight: '1' }}>2</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Conflictos normativos</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--warning)', lineHeight: '1' }}>18</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Respuestas para revisión</div>
                            </div>

                        </div>
                    </div>

                    {/* Log detallado */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--primary)' }}>●</span> Registro de Operaciones del Motor
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Item 1 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--danger)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Conflicto Detectado</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>04:12 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Contradicción identificada entre la nueva directiva europea y la normativa nacional vigente.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    El <strong>Art. 12</strong> de la nueva directiva establece un plazo de 30 días, mientras que el <strong>Art. 45</strong> de la ley nacional indica 60 días. Se ha marcado la respuesta #1402 como obsoleta y requiere revisión humana.
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid #8b5cf6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#c4b5fd', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Nueva Relación Inferida</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>03:45 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Conexión establecida entre "Supervisión Humana" (AI Act) y "Decisiones Automatizadas" (RGPD).
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    THOTH ha inferido que los requisitos de supervisión del AI Act actúan como garantía adicional para los derechos establecidos en el Art. 22 del RGPD. Se ha propuesto una nueva relación en el grafo jurídico.
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--success)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Oportunidad Propuesta</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>02:30 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Identificada posible bonificación en cuotas de la Seguridad Social.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Al analizar la actualización del BOE-A-2024-1234, THOTH ha detectado una nueva oportunidad de bonificación para autónomos del sector tecnológico. Pendiente de validación por un experto.
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Ingesta Completada</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>01:15 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Procesamiento de 3 nuevas normativas finalizado.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Se han extraído 47 conceptos nuevos y se han actualizado los embeddings vectoriales. El corpus de conocimiento está listo para consultas.
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

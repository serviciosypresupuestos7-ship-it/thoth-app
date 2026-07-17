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
                    <span style={{ fontSize: '2.5rem' }}>📡</span> Radar Normativo
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    THOTH monitoriza continuamente el BOE, EUR-Lex y guías oficiales (AEPD, AESIA). Cuando detecta un cambio legal, actualiza automáticamente las misiones de tus empleados.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                    Sincronizando con fuentes oficiales...
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Resumen de la noche */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--primary)' }}>●</span> Impacto Normativo (Últimos 7 días)
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>2</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Nuevas Leyes/Guías</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>5</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Misiones Actualizadas</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#8b5cf6', lineHeight: '1' }}>12</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Empleados Notificados</div>
                            </div>

                            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                                <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--warning)', lineHeight: '1' }}>3</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Acciones en Riesgo</div>
                            </div>

                        </div>
                    </div>

                    {/* Log detallado */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: 'var(--primary)' }}>●</span> Registro de Actualizaciones
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Item 1 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--warning)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Cambio Normativo Detectado</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hoy, 08:30 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Nueva guía de la AEPD sobre el uso de IA en Recursos Humanos.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Se ha detectado una nueva directriz que prohíbe el filtrado automático de CVs sin revisión humana. <strong>Impacto:</strong> La acción "Filtrar CVs" ha pasado a estado de riesgo.
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid #8b5cf6' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#c4b5fd', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Misiones Generadas Automáticamente</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hoy, 08:35 AM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    THOTH ha creado 2 nuevas misiones para el departamento de RRHH.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Basado en la nueva guía de la AEPD, se han generado casos prácticos sobre cómo realizar el triaje de candidatos cumpliendo con la obligación de supervisión humana.
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--success)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Competencia Validada</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ayer, 16:45 PM</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    El equipo Comercial ha superado la misión "Uso de ChatGPT con datos de clientes".
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    4 empleados han completado con éxito la misión, demostrando conocimiento sobre la anonimización de datos (RGPD Art. 5). El nivel de riesgo del departamento ha bajado a "Bajo".
                                </div>
                            </div>

                            {/* Item 4 */}
                            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '3px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Ingesta de AI Act Completada</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hace 3 días</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
                                    Procesamiento del Reglamento Europeo de Inteligencia Artificial (AI Act) finalizado.
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Se han extraído las obligaciones para "Desplegadores de IA" y se han mapeado contra las acciones registradas de los empleados.
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

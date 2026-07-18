'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function HRPanelPage() {
    const [employeeCount, setEmployeeCount] = useState<number>(0);
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

            // Get HR's company_id
            const { data: profile } = await supabase
                .from('profiles')
                .select('company_id')
                .eq('id', user.id)
                .single();

            if (profile?.company_id) {
                // Get count of employees in the same company
                const { count, error } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .eq('company_id', profile.company_id);

                if (!error && count !== null) {
                    setEmployeeCount(count);
                }
            } else {
                // Fallback if no company assigned yet
                setEmployeeCount(124); // Mock data
            }
        } catch (error) {
            console.error('Error fetching HR data:', error);
            setEmployeeCount(124); // Mock data fallback
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Panel de Empresa (RRHH) 🏢
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Visión global del estado de cumplimiento y formación en IA de toda tu plantilla.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">Exportar Informe PDF</button>
                    <button className="btn btn-primary">+ Invitar Empleados</button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '0' }}>
                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Plantilla Formada</h3>
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '0.5rem' }}>
                        64%
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '1rem', overflow: 'hidden' }}>
                        <div style={{ width: '64%', height: '100%', background: 'var(--success)', borderRadius: '3px' }}></div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        De {loading ? '...' : employeeCount} empleados totales
                    </p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Riesgos Críticos</h3>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--error)', marginTop: '0.5rem' }}>
                        12
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Empleados usando IA sin certificar
                    </p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Misiones Completadas</h3>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginTop: '0.5rem' }}>
                        342
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        +45 esta semana
                    </p>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>Certificados Emitidos</h3>
                        <span style={{ fontSize: '1.5rem' }}>🏆</span>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', marginTop: '0.5rem' }}>
                        89
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Válidos para auditoría AI Act
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2.5rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Estado por Departamentos */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Estado por Departamentos</h2>
                            <Link href="/hr/informes" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>Ver detalle →</Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {/* Dept 1 */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 500 }}>Marketing y Ventas</span>
                                    <span style={{ color: 'var(--success)' }}>85% Formados</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '85%', height: '100%', background: 'var(--success)' }}></div>
                                </div>
                            </div>

                            {/* Dept 2 */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 500 }}>Recursos Humanos</span>
                                    <span style={{ color: 'var(--warning)' }}>60% Formados</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '60%', height: '100%', background: 'var(--warning)' }}></div>
                                </div>
                            </div>

                            {/* Dept 3 */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 500 }}>Atención al Cliente</span>
                                    <span style={{ color: 'var(--error)' }}>32% Formados</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '32%', height: '100%', background: 'var(--error)' }}></div>
                                </div>
                                <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>⚠️ Alto riesgo: Uso intensivo de IA detectado sin certificación.</p>
                            </div>
                        </div>
                    </div>

                    {/* Últimas Evidencias Generadas */}
                    <div>
                        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Últimas Evidencias (Compliance)</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Empleado</th>
                                    <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Competencia</th>
                                    <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Fecha</th>
                                    <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 0.5rem' }}>Ana Martínez</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>Protección de Datos (IA)</td>
                                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Hoy, 10:23</td>
                                    <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-success">Certificado</span></td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 0.5rem' }}>Carlos López</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>Uso Ético de IA</td>
                                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Ayer, 16:45</td>
                                    <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-success">Certificado</span></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '1rem 0.5rem' }}>Laura Gómez</td>
                                    <td style={{ padding: '1rem 0.5rem' }}>Supervisión Humana</td>
                                    <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>Ayer, 11:10</td>
                                    <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-warning">En progreso</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Alertas y Actualizaciones */}
                    <div className="card" style={{ border: '1px solid var(--error-glow)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🔔</span> Alertas de Cumplimiento
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--error)', fontWeight: 'bold', textTransform: 'uppercase' }}>ACCIÓN REQUERIDA</span>
                                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0.5rem 0' }}>12 empleados del departamento de Atención al Cliente están usando herramientas de IA sin haber completado la formación obligatoria.</p>
                                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Asignar Ruta Urgente</button>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 'bold', textTransform: 'uppercase' }}>ACTUALIZACIÓN NORMATIVA</span>
                                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>Nueva directriz de la AEPD sobre uso de ChatGPT. 45 certificados necesitan renovación.</p>
                            </div>
                        </div>
                    </div>

                    {/* Competencias más débiles */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Competencias a Reforzar</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    <span>Supervisión Humana (HITL)</span>
                                    <span style={{ color: 'var(--error)' }}>42%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)' }}><div style={{ width: '42%', height: '100%', background: 'var(--error)' }}></div></div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                    <span>Detección de Alucinaciones</span>
                                    <span style={{ color: 'var(--warning)' }}>58%</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)' }}><div style={{ width: '58%', height: '100%', background: 'var(--warning)' }}></div></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

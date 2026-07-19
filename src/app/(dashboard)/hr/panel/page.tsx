'use client';

export default function HRDashboardPage() {
    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Header */}
            <div>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Estado de Cumplimiento IA 🛡️
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Monitorización continua de competencias, detección de riesgos y acciones recomendadas.
                </p>
            </div>

            {/* Top Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Competencia Global</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>91%</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginTop: '0.5rem' }}>↑ 2% este mes</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Riesgo IA Corporativo</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>Medio</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Atención requerida en 1 área</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--error)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Departamentos Críticos</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--error)' }}>RRHH</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Competencia por debajo del 75%</div>
                </div>

                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Trabajadores Activos</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff' }}>142</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>100% con licencia básica</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

                {/* Competence by Department & History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📊</span> Competencia por Departamento
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[
                                { name: 'IT & Desarrollo', score: 100, color: 'var(--success)' },
                                { name: 'Marketing & Ventas', score: 96, color: 'var(--success)' },
                                { name: 'Compras', score: 84, color: 'var(--warning)' },
                                { name: 'Recursos Humanos', score: 71, color: 'var(--error)' }
                            ].map(dept => (
                                <div key={dept.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 500 }}>{dept.name}</span>
                                        <span style={{ fontWeight: 'bold', color: dept.color }}>{dept.score}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${dept.score}%`, height: '100%', background: dept.color, borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2rem', background: 'linear-gradient(145deg, rgba(0,0,0,0.4) 0%, rgba(255,107,0,0.05) 100%)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📈</span> Evolución Histórica
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {[
                                { month: 'Ene', score: 63 },
                                { month: 'Feb', score: 74 },
                                { month: 'Mar', score: 89 },
                                { month: 'Abr', score: 91 },
                                { month: 'May', score: 88 }, // Bajada por nueva ley
                                { month: 'Jun', score: 96 }
                            ].map((data, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '40px' }}>
                                    <span style={{ fontSize: '0.8rem', color: data.score < 70 ? 'var(--error)' : data.score < 90 ? 'var(--warning)' : 'var(--success)' }}>{data.score}%</span>
                                    <div style={{ width: '100%', height: `${data.score}px`, background: data.score < 70 ? 'var(--error)' : data.score < 90 ? 'var(--warning)' : 'var(--primary)', borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{data.month}</span>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', textAlign: 'center' }}>
                            * La caída en Mayo refleja la entrada en vigor del AI Act. El sistema reentrenó a la plantilla en 3 semanas.
                        </p>
                    </div>
                </div>

                {/* Alerts and Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Alertas */}
                    <div className="card" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚠️</span> Alertas de Riesgo
                        </h2>
                        <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <li><strong style={{ color: '#fff' }}>8 trabajadores</strong> necesitan actualización urgente.</li>
                            <li><strong style={{ color: '#fff' }}>2 políticas internas</strong> pendientes de lectura.</li>
                            <li><strong style={{ color: 'var(--warning)' }}>Nueva actualización AI Act detectada</strong> (Art. 14).</li>
                        </ul>
                    </div>

                    {/* Acciones Recomendadas */}
                    <div className="card" style={{ padding: '2rem', border: '1px solid rgba(16, 163, 127, 0.2)', background: 'rgba(16, 163, 127, 0.05)', flex: 1 }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚡</span> Acciones Recomendadas
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn btn-secondary" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Asignar misión a RRHH</span>
                                <span>→</span>
                            </button>
                            <button className="btn btn-secondary" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Actualizar módulo Transparencia</span>
                                <span>→</span>
                            </button>
                            <button className="btn btn-secondary" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Regenerar evaluación global</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

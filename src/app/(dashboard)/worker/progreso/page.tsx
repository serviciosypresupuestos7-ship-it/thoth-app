'use client';

export default function ProgresoPage() {
    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Tu Progreso 📈
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Analiza tu evolución, revisa tu historial de aprendizaje y compara tu rendimiento.
                </p>
            </div>

            {/* Top Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '0', marginBottom: '2.5rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>24h</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tiempo de Estudio</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>14</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Misiones Superadas</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📝</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>3</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Exámenes Aprobados</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏆</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>Top 5%</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ranking Empresa</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Left Column: Charts & History */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Evolución Chart (Simulated) */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Evolución de Competencias (Últimos 6 meses)</h3>
                        <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {/* Simulated bars */}
                            {[30, 45, 55, 60, 75, 85].map((val, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '100%', height: `${val}%`, background: i === 5 ? 'var(--primary)' : 'rgba(201, 162, 39, 0.3)', borderRadius: '4px 4px 0 0', transition: 'all 0.3s ease' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mes {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historial Reciente */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Historial Reciente</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '1.5rem' }}>🎯</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Misión: Redacción de correo sin exponer datos</h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Completada con éxito • Puntuación: 95/100</p>
                                </div>
                                <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ayer</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '1.5rem' }}>📝</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Examen: AI Act Conceptos Básicos</h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Aprobado • Puntuación: 9/10</p>
                                </div>
                                <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 3 días</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ fontSize: '1.5rem' }}>📖</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>Lectura: Política Interna de Datos</h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>100% completado • 45 min de estudio</p>
                                </div>
                                <div style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 1 semana</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Badges & Ranking */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Insignias */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Insignias Obtenidas</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(201, 162, 39, 0.3)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>Guardián de Datos</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👁️</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>Ojo Crítico</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', opacity: 0.5 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>⚡</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Prompt Master</div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', opacity: 0.5 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', filter: 'grayscale(1)' }}>⚖️</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Legal Tech</div>
                            </div>
                        </div>
                    </div>

                    {/* Ranking */}
                    <div className="card" style={{ background: 'linear-gradient(145deg, rgba(30, 78, 140, 0.2) 0%, rgba(20, 20, 20, 0.8) 100%)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🏆</span> Ranking de Empresa
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', width: '20px' }}>1</span>
                                <span style={{ flex: 1 }}>Carlos M.</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>2,450 pts</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(201, 162, 39, 0.15)', border: '1px solid var(--primary)', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', width: '20px' }}>2</span>
                                <span style={{ flex: 1, fontWeight: 'bold' }}>Tú</span>
                                <span style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>2,120 pts</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', width: '20px' }}>3</span>
                                <span style={{ flex: 1 }}>Elena R.</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>1,980 pts</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

'use client';

export default function ActualizacionesPage() {
    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Actualizaciones Normativas 🔔
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Descubre cómo los cambios en la legislación afectan a tu empresa y qué acciones debes tomar para mantener el cumplimiento.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Alerta Crítica */}
                <div className="card" style={{ border: '1px solid var(--error)', background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                ⚠️
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.25rem 0', color: '#fff' }}>Nueva Guía AESIA sobre IA Generativa</h2>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Publicado hace 2 días por THOTH Legal Team</span>
                            </div>
                        </div>
                        <span className="badge badge-danger">Acción Requerida</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>RRHH</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Depto. Afectado</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>3</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Misiones Modificadas</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--error)' }}>5</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Trabajadores a Re-evaluar</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>1</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Nueva Competencia</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => alert('Mostrando detalles del cambio normativo...')}>Ver Detalles del Cambio</button>
                        <button className="btn btn-primary" onClick={() => alert('Misiones asignadas correctamente. Los trabajadores recibirán una notificación.')}>Asignar Misiones a los 5 Trabajadores</button>
                    </div>
                </div>

                {/* Historial de Actualizaciones */}
                <h3 style={{ fontSize: '1.3rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Historial de Cambios</h3>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span className="badge badge-success">Resuelto</span>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Actualización RGPD: Decisiones Automatizadas</h4>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
                                Se modificó el criterio de evaluación para exigir siempre supervisión humana en el filtrado de CVs.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <span>👥 12 trabajadores re-evaluados</span>
                                <span>✅ 100% completado</span>
                            </div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 2 meses</span>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>Informativo</span>
                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Entrada en vigor parcial del AI Act</h4>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1rem 0' }}>
                                Se añadieron nuevos módulos teóricos a la biblioteca. No requiere repetición de misiones prácticas.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <span>📚 3 nuevos documentos añadidos</span>
                            </div>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Hace 4 meses</span>
                    </div>
                </div>

            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function AdminValidacionPage() {
    const [activeTab, setActiveTab] = useState('misiones');

    const pendingMissions = [
        { id: '1', tipo: 'Nueva Misión', titulo: 'Redacción de despido disciplinario', ia_confidence: 95, fecha: 'Hace 2 horas' },
        { id: '2', tipo: 'Pregunta Examen', titulo: 'Test AI Act - Artículo 6', ia_confidence: 82, fecha: 'Hace 5 horas' },
        { id: '3', tipo: 'Resumen Documento', titulo: 'Guía AEPD sobre Biometría', ia_confidence: 78, fecha: 'Ayer' },
    ];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Centro de Validación (Human-in-the-loop) ✅
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    La IA propone, tú apruebas. Revisa el contenido generado automáticamente antes de que sea visible para las empresas y trabajadores.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel: Pending Queue */}
                <div className="card" style={{ flex: '0.35', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('misiones')}
                            style={{ flex: 1, padding: '0.5rem', background: activeTab === 'misiones' ? 'rgba(201, 162, 39, 0.1)' : 'transparent', border: 'none', color: activeTab === 'misiones' ? 'var(--primary)' : 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Pendientes (3)
                        </button>
                        <button
                            onClick={() => setActiveTab('historial')}
                            style={{ flex: 1, padding: '0.5rem', background: activeTab === 'historial' ? 'rgba(201, 162, 39, 0.1)' : 'transparent', border: 'none', color: activeTab === 'historial' ? 'var(--primary)' : 'var(--text-secondary)', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Historial
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                        {pendingMissions.map((item, idx) => (
                            <div
                                key={item.id}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: idx === 0 ? 'rgba(201, 162, 39, 0.1)' : 'rgba(0,0,0,0.2)',
                                    border: idx === 0 ? '1px solid var(--primary)' : '1px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>{item.tipo}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.fecha}</span>
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>{item.titulo}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <span style={{ color: item.ia_confidence > 90 ? 'var(--success)' : 'var(--warning)' }}>
                                        Confianza IA: {item.ia_confidence}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Review Interface */}
                <div className="card" style={{ flex: '0.65', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="badge" style={{ marginBottom: '0.5rem' }}>Nueva Misión</span>
                            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Redacción de despido disciplinario</h2>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>Rechazar</button>
                            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Editar</button>
                            <button className="btn btn-success" style={{ padding: '0.5rem 1.5rem' }}>Aprobar y Publicar</button>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Contexto */}
                        <div>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Contexto Generado</h3>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                                Eres un técnico de RRHH. Debes redactar una carta de despido disciplinario para un empleado que ha faltado injustificadamente 5 días consecutivos. Tienes que usar la IA para redactar el borrador, asegurándote de incluir los requisitos legales mínimos según el Estatuto de los Trabajadores.
                            </div>
                        </div>

                        {/* Criterios de Evaluación */}
                        <div>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Criterios de Evaluación (Rúbrica IA)</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Menciona la fecha de efectos del despido</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--success)' }}>Obligatorio</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Describe los hechos de forma clara y objetiva</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--success)' }}>Obligatorio</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Cita el artículo 54 del Estatuto de los Trabajadores</td>
                                        <td style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--warning)' }}>Recomendado</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Explicación Legal */}
                        <div>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Explicación Legal (Feedback para el usuario)</h3>
                            <div style={{ background: 'rgba(30, 78, 140, 0.1)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--success)', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                                El despido disciplinario requiere forma escrita, haciendo figurar los hechos que lo motivan y la fecha en que tendrá efectos (Art. 55.1 ET). Si la IA omite estos datos, el despido podría ser declarado improcedente por defectos de forma.
                            </div>
                        </div>

                        {/* Warning de la IA */}
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--warning)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                            <div>
                                <h4 style={{ color: 'var(--warning)', margin: '0 0 0.25rem 0' }}>Nota del Sistema IA</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    He generado esta misión basándome en el "Estatuto de los Trabajadores". La confianza en la extracción legal es del 95%. Por favor, verifica que la rúbrica de evaluación es correcta antes de aprobar.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

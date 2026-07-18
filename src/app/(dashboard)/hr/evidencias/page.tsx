'use client';

import { useState } from 'react';

export default function EvidenciasPage() {
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    const employees = [
        { id: '1', name: 'Ana Martínez', role: 'Especialista en Marketing', dept: 'Marketing', status: '✅ Competente', score: 92 },
        { id: '2', name: 'Carlos López', role: 'Atención al Cliente', dept: 'Soporte', status: '⚠️ En proceso', score: 65 },
        { id: '3', name: 'Laura Gómez', role: 'Analista de Datos', dept: 'IT', status: '✅ Competente', score: 88 },
    ];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Compliance y Evidencias 📋
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Centro de auditoría. Genera reportes legales que demuestran la capacitación de tu plantilla en el uso de IA según la normativa vigente.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">📥 Exportar Excel Global</button>
                    <button className="btn btn-primary">📄 Generar Informe de Auditoría (PDF)</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
                {/* Left Panel: Employee List */}
                <div className="card" style={{ flex: '0.35', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="Buscar trabajador o departamento..."
                            className="form-input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                        {employees.map(emp => (
                            <div
                                key={emp.id}
                                onClick={() => setSelectedEmployee(emp.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: selectedEmployee === emp.id ? 'rgba(201, 162, 39, 0.1)' : 'rgba(0,0,0,0.2)',
                                    border: selectedEmployee === emp.id ? '1px solid var(--primary)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 600, color: '#fff' }}>{emp.name}</span>
                                    <span style={{ fontSize: '0.85rem' }}>{emp.status}</span>
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {emp.role} • {emp.dept}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Justification & Evidence */}
                <div className="card" style={{ flex: '0.65', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {!selectedEmployee ? (
                        <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3>Selecciona un trabajador</h3>
                            <p>Para ver su justificación de competencia y evidencias.</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Ana Martínez</h2>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Especialista en Marketing • ID: EMP-2026-042</p>
                                </div>
                                <button className="btn btn-secondary">Descargar Dossier Individual</button>
                            </div>

                            {/* Justificación de Competencia */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>⚖️</span> ¿Por qué consideramos competente a este trabajador?
                                </h3>
                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--success)', padding: '1.5rem', borderRadius: '0 8px 8px 0' }}>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        Ana Martínez ha demostrado un nivel de competencia del <strong>92%</strong> en el uso de herramientas de IA generativa aplicadas a su rol.
                                        Ha completado satisfactoriamente la lectura y evaluación de la <em>Guía Interna de Uso de IA</em> y la <em>Política de Protección de Datos</em>.
                                        Además, ha superado 14 misiones prácticas, demostrando su capacidad para aplicar la <strong>supervisión humana (HITL)</strong> y evitar la introducción de datos sensibles (RGPD) en prompts públicos.
                                    </p>
                                </div>
                            </div>

                            {/* Registro de Evidencias */}
                            <div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Registro de Evidencias (Log Inmutable)</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Fecha / Hora</th>
                                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Tipo de Evidencia</th>
                                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Detalle</th>
                                            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Hash / ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>18/07/2026 10:23</td>
                                            <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-success">Misión Superada</span></td>
                                            <td style={{ padding: '1rem 0.5rem' }}>Redacción de correo sin exponer datos (RGPD)</td>
                                            <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>0x8f2...3a1</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>15/07/2026 16:45</td>
                                            <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-primary">Examen Aprobado</span></td>
                                            <td style={{ padding: '1rem 0.5rem' }}>Test de Evaluación: AI Act (Nota: 9/10)</td>
                                            <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>0x4c1...9b2</td>
                                        </tr>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>12/07/2026 09:15</td>
                                            <td style={{ padding: '1rem 0.5rem' }}><span className="badge badge-warning">Lectura Completada</span></td>
                                            <td style={{ padding: '1rem 0.5rem' }}>Guía Práctica AI Act (100% leído)</td>
                                            <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>0x1a5...7f4</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

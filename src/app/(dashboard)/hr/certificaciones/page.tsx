'use client';

import { useState } from 'react';

export default function HRCertificacionesPage() {
    const [certificados, setCertificados] = useState([
        { id: 'CERT-2026-001', empleado: 'Ana García', competencia: 'Privacidad y RGPD', fechaEmision: '2026-01-15', fechaCaducidad: '2027-01-15', estado: 'Válido' },
        { id: 'CERT-2026-002', empleado: 'Carlos Ruiz', competencia: 'Transparencia Algorítmica', fechaEmision: '2025-06-10', fechaCaducidad: '2026-06-10', estado: 'Vencido' },
        { id: 'CERT-2026-003', empleado: 'Laura Martínez', competencia: 'Prevención de Sesgos', fechaEmision: '2026-03-20', fechaCaducidad: '2027-03-20', estado: 'Válido' },
        { id: 'CERT-2026-004', empleado: 'David López', competencia: 'Uso Ético de LLMs', fechaEmision: '2025-07-01', fechaCaducidad: '2026-07-01', estado: 'A Punto de Vencer' },
    ]);

    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case 'Válido': return <span className="badge" style={{ background: 'rgba(16, 163, 127, 0.2)', color: 'var(--success)' }}>Válido</span>;
            case 'Vencido': return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' }}>Vencido</span>;
            case 'A Punto de Vencer': return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>A Punto de Vencer</span>;
            default: return <span className="badge">{estado}</span>;
        }
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Certificaciones y Caducidad 📜
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Control de certificados emitidos, caducidad, renovación automática y competencias vencidas.
                    </p>
                </div>
                <button className="btn btn-secondary">Exportar Registro (CSV)</button>
            </div>

            {/* Resumen */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Emitidos</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>142</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Válidos</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>128</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>A Punto de Vencer</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>9</div>
                </div>
                <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--error)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Vencidos</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error)' }}>5</div>
                </div>
            </div>

            {/* Tabla de Certificados */}
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar por empleado o ID..."
                        className="form-input"
                        style={{ width: '300px', background: 'rgba(0,0,0,0.2)' }}
                    />
                    <select className="form-select" style={{ width: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                        <option>Todos los estados</option>
                        <option>Válidos</option>
                        <option>Vencidos</option>
                        <option>A Punto de Vencer</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>ID Certificado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Empleado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Competencia</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Emisión</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Caducidad</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificados.map(cert => (
                                <tr key={cert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{cert.id}</td>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#fff' }}>{cert.empleado}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)' }}>{cert.competencia}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{cert.fechaEmision}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{cert.fechaCaducidad}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(cert.estado)}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        {cert.estado !== 'Válido' ? (
                                            <button className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Reasignar Misión</button>
                                        ) : (
                                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Ver PDF</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

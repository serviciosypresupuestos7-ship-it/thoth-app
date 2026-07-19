'use client';

import { useState } from 'react';

export default function AdminMarcosPage() {
    const [activeTab, setActiveTab] = useState('competencias');

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Marcos Competenciales 🧩
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Define el estándar de conocimiento. Aquí configuras las competencias base, los perfiles de riesgo por puesto y las plantillas de misiones que el Motor de Reglas usará para evaluar a los trabajadores.
                    </p>
                </div>
                <button className="btn btn-primary">+ Nuevo Marco</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                {['competencias', 'marcos', 'plantillas'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontSize: '1rem'
                        }}
                    >
                        {tab === 'competencias' ? '1. Diccionario de Competencias' :
                            tab === 'marcos' ? '2. Marcos por Puesto y Nivel' :
                                '3. Plantillas Inteligentes'}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* TAB 1: COMPETENCIAS */}
                {activeTab === 'competencias' && (
                    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { id: 'C01', name: 'Privacidad y Protección de Datos', risk: 'Alto', peso: 40, desc: 'Capacidad para anonimizar datos antes de usar LLMs.', fuentes: ['RGPD Art. 5', 'Pol. Int. 002'], deps: [] },
                            { id: 'C02', name: 'Prevención de Sesgos', risk: 'Alto', peso: 30, desc: 'Identificación y mitigación de sesgos en selección o scoring.', fuentes: ['AI Act Art. 10'], deps: ['C01'] },
                            { id: 'C03', name: 'Transparencia Algorítmica', risk: 'Medio', peso: 20, desc: 'Obligación de informar al usuario cuando interactúa con una IA.', fuentes: ['AI Act Art. 13'], deps: [] },
                            { id: 'C04', name: 'Uso Operativo de IA', risk: 'Bajo', peso: 10, desc: 'Uso eficiente de prompts para tareas diarias.', fuentes: ['Guía Buenas Prácticas'], deps: ['C01', 'C03'] }
                        ].map(comp => (
                            <div key={comp.id} className="card" style={{ padding: '1.5rem', borderLeft: comp.risk === 'Alto' ? '4px solid var(--error)' : comp.risk === 'Medio' ? '4px solid var(--warning)' : '4px solid var(--success)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{comp.id}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Peso: <strong style={{ color: '#fff' }}>{comp.peso}%</strong></span>
                                    </div>
                                    <span style={{ color: comp.risk === 'Alto' ? 'var(--error)' : comp.risk === 'Medio' ? 'var(--warning)' : 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>Riesgo {comp.risk}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{comp.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{comp.desc}</p>

                                <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Fuentes Normativas:</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {comp.fuentes.map(f => <span key={f} style={{ background: 'rgba(16, 163, 127, 0.1)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>⚖️ {f}</span>)}
                                    </div>
                                </div>

                                {comp.deps.length > 0 && (
                                    <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>Requiere: </span>
                                        {comp.deps.map(d => <span key={d} style={{ color: '#fff', marginRight: '0.5rem' }}>{d}</span>)}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Editar</button>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem' }}>Ver Evidencias</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* TAB 2: MARCOS POR PUESTO Y NIVEL */}
                {activeTab === 'marcos' && (
                    <div className="fade-in card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Puesto</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Nivel / Seniority</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Marco Asignado</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Competencias Requeridas</th>
                                    <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { role: 'Recursos Humanos', level: 'Junior', marco: 'HR-Básico', req: ['C01', 'C04'] },
                                    { role: 'Recursos Humanos', level: 'Senior', marco: 'HR-Avanzado', req: ['C01', 'C02', 'C03', 'C04'] },
                                    { role: 'Recursos Humanos', level: 'Director', marco: 'HR-Compliance', req: ['C01', 'C02', 'C03'] },
                                    { role: 'Marketing y Ventas', level: 'General', marco: 'MKT-Estándar', req: ['C01', 'C04'] },
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{row.role}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{row.level}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)' }}>{row.marco}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {row.req.map(c => (
                                                    <span key={c} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{c}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Editar Marco</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 3: PLANTILLAS INTELIGENTES */}
                {activeTab === 'plantillas' && (
                    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Plantilla: Misión de Actualización Normativa</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Esta plantilla es utilizada por el Motor de Reglas cuando se detecta un cambio en un chunk legal (ej. AI Act). Se dispara automáticamente a los trabajadores afectados.
                            </p>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a8b2d1', whiteSpace: 'pre-wrap' }}>
                                {`[SYSTEM PROMPT]
Actúas como el Tutor IA de THOTH.
Se ha detectado un cambio en la normativa: {{legal_chunk_title}}.
El trabajador tiene el rol: {{worker_role}} y nivel {{worker_level}}.

Genera un caso práctico de 1 párrafo donde el trabajador deba aplicar esta nueva norma en su día a día.
La misión debe requerir que el trabajador tome una decisión (A, B o C) o escriba una respuesta corta justificando su acción basándose en la nueva política.`}
                            </div>
                            <button className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>Editar Prompt Base</button>
                        </div>

                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Plantilla: Simulación de Phishing IA</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Plantilla para evaluar la competencia C04 (Seguridad). Genera un escenario interactivo de 3 pasos.
                            </p>
                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a8b2d1', whiteSpace: 'pre-wrap' }}>
                                {`[SYSTEM PROMPT]
Genera un correo electrónico simulado generado por IA (Deepfake text) dirigido al rol {{worker_role}}.
El correo debe contener un intento sutil de exfiltración de datos corporativos.
Pide al trabajador que identifique las 3 "red flags" (señales de alerta) en el texto.`}
                            </div>
                            <button className="btn btn-secondary" style={{ marginTop: '1.5rem', width: '100%' }}>Editar Prompt Base</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

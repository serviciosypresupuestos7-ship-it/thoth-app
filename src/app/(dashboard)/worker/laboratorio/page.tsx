'use client';

import { useState } from 'react';

export default function LaboratorioPage() {
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    const scenarios = [
        { id: 'prompting', icon: '✍️', title: 'Mejorar Prompts', desc: 'Aprende a dar instrucciones claras y precisas a la IA para obtener mejores resultados.' },
        { id: 'resumen', icon: '📄', title: 'Resumir Contratos', desc: 'Practica extrayendo la información clave de documentos legales sin perder contexto.' },
        { id: 'cliente', icon: '😠', title: 'Cliente Enfadado', desc: 'Simula una conversación difícil y usa la IA para redactar respuestas empáticas.' },
        { id: 'entrevista', icon: '🤝', title: 'Simular Entrevista', desc: 'Haz que la IA actúe como un candidato para practicar tus habilidades de entrevista.' },
        { id: 'libre', icon: '🧪', title: 'Modo Libre', desc: 'Un entorno seguro (sandbox) para probar cualquier idea sin que afecte a tus métricas.' },
    ];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Laboratorio IA 🤖
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Tu espacio seguro para experimentar. Nada de lo que hagas aquí cuenta para tu evaluación de cumplimiento. Equivócate, prueba cosas nuevas y descubre cómo la IA puede ayudarte en tu día a día.
                </p>
            </div>

            {!activeScenario ? (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '0' }}>
                    {scenarios.map(scenario => (
                        <div
                            key={scenario.id}
                            className="card"
                            style={{ cursor: 'pointer', border: scenario.id === 'libre' ? '1px solid var(--primary)' : '' }}
                            onClick={() => setActiveScenario(scenario.id)}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{scenario.icon}</div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>{scenario.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{scenario.desc}</p>

                            <div style={{ marginTop: '1.5rem', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Iniciar Simulación →
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', gap: '2rem', height: 'calc(100vh - 200px)' }}>
                    {/* Left Panel: Context */}
                    <div className="card" style={{ flex: '0.8', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {scenarios.find(s => s.id === activeScenario)?.icon} {scenarios.find(s => s.id === activeScenario)?.title}
                            </h2>
                            <button
                                onClick={() => setActiveScenario(null)}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                                ← Volver
                            </button>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Objetivo del ejercicio</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                En este escenario, la IA actuará como un cliente que ha recibido un producto defectuoso y está muy molesto. Tu objetivo es utilizar el chat de la derecha para pedirle a la IA (actuando como tu asistente) que te ayude a redactar una respuesta profesional, empática y que ofrezca una solución sin admitir culpa legal de forma prematura.
                            </p>
                        </div>

                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--error)', padding: '1.5rem', borderRadius: '0 8px 8px 0' }}>
                            <h4 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>Mensaje del Cliente:</h4>
                            <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                                "¡Es inaceptable! El equipo que me enviasteis ayer no enciende. He perdido toda la mañana intentando configurarlo y mi empresa está perdiendo dinero por vuestra culpa. Exijo una solución inmediata o hablaré con mis abogados."
                            </p>
                        </div>
                    </div>

                    {/* Right Panel: Chat Interface */}
                    <div className="card" style={{ flex: '1.2', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Asistente IA</h3>
                        </div>

                        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ alignSelf: 'flex-start', background: 'rgba(30, 78, 140, 0.3)', padding: '1rem', borderRadius: '12px', maxWidth: '85%', border: '1px solid rgba(30, 78, 140, 0.5)' }}>
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>Hola. Estoy listo para ayudarte a redactar la respuesta. ¿Qué enfoque quieres que le demos al correo?</p>
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <textarea
                                    placeholder="Escribe tu prompt aquí... Ej: Redacta un correo empático ofreciendo un reemplazo en 24h..."
                                    className="form-textarea"
                                    style={{ flex: 1, minHeight: '60px', resize: 'none' }}
                                />
                                <button className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

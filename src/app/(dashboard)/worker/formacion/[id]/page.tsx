'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DocumentDetail() {
    const [activeTab, setActiveTab] = useState('resumen');
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { role: 'ai', text: '¡Hola! Soy tu Tutor IA para este documento. Puedes pedirme que te explique un concepto, que te haga un resumen de una sección específica o que te ponga un ejemplo práctico.' }
    ]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setChatMessages([...chatMessages, { role: 'user', text: chatInput }]);
        setChatInput('');

        // Simulate AI response
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                role: 'ai',
                text: 'Entiendo tu pregunta. Según el Artículo 4 de esta guía, la respuesta es que los sistemas de IA de alto riesgo deben someterse a una evaluación de conformidad antes de su comercialización. ¿Te gustaría un ejemplo práctico de esto en tu departamento?'
            }]);
        }, 1000);
    };

    return (
        <div style={{ padding: '0', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(10,10,15,0.8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/worker/formacion" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '1.5rem' }}>←</Link>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0' }}>Guía Práctica AI Act</h1>
                        <span className="badge" style={{ background: 'rgba(30, 78, 140, 0.3)', color: '#8bb4e5', border: '1px solid rgba(30, 78, 140, 0.5)' }}>Normativa</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Descargar Original PDF</button>
                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Marcar como Leído</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Panel: Document Content / Summary */}
                <div style={{ flex: '1.2', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0 1rem' }}>
                        <button
                            onClick={() => setActiveTab('resumen')}
                            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', color: activeTab === 'resumen' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'resumen' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'resumen' ? 600 : 400, fontSize: '1rem' }}
                        >
                            ✨ Resumen IA
                        </button>
                        <button
                            onClick={() => setActiveTab('conceptos')}
                            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', color: activeTab === 'conceptos' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'conceptos' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'conceptos' ? 600 : 400, fontSize: '1rem' }}
                        >
                            🔑 Conceptos Clave
                        </button>
                        <button
                            onClick={() => setActiveTab('documento')}
                            style={{ padding: '1rem 1.5rem', background: 'transparent', border: 'none', color: activeTab === 'documento' ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'documento' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: activeTab === 'documento' ? 600 : 400, fontSize: '1rem' }}
                        >
                            📄 Documento Completo
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                        {activeTab === 'resumen' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.8rem' }}>Resumen Ejecutivo</h2>
                                <div style={{ background: 'rgba(201, 162, 39, 0.05)', borderLeft: '4px solid var(--primary)', padding: '1.5rem', borderRadius: '0 8px 8px 0', marginBottom: '2rem' }}>
                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        La Ley de Inteligencia Artificial (AI Act) es el primer marco legal integral sobre IA en el mundo. Su objetivo es garantizar que los sistemas de IA utilizados en la UE sean seguros, transparentes, trazables, no discriminatorios y respetuosos con el medio ambiente.
                                    </p>
                                </div>

                                <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', marginTop: '2rem' }}>Puntos Principales</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    <li><strong>Enfoque basado en el riesgo:</strong> Clasifica los sistemas de IA en riesgo inaceptable (prohibidos), alto riesgo (estrictamente regulados), riesgo limitado (obligaciones de transparencia) y riesgo mínimo (sin obligaciones).</li>
                                    <li><strong>Sistemas prohibidos:</strong> Incluyen la manipulación cognitiva, la puntuación social (social scoring) y la identificación biométrica en tiempo real en espacios públicos (con excepciones).</li>
                                    <li><strong>Obligaciones para Alto Riesgo:</strong> Requieren sistemas de gestión de riesgos, calidad de datos, documentación técnica, transparencia, supervisión humana y ciberseguridad.</li>
                                    <li><strong>IA Generativa:</strong> Modelos como ChatGPT deben cumplir requisitos de transparencia, como indicar que el contenido fue generado por IA y publicar resúmenes de los datos de entrenamiento protegidos por derechos de autor.</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'conceptos' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Sistema de Alto Riesgo</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Sistemas de IA que pueden afectar negativamente la seguridad o los derechos fundamentales de las personas. Ejemplos: CV screening, evaluación de crédito, sistemas biométricos.</p>
                                </div>
                                <div className="card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Supervisión Humana (Human-in-the-loop)</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Requisito obligatorio para sistemas de alto riesgo que asegura que una persona física pueda intervenir, interrumpir o ignorar las decisiones de la IA.</p>
                                </div>
                                <div className="card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ color: 'var(--primary)', margin: '0 0 0.5rem 0' }}>Transparencia Algorítmica</h3>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Obligación de informar a los usuarios cuando están interactuando con un sistema de IA (ej. chatbots) o cuando el contenido (imagen, audio, texto) ha sido generado artificialmente.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'documento' && (
                            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                                <h3>Visor de PDF Integrado</h3>
                                <p>Aquí se renderizaría el documento original completo para lectura profunda.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Tutor IA (Chat) */}
                <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column', background: 'rgba(15,15,20,0.9)' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>🤖</span> Tutor IA
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pregunta cualquier duda sobre este documento</p>
                    </div>

                    {/* Chat Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {chatMessages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(30, 78, 140, 0.3)',
                                    color: msg.role === 'user' ? '#000' : '#fff',
                                    border: msg.role === 'ai' ? '1px solid rgba(30, 78, 140, 0.5)' : 'none',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>
                                    {msg.text}
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', padding: '0 0.5rem' }}>
                                    {msg.role === 'user' ? 'Tú' : 'Tutor IA'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ej: Explícame el artículo 4 como si fuera administrativo..."
                                className="form-input"
                                style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                                Enviar
                            </button>
                        </form>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={() => setChatInput('¿Qué significa "riesgo inaceptable"?')} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', color: 'var(--text-secondary)', cursor: 'pointer' }}>¿Qué es riesgo inaceptable?</button>
                            <button onClick={() => setChatInput('Hazme un resumen en 3 viñetas')} style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Resumen corto</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

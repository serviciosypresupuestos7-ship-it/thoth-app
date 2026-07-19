'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FormacionPage() {
    const [activeCategory, setActiveCategory] = useState('Todos');

    const documents = [
        { id: '1', title: 'Guía Práctica AI Act', type: 'PDF', category: 'Normativa', progress: 100, date: '12 Oct 2026' },
        { id: '2', title: 'Política Interna de Datos (Q3)', type: 'Manual', category: 'Compliance', progress: 45, date: '05 Nov 2026' },
        { id: '3', title: 'Uso de Copilot en RRHH', type: 'Guía', category: 'Herramientas', progress: 0, date: '18 Nov 2026' },
        { id: '4', title: 'Reglamento General de Protección de Datos', type: 'PDF', category: 'Normativa', progress: 0, date: '01 Dic 2026' },
    ];

    const filteredDocuments = activeCategory === 'Todos'
        ? documents
        : documents.filter(doc => doc.category === activeCategory);

    const categories = ['Todos', 'Normativa', 'Compliance', 'Herramientas'];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Centro de Aprendizaje Inteligente 🧠
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Sube un PDF o selecciona un documento de la biblioteca. THOTH lo resume, crea preguntas, genera tests, diseña misiones y responde a tus dudas en tiempo real.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Sube un PDF para que THOTH lo procese y genere material de estudio.')}>+ Subir Documento</button>
            </div>

            {/* Feature Highlights - now interactive */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                <Link href="/worker/formacion/1" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(201,162,39,0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📝</div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Resúmenes Automáticos</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Abre un documento →</div>
                    </div>
                </Link>
                <Link href="/worker/biblioteca/1" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(201,162,39,0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>❓</div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Generación de Tests</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Abre un documento →</div>
                    </div>
                </Link>
                <Link href="/worker/autoevaluacion" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(201,162,39,0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔄</div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Formación Continua</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Reciclaje Normativo →</div>
                    </div>
                </Link>
                <Link href="/worker/simulador" style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(201,162,39,0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', border: '1px solid rgba(201,162,39,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🤖</div>
                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>Tutor IA 24/7</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Ir al Simulador →</div>
                    </div>
                </Link>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input type="text" placeholder="Buscar en la biblioteca..." className="form-input" style={{ flex: 1, maxWidth: '400px' }} />
                <select className="form-select" style={{ width: 'auto' }}>
                    <option>Todas las categorías</option>
                    <option>Normativa Europea</option>
                    <option>Políticas Internas</option>
                    <option>Guías Prácticas</option>
                </select>
            </div>

            {/* Document Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '0' }}>
                {filteredDocuments.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        No hay documentos en esta categoría.
                    </div>
                ) : (
                    filteredDocuments.map(doc => (
                        <div key={doc.id} className="card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Progress Bar Top */}
                            {doc.progress > 0 && (
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)' }}>
                                    <div style={{ height: '100%', width: `${doc.progress}%`, background: doc.progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span className="badge" style={{ background: 'rgba(30, 78, 140, 0.3)', color: '#8bb4e5', border: '1px solid rgba(30, 78, 140, 0.5)' }}>
                                    {doc.category}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{doc.type}</span>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>{doc.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                <span>📅 Añadido: {doc.date}</span>
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <Link href={`/worker/biblioteca/${doc.id}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '0.6rem' }}>
                                    Abrir con Tutor IA
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

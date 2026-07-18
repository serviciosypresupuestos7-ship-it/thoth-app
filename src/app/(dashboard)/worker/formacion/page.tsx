'use client';

import Link from 'next/link';

export default function FormacionPage() {
    const documents = [
        { id: '1', title: 'Guía Práctica AI Act', type: 'PDF', category: 'Normativa', progress: 100, date: '12 Oct 2026' },
        { id: '2', title: 'Política Interna de Datos (Q3)', type: 'Manual', category: 'Compliance', progress: 45, date: '05 Nov 2026' },
        { id: '3', title: 'Uso de Copilot en RRHH', type: 'Guía', category: 'Herramientas', progress: 0, date: '18 Nov 2026' },
        { id: '4', title: 'Reglamento General de Protección de Datos', type: 'PDF', category: 'Normativa', progress: 0, date: '01 Dic 2026' },
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Centro de Aprendizaje Inteligente 📖
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        No es solo una biblioteca. Selecciona un documento y THOTH generará resúmenes, extraerá conceptos clave y te permitirá conversar con el texto para resolver cualquier duda.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar documentos..."
                        className="form-input"
                        style={{ width: '250px', background: 'rgba(0,0,0,0.2)' }}
                    />
                    <button className="btn btn-secondary">Filtros ⚙️</button>
                </div>
            </div>

            {/* Categories / Tags */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Todos</span>
                <span className="badge" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Normativa</span>
                <span className="badge" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Compliance</span>
                <span className="badge" style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Herramientas</span>
            </div>

            {/* Document Grid */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '0' }}>
                {documents.map(doc => (
                    <div key={doc.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
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
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>📅 Añadido: {doc.date}</span>
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                            <Link href={`/worker/formacion/${doc.id}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '0.6rem' }}>
                                {doc.progress === 0 ? 'Empezar a estudiar' : doc.progress === 100 ? 'Repasar' : 'Continuar'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Exámenes Generados Section */}
            <div style={{ marginTop: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    Exámenes y Casos Prácticos Pendientes
                </h2>
                <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
                    <div>
                        <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0' }}>Test de Evaluación: AI Act</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Generado automáticamente tras completar la lectura de la guía.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>20 preguntas • 15 min</span>
                        <button className="btn btn-secondary" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>Iniciar Test</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

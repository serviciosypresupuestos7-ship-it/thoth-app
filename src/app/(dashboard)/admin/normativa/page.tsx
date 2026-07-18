'use client';

import { useState } from 'react';

export default function NormativaPage() {
    const [selectedNorma, setSelectedNorma] = useState<string | null>('ai-act');

    const normas = [
        { id: 'ai-act', nombre: 'Ley de Inteligencia Artificial (AI Act)', fecha: 'Actualizado: 12/05/2026', estado: 'Vigente' },
        { id: 'rgpd', nombre: 'Reglamento General de Protección de Datos (RGPD)', fecha: 'Actualizado: 01/01/2026', estado: 'Vigente' },
        { id: 'lopdgdd', nombre: 'LOPDGDD (España)', fecha: 'Actualizado: 15/03/2025', estado: 'Vigente' },
        { id: 'aepd', nombre: 'Guía AEPD sobre IA', fecha: 'Actualizado: 20/06/2026', estado: 'Borrador' },
    ];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Biblioteca Jurídica y Normativa 📚
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Gestiona las fuentes legales que alimentan el sistema. Cada artículo se conecta directamente con las misiones y competencias.
                    </p>
                </div>
                <button className="btn btn-primary">+ Añadir Nueva Norma</button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel: List of Norms */}
                <div className="card" style={{ flex: '0.35', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar normativa..."
                        className="form-input"
                        style={{ marginBottom: '1.5rem', width: '100%' }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
                        {normas.map(norma => (
                            <div
                                key={norma.id}
                                onClick={() => setSelectedNorma(norma.id)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    background: selectedNorma === norma.id ? 'rgba(201, 162, 39, 0.1)' : 'rgba(0,0,0,0.2)',
                                    border: selectedNorma === norma.id ? '1px solid var(--primary)' : '1px solid transparent',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span className={`badge ${norma.estado === 'Vigente' ? 'badge-success' : 'badge-warning'}`}>
                                        {norma.estado}
                                    </span>
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem', lineHeight: '1.4' }}>{norma.nombre}</h4>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{norma.fecha}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Norm Details & Mapping */}
                <div className="card" style={{ flex: '0.65', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {selectedNorma === 'ai-act' ? (
                        <>
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Ley de Inteligencia Artificial (AI Act)</h2>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Reglamento del Parlamento Europeo y del Consejo</p>
                                </div>
                                <button className="btn btn-secondary">Sincronizar Cambios</button>
                            </div>

                            {/* Artículo Específico */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--primary)' }}>Artículo 4</h3>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>Prácticas de IA prohibidas</span>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--error)', marginBottom: '1.5rem' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Texto Legal</h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        Se prohíbe la introducción en el mercado, la puesta en servicio o la utilización de un sistema de IA que se sirva de técnicas subliminales que trasciendan la conciencia de una persona para alterar de manera sustancial su comportamiento...
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(30, 78, 140, 0.1)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Explicación THOTH (Para Trabajadores)</h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        No puedes usar IA para manipular a clientes o empleados sin que se den cuenta. Por ejemplo, no puedes usar un sistema que analice el tono de voz de un cliente en tiempo real para presionarle psicológicamente a comprar.
                                    </p>
                                </div>
                            </div>

                            {/* Mapeo de Misiones y Competencias */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>🎯</span> Misiones Relacionadas (12)
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                            Campaña de Marketing Persuasiva
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                            Análisis de Sentimiento en Llamadas
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>Ver todas las misiones</button>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>🧠</span> Competencias Afectadas (2)
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--success)' }}>
                                            Uso Ético de IA
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--success)' }}>
                                            Transparencia Algorítmica
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                            <h3>Selecciona una norma</h3>
                            <p>Para ver sus artículos y cómo se conectan con el sistema.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

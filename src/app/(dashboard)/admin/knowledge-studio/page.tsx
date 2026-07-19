'use client';

import { useState } from 'react';

export default function KnowledgeStudioWizard() {
    const [step, setStep] = useState(1);

    // Wizard State
    const [topic, setTopic] = useState('');
    const [norms, setNorms] = useState<string[]>([]);
    const [targetRole, setTargetRole] = useState('');
    const [depthLevel, setDepthLevel] = useState('Operativo');
    const [objective, setObjective] = useState('');

    // Generated Index State
    const [proposedIndex, setProposedIndex] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateIndex = () => {
        setIsGenerating(true);
        setStep(6); // Move to step 6 immediately to show the spinner
        // Simulate AI generation delay
        setTimeout(() => {
            setProposedIndex([
                { id: 1, title: 'Introducción a la Normativa', description: 'Conceptos básicos aplicados al rol.' },
                { id: 2, title: 'Obligaciones Principales', description: 'Lo que el trabajador debe hacer según la ley.' },
                { id: 3, title: 'Límites y Prohibiciones', description: 'Líneas rojas que no se deben cruzar.' },
                { id: 4, title: 'Casos Prácticos', description: 'Ejemplos del día a día.' }
            ]);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Generador de Temarios 🧠
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Asistente de creación de cursos. La IA propone la estructura basándose en la base jurídica oficial, y tú decides el contenido final.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary">Guardar Borrador</button>
                    <button className="btn btn-primary" disabled={step < 6}>Publicar Curso</button>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {[1, 2, 3, 4, 5, 6].map(s => (
                    <div key={s} style={{
                        flex: 1,
                        height: '8px',
                        borderRadius: '4px',
                        background: s <= step ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        transition: 'background 0.3s ease'
                    }} />
                ))}
            </div>

            <div className="card" style={{ padding: '2rem', flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%' }}>

                {step === 1 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Paso 1: Tema Principal</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>¿Sobre qué trata este curso o módulo?</p>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej. Sesgos en la Selección de Personal con IA"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Paso 2: Normativa Aplicable</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Selecciona las fuentes jurídicas que la IA debe consultar para este tema.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {['AI Act (Reglamento UE)', 'RGPD (Protección de Datos)', 'Guías AESIA', 'Políticas Internas (Tenant)'].map(norm => (
                                <label key={norm} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={norms.includes(norm)}
                                        onChange={(e) => {
                                            if (e.target.checked) setNorms([...norms, norm]);
                                            else setNorms(norms.filter(n => n !== norm));
                                        }}
                                        style={{ width: '20px', height: '20px' }}
                                    />
                                    <span style={{ fontSize: '1.1rem' }}>{norm}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Paso 3: Destinatario</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>¿A qué rol o departamento va dirigido?</p>
                        <select
                            className="form-select"
                            value={targetRole}
                            onChange={e => setTargetRole(e.target.value)}
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        >
                            <option value="">Selecciona un rol...</option>
                            <option value="rrhh">Recursos Humanos</option>
                            <option value="marketing">Marketing y Ventas</option>
                            <option value="it">IT y Desarrollo</option>
                            <option value="legal">Legal / Compliance</option>
                            <option value="general">Toda la plantilla</option>
                        </select>
                    </div>
                )}

                {step === 4 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Paso 4: Nivel de Profundidad</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Define la complejidad jurídica del contenido.</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {['Introducción', 'Operativo', 'Avanzado', 'Compliance'].map(level => (
                                <div
                                    key={level}
                                    onClick={() => setDepthLevel(level)}
                                    style={{
                                        padding: '1.5rem',
                                        borderRadius: '8px',
                                        border: depthLevel === level ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                                        background: depthLevel === level ? 'rgba(255, 107, 0, 0.1)' : 'rgba(0,0,0,0.2)',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        fontWeight: depthLevel === level ? 'bold' : 'normal'
                                    }}
                                >
                                    {level}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Paso 5: Objetivo de Aprendizaje</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>¿Qué debe saber hacer el trabajador al terminar este curso?</p>
                        <textarea
                            className="form-input"
                            placeholder="Ej. El trabajador debe ser capaz de identificar cuándo una herramienta de IA puede estar sesgando la criba de currículums..."
                            value={objective}
                            onChange={e => setObjective(e.target.value)}
                            style={{ width: '100%', height: '150px', fontSize: '1.1rem', padding: '1rem', resize: 'none' }}
                        />
                    </div>
                )}

                {step === 6 && (
                    <div className="fade-in">
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Propuesta de Índice</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            La IA ha analizado la normativa seleccionada y propone esta estructura. Puedes reordenar, editar o eliminar módulos antes de generar el contenido.
                        </p>

                        {isGenerating ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                                <p style={{ color: 'var(--primary)' }}>Consultando base jurídica y generando índice...</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {proposedIndex.map((item, index) => (
                                    <div key={item.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ cursor: 'grab', color: 'var(--text-muted)' }}>☰</div>
                                        <div style={{ flex: 1 }}>
                                            <input
                                                type="text"
                                                value={item.title}
                                                className="form-input"
                                                style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.25rem' }}
                                                onChange={() => { }}
                                            />
                                            <input
                                                type="text"
                                                value={item.description}
                                                className="form-input"
                                                style={{ width: '100%', background: 'transparent', border: 'none', padding: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                                                onChange={() => { }}
                                            />
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>🗑️</button>
                                    </div>
                                ))}
                                <button className="btn btn-secondary" style={{ borderStyle: 'dashed', background: 'transparent' }}>+ Añadir Módulo Manualmente</button>
                            </div>
                        )}
                    </div>
                )}

                {step === 7 && (
                    <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--success)' }}>¡Temario Generado con Éxito!</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            El curso "{topic}" ha sido generado, estructurado y guardado en la base de datos. Los trabajadores con el rol de {targetRole} ya pueden acceder a él desde su Ruta Formativa.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => {
                                setStep(1);
                                setTopic('');
                                setNorms([]);
                                setTargetRole('');
                                setObjective('');
                            }}>Crear Otro Temario</button>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/admin/knowledge-studio'}>Volver al Inicio</button>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                {step < 7 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep(s => Math.max(1, s - 1))}
                            disabled={step === 1 || isGenerating}
                        >
                            ← Atrás
                        </button>

                        {step < 5 ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setStep(s => Math.min(6, s + 1))}
                            >
                                Siguiente →
                            </button>
                        ) : step === 5 ? (
                            <button
                                className="btn btn-primary"
                                onClick={handleGenerateIndex}
                                disabled={!topic || !targetRole || !objective || isGenerating}
                            >
                                {isGenerating ? 'Generando...' : '✨ Generar Índice con IA'}
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setIsGenerating(true);
                                    setTimeout(() => {
                                        setIsGenerating(false);
                                        setStep(7);
                                    }, 2500);
                                }}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generando Contenido...' : 'Generar Contenido de Módulos →'}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

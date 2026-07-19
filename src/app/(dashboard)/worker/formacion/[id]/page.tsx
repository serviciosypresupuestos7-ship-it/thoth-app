'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockDocs: Record<string, { title: string; content: string }> = {
    '1': {
        title: 'Guía Práctica AI Act',
        content: `El AI Act (Reglamento UE 2024/1689) es la primera legislación global sobre Inteligencia Artificial. Clasifica los sistemas de IA en cuatro niveles de riesgo: inaceptable, alto, limitado y mínimo. Las empresas que usen sistemas de IA de alto riesgo deben mantener registros de uso, garantizar supervisión humana y formar a sus trabajadores. El incumplimiento puede suponer multas de hasta 35 millones de euros o el 7% de la facturación global anual.`,
    },
    '2': {
        title: 'Política Interna de Datos (Q3)',
        content: `Queda prohibido introducir datos personales de clientes (nombre, DNI, email, teléfono, dirección) en herramientas de IA públicas como ChatGPT, Gemini o Claude. Para el procesamiento de datos sensibles solo se permite el uso de la instancia privada corporativa de THOTH. El incumplimiento de esta política se considera una infracción grave y puede conllevar medidas disciplinarias.`,
    },
    '3': {
        title: 'Uso de Copilot en RRHH',
        content: `Microsoft Copilot puede usarse para redactar ofertas de empleo, generar plantillas de evaluación y resumir CVs anonimizados. No está permitido subir CVs con datos personales completos a Copilot sin anonimizar previamente. Las decisiones finales de contratación siempre deben ser tomadas por un humano. Copilot es una herramienta de apoyo, no de decisión.`,
    },
    '4': {
        title: 'Reglamento General de Protección de Datos',
        content: `El RGPD (Reglamento UE 2016/679) regula el tratamiento de datos personales. En el contexto de la IA, los titulares de datos tienen derecho a no ser objeto de decisiones automatizadas con efectos jurídicos significativos. Las empresas deben implementar el principio de "privacidad desde el diseño" en todos sus sistemas de IA.`,
    },
};

export default function FormacionDocPage({ params }: { params: { id: string } }) {
    const doc = mockDocs[params.id] || { title: 'Documento', content: 'Contenido no disponible.' };
    const [activeTab, setActiveTab] = useState<'resumen' | 'test' | 'tutor'>('resumen');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: string; text: string }[]>([
        { role: 'tutor', text: `Hola, soy tu Tutor IA. He procesado "${doc.title}". ¿Qué quieres saber?` },
    ]);
    const [testScore, setTestScore] = useState<number | null>(null);
    const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});

    const testQuestions = [
        { q: '¿Cuál es el objetivo principal del AI Act?', opts: ['Prohibir la IA', 'Regular la IA por niveles de riesgo', 'Fomentar el uso libre de la IA', 'Crear una IA europea'], correct: 'Regular la IA por niveles de riesgo' },
        { q: '¿Qué datos NO puedes introducir en herramientas de IA públicas?', opts: ['Estadísticas públicas', 'Datos personales de clientes', 'Textos legales', 'Plantillas de documentos'], correct: 'Datos personales de clientes' },
        { q: '¿Qué principio exige el RGPD en sistemas de IA?', opts: ['Velocidad máxima', 'Privacidad desde el diseño', 'Automatización total', 'Código abierto'], correct: 'Privacidad desde el diseño' },
    ];

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                role: 'tutor',
                text: `Sobre tu pregunta: "${userMsg}" — Según el documento, la clave está en ${doc.content.split('.')[0]}. ¿Necesitas más detalle?`,
            }]);
        }, 800);
    };

    const handleSubmitTest = () => {
        let correct = 0;
        testQuestions.forEach((q, i) => {
            if (testAnswers[i] === q.correct) correct++;
        });
        setTestScore(Math.round((correct / testQuestions.length) * 100));
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '900px' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/worker/formacion" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Biblioteca</Link>
                <h1 className="title-gradient" style={{ fontSize: '2rem', margin: 0 }}>{doc.title}</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                {(['resumen', 'test', 'tutor'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        padding: '0.75rem 1.5rem', background: 'none', border: 'none',
                        borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                        fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s'
                    }}>
                        {tab === 'resumen' ? '📝 Resumen' : tab === 'test' ? '❓ Test' : '🤖 Tutor IA'}
                    </button>
                ))}
            </div>

            {/* Resumen Tab */}
            {activeTab === 'resumen' && (
                <div className="card" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Resumen generado por IA</h2>
                    <p style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>{doc.content}</p>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,162,39,0.08)', borderRadius: '8px', border: '1px solid rgba(201,162,39,0.2)' }}>
                        <strong style={{ color: 'var(--primary)' }}>💡 Punto clave:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>Aplica siempre supervisión humana antes de tomar decisiones basadas en IA.</p>
                    </div>
                </div>
            )}

            {/* Test Tab */}
            {activeTab === 'test' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {testScore !== null ? (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{testScore >= 70 ? '✅' : '📚'}</div>
                            <h2 style={{ fontSize: '2rem', color: testScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>{testScore}%</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                {testScore >= 70
                                    ? '¡Test de repaso superado! Has comprendido la teoría básica de este documento.'
                                    : 'Revisa el resumen e inténtalo de nuevo.'}
                            </p>
                            {testScore >= 70 && (
                                <div style={{ background: 'rgba(201,162,39,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(201,162,39,0.3)', marginBottom: '1.5rem', display: 'inline-block' }}>
                                    <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.9rem' }}>
                                        💡 <strong>Recuerda:</strong> Esto es solo un test formativo. Para obtener tu certificado oficial, debes resolver un caso práctico en la sección de Misiones.
                                    </p>
                                </div>
                            )}
                            <div>
                                <button className="btn btn-secondary" onClick={() => { setTestScore(null); setTestAnswers({}); }}>Repetir Test</button>
                                {testScore >= 70 && (
                                    <Link href="/worker/misiones" className="btn btn-primary" style={{ marginLeft: '1rem', textDecoration: 'none' }}>Ir a Misiones →</Link>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {testQuestions.map((q, i) => (
                                <div key={i} className="card" style={{ padding: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{i + 1}. {q.q}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {q.opts.map(opt => (
                                            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: testAnswers[i] === opt ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${testAnswers[i] === opt ? 'var(--primary)' : 'transparent'}`, cursor: 'pointer' }}>
                                                <input type="radio" name={`q${i}`} value={opt} checked={testAnswers[i] === opt} onChange={() => setTestAnswers(prev => ({ ...prev, [i]: opt }))} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button className="btn btn-primary" onClick={handleSubmitTest} disabled={Object.keys(testAnswers).length < testQuestions.length} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Enviar Respuestas
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Tutor IA Tab */}
            {activeTab === 'tutor' && (
                <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '500px' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🤖</span>
                        <div>
                            <strong>Tutor IA</strong>
                            <div style={{ color: 'var(--success)', fontSize: '0.75rem' }}>● Activo · Contexto: {doc.title}</div>
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {chatHistory.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: '12px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                                    color: msg.role === 'user' ? '#000' : 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                            placeholder="Pregunta sobre el documento..." className="form-input" style={{ flex: 1 }}
                        />
                        <button className="btn btn-primary" onClick={handleSendChat} style={{ padding: '0.75rem 1.5rem' }}>Enviar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

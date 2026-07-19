'use client';

import Link from 'next/link';
import { useState } from 'react';

const diagnosticQuestions = [
    {
        id: 1,
        question: '¿Qué es un sistema de IA según el Art. 3 del AI Act europeo?',
        options: [
            { id: 'a', text: 'Un software que sigue reglas fijas programadas por un desarrollador.' },
            { id: 'b', text: 'Un sistema que aprende, infiere y genera salidas (contenido, decisiones) de forma autónoma.' },
            { id: 'c', text: 'Cualquier programa informático que utilice internet.' },
            { id: 'd', text: 'Un robot industrial con sensores físicos.' },
        ],
        correct: 'b',
    },
    {
        id: 2,
        question: 'Tu empresa usa ChatGPT para redactar correos. Según la ley española, ¿estás usando IA corporativa?',
        options: [
            { id: 'a', text: 'No, ChatGPT es solo una herramienta de texto, no cuenta como IA.' },
            { id: 'b', text: 'Solo si la empresa lo tiene instalado en sus servidores.' },
            { id: 'c', text: 'Sí. Si el software infiere datos y genera contenido autónomamente, es IA corporativa según el Art. 3 del AI Act y la AESIA puede supervisarla.' },
            { id: 'd', text: 'Depende del número de empleados de la empresa.' },
        ],
        correct: 'c',
    },
    {
        id: 3,
        question: 'Un cliente te pide que subas su contrato a ChatGPT para extraer datos clave. ¿Qué harías?',
        options: [
            { id: 'a', text: 'Lo subiría sin problema; la IA es confidencial.' },
            { id: 'b', text: 'Anonimizaría los datos personales antes de introducirlos en la IA, ya que el RGPD prohíbe compartir datos de clientes sin consentimiento.' },
            { id: 'c', text: 'Solo lo haría si el archivo pesa menos de 1MB.' },
            { id: 'd', text: 'Le pediría permiso al cliente enviándole un correo automático.' },
        ],
        correct: 'b',
    },
    {
        id: 4,
        question: '¿Qué organismo en España supervisa el cumplimiento de la Ley de IA (AI Act)?',
        options: [
            { id: 'a', text: 'La Agencia Tributaria (AEAT).' },
            { id: 'b', text: 'El Instituto Nacional de Estadística (INE).' },
            { id: 'c', text: 'La Agencia Española de Supervisión de Inteligencia Artificial (AESIA).' },
            { id: 'd', text: 'El Ministerio de Trabajo y Economía Social.' },
        ],
        correct: 'c',
    },
];

export default function AutoevaluacionPage() {
    const [phase, setPhase] = useState<'diagnostic' | 'result'>('diagnostic');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [selected, setSelected] = useState<string | null>(null);

    const score = diagnosticQuestions.filter(q => answers[q.id] === q.correct).length;
    const totalQ = diagnosticQuestions.length;
    const pct = Math.round((score / totalQ) * 100);
    const isAdvanced = pct >= 75;

    const handleAnswer = (optId: string) => {
        setSelected(optId);
    };

    const handleNext = () => {
        if (!selected) return;
        const q = diagnosticQuestions[currentQ];
        setAnswers(prev => ({ ...prev, [q.id]: selected }));
        setSelected(null);
        if (currentQ + 1 < diagnosticQuestions.length) {
            setCurrentQ(currentQ + 1);
        } else {
            setPhase('result');
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/worker/biblioteca" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <span>←</span> Volver a la Biblioteca
                </Link>
            </div>

            {phase === 'diagnostic' && (
                <div className="fade-in">
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                            Test de Autoevaluación 📝
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Pon a prueba tus conocimientos sobre la normativa de IA. Este test es solo para practicar y no afecta a tu expediente oficial.
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        {diagnosticQuestions.map((_, i) => (
                            <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i < currentQ ? 'var(--success)' : i === currentQ ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
                        ))}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{currentQ + 1} / {totalQ}</span>
                    </div>

                    {/* Question Card */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                            Pregunta {currentQ + 1}
                        </div>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', lineHeight: '1.5', color: '#fff' }}>
                            {diagnosticQuestions[currentQ].question}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                            {diagnosticQuestions[currentQ].options.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswer(opt.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem',
                                        padding: '1rem 1.25rem', textAlign: 'left',
                                        background: selected === opt.id ? 'rgba(201, 162, 39, 0.12)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${selected === opt.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '10px', cursor: 'pointer',
                                        color: selected === opt.id ? '#fff' : 'var(--text-secondary)',
                                        transition: 'all 0.15s ease',
                                        fontWeight: selected === opt.id ? 500 : 400,
                                    }}
                                >
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: '0.85rem',
                                        background: selected === opt.id ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                        color: selected === opt.id ? '#000' : 'var(--text-secondary)',
                                    }}>
                                        {opt.id.toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: '0.95rem' }}>{opt.text}</span>
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', opacity: selected ? 1 : 0.4, cursor: selected ? 'pointer' : 'not-allowed' }}
                                onClick={handleNext}
                                disabled={!selected}
                            >
                                {currentQ + 1 < totalQ ? 'Siguiente pregunta →' : 'Ver mi resultado →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {phase === 'result' && (
                <div className="fade-in" style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <div className="card" style={{ padding: '3rem', maxWidth: '650px', margin: '0 auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                            {isAdvanced ? '🏆' : '📚'}
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                            {isAdvanced ? '¡Excelente nivel!' : 'Sigue practicando'}
                        </h2>
                        <div style={{ fontSize: '4rem', fontWeight: 900, color: isAdvanced ? 'var(--success)' : 'var(--warning)', margin: '1rem 0' }}>
                            {pct}%
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                            Has respondido correctamente {score} de {totalQ} preguntas. Recuerda que puedes consultar la normativa en cualquier momento en la Biblioteca.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem', textAlign: 'left' }}>
                            {diagnosticQuestions.map(q => {
                                const ok = answers[q.id] === q.correct;
                                return (
                                    <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: ok ? 'var(--success)' : 'var(--error)' }}>
                                        <span>{ok ? '✓' : '✗'}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{q.question.substring(0, 60)}...</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => { setPhase('diagnostic'); setCurrentQ(0); setAnswers({}); setSelected(null); }}>
                                🔄 Repetir Test
                            </button>
                            <Link href="/worker/cualificacion" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                                🎯 Ir a mis Cualificaciones Oficiales →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

// --- DATOS DEL DIAGNÓSTICO PREVIO (PRUEBA DE NIVEL) ---
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

const MISSIONS_MOCK = [
    { id: '1', title: 'Redactar correo a cliente con IA', action: 'Redactar correos', difficulty: 'Media', status: 'pending', time: '10 min', icon: '📧' },
    { id: '2', title: 'Resumir contrato de confidencialidad', action: 'Resumir documentos', difficulty: 'Alta', status: 'pending', time: '15 min', icon: '📝' },
    { id: '3', title: 'Analizar CV para puesto técnico', action: 'Analizar CV', difficulty: 'Baja', status: 'completed', time: '5 min', icon: '👤' },
];

export default function CualificacionPage() {
    // 'diagnostic' | 'result' | 'missions'
    const [phase, setPhase] = useState<'diagnostic' | 'result' | 'missions'>('diagnostic');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [selected, setSelected] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

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

    const pendingCount = MISSIONS_MOCK.filter(m => m.status === 'pending').length;
    const completedCount = MISSIONS_MOCK.filter(m => m.status === 'completed').length;

    return (
        <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>

            {/* ======= FASE 1: DIAGNÓSTICO INICIAL ======= */}
            {phase === 'diagnostic' && (
                <div className="fade-in">
                    <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                            🩺 Diagnóstico Inicial de Nivel
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            Antes de comenzar tu cualificación, evalúa tus conocimientos en <strong style={{ color: '#fff' }}>IA y AI Act</strong>. El sistema adaptará tu formación al resultado. Son 4 preguntas rápidas.
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

            {/* ======= FASE 2: RESULTADO DEL DIAGNÓSTICO ======= */}
            {phase === 'result' && (
                <div className="fade-in" style={{ textAlign: 'center', paddingTop: '2rem' }}>
                    <div className="card" style={{ padding: '3rem', maxWidth: '650px', margin: '0 auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                            {isAdvanced ? '🏆' : '📚'}
                        </div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                            {isAdvanced ? '¡Excelente nivel!' : 'Comenzaremos desde cero'}
                        </h2>
                        <div style={{ fontSize: '4rem', fontWeight: 900, color: isAdvanced ? 'var(--success)' : 'var(--warning)', margin: '1rem 0' }}>
                            {pct}%
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                            {isAdvanced
                                ? `Has respondido correctamente ${score} de ${totalQ} preguntas. Tu nivel de conocimiento en IA y AI Act es alto. Pasarás directamente a la fase práctica sin necesidad de formación básica, ahorrándote tiempo.`
                                : `Has respondido correctamente ${score} de ${totalQ} preguntas. No te preocupes, Thoth te guiará por un módulo de Alfabetización en IA basado en el AI Act antes de comenzar la práctica.`
                            }
                        </p>

                        {/* Detalle de respuestas */}
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
                            {!isAdvanced && (
                                <Link href="/worker/biblioteca" className="btn btn-secondary">
                                    📖 Ver Alfabetización IA Primero
                                </Link>
                            )}
                            <button className="btn btn-primary" style={{ padding: '0.85rem 2rem' }} onClick={() => setPhase('missions')}>
                                {isAdvanced ? '🎯 Ir a mis Cualificaciones →' : 'Ir a mis Cualificaciones →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======= FASE 3: MISIONES / CUALIFICACIONES ======= */}
            {phase === 'missions' && (
                <div className="fade-in">
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                                Mi Cualificación 🎯
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '650px' }}>
                                Situaciones reales basadas en tu puesto. Resuélvelas con IA para demostrar tu competencia y obtener tu certificado legal.
                            </p>
                        </div>
                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => { setPhase('diagnostic'); setCurrentQ(0); setAnswers({}); setSelected(null); }}>
                            🔄 Repetir Test de Nivel
                        </button>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }}>
                        {(['pending', 'completed'] as const).map(tab => (
                            <div key={tab} onClick={() => setActiveTab(tab)} style={{ paddingBottom: '1rem', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer' }}>
                                {tab === 'pending' ? `Pendientes (${pendingCount})` : `Completadas (${completedCount})`}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {MISSIONS_MOCK.filter(m => m.status === activeTab).map(mission => (
                            <div key={mission.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                        {mission.icon}
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{mission.title}</h3>
                                            <span className={`badge ${mission.difficulty === 'Alta' ? 'badge-danger' : mission.difficulty === 'Media' ? 'badge-warning' : 'badge-success'}`}>{mission.difficulty}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            {mission.action} · ⏱️ {mission.time}
                                        </div>
                                    </div>
                                </div>
                                <Link href="/worker/simulador" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.5rem', whiteSpace: 'nowrap' }}>
                                    {activeTab === 'pending' ? 'Iniciar →' : 'Revisar'}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

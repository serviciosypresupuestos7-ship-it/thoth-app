'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// 10 preguntas basadas en AI Act, RGPD y normativa vigente
const TEST_QUESTIONS = [
    {
        id: 1,
        tema: 'Fundamentos IA',
        lawRef: 'AI Act — Considerando 4',
        question: '¿Qué es una "alucinación" en un modelo de Inteligencia Artificial Generativa?',
        options: [
            'Un error del sistema que hace que el ordenador se congele.',
            'Cuando la IA genera información que parece real pero es inventada o falsa.',
            'Un protocolo de seguridad que se activa al detectar amenazas.',
        ],
        correct: 1,
        explanation: 'Las alucinaciones son respuestas plausibles pero incorrectas. El AI Act exige que los usuarios comprendan las limitaciones de los sistemas de IA.',
    },
    {
        id: 2,
        tema: 'Verificación',
        lawRef: 'AI Act — Art. 4 (Alfabetización IA)',
        question: 'Si una IA te proporciona un dato estadístico para un informe, ¿qué debes hacer?',
        options: [
            'Copiarlo directamente, las IA no se equivocan.',
            'Verificar la información con fuentes oficiales antes de usarla.',
            'Descartarlo siempre, la IA nunca acierta con datos numéricos.',
        ],
        correct: 1,
        explanation: 'El AI Act Art. 4 establece la obligación de supervisión humana. Todo output de IA debe verificarse antes de usarse en contextos profesionales.',
    },
    {
        id: 3,
        tema: 'Sesgos',
        lawRef: 'AI Act — Art. 9 (Gestión de Riesgos)',
        question: '¿Qué significa que un sistema de IA tenga un "sesgo"?',
        options: [
            'Que funciona más lento por problemas de red.',
            'Que ofrece resultados distorsionados o discriminatorios por los datos de entrenamiento.',
            'Que requiere un pago de licencia obligatorio.',
        ],
        correct: 1,
        explanation: 'Los sesgos son consecuencia de los datos usados en el entrenamiento. El AI Act Art. 9 exige gestionar estos riesgos activamente.',
    },
    {
        id: 4,
        tema: 'Protección de Datos',
        lawRef: 'RGPD — Art. 5 + AI Act — Art. 10',
        question: 'Trabajas con datos reales de un cliente. ¿Puedes introducirlos en una IA gratuita de acceso público?',
        options: [
            'Sí, siempre que el cliente no se entere.',
            'No. Introducir datos personales en IAs públicas vulnera el RGPD y el secreto profesional.',
            'Sí, las versiones gratuitas borran el historial automáticamente.',
        ],
        correct: 1,
        explanation: 'El RGPD Art. 5 prohíbe el tratamiento no autorizado de datos personales. Las IAs públicas no garantizan la confidencialidad requerida.',
    },
    {
        id: 5,
        tema: 'Sesgo de Automatización',
        lawRef: 'AI Act — Considerando 49',
        question: '¿Qué es el "sesgo de automatización"?',
        options: [
            'La velocidad a la que la IA automatiza tareas de oficina.',
            'La tendencia humana a confiar ciegamente en las decisiones de un sistema IA, dejando de lado el juicio crítico.',
            'Un fallo técnico que duplica procesos en segundo plano.',
        ],
        correct: 1,
        explanation: 'El AI Act reconoce el riesgo del sesgo de automatización. La supervisión humana debe mantenerse activa en todo momento.',
    },
    {
        id: 6,
        tema: 'Política Interna',
        lawRef: 'AI Act — Art. 4 + Política Interna de Empresa',
        question: '¿Qué herramientas de IA puedes usar en tu puesto de trabajo?',
        options: [
            'Cualquier aplicación que encuentre en internet para ir más rápido.',
            'Exclusivamente las herramientas auditadas y aprobadas por IT en la "Lista Blanca" de la empresa.',
            'Únicamente herramientas desarrolladas en España.',
        ],
        correct: 1,
        explanation: 'Las empresas deben aprobar formalmente qué sistemas de IA pueden usarse. Usar herramientas no autorizadas puede incumplir el AI Act y el RGPD.',
    },
    {
        id: 7,
        tema: 'Responsabilidad Legal',
        lawRef: 'AI Act — Art. 22 (Supervisión Humana)',
        question: 'Si una IA te ayuda a redactar un informe y contiene errores graves, ¿quién es el responsable final?',
        options: [
            'La empresa que desarrolló la IA (OpenAI, Microsoft, etc.).',
            'Nadie, los vacíos legales de la IA eximen de responsabilidad.',
            'Tú (como operador) y tu empresa (como implementadora), ya que hay obligación de supervisión humana.',
        ],
        correct: 2,
        explanation: 'El AI Act Art. 22 establece la obligación de supervisión humana. La responsabilidad recae sobre el operador y el implementador, no sobre el proveedor de IA.',
    },
    {
        id: 8,
        tema: 'Reporte de Incidentes',
        lawRef: 'AI Act — Art. 73 (Notificación de Incidentes)',
        question: '¿Qué debes hacer si detectas que la IA de tu empresa arroja resultados sospechosos o discriminatorios?',
        options: [
            'Ignorarlo y seguir trabajando de forma manual.',
            'Notificarlo de inmediato al Responsable de IA / Departamento de IT para registrar el incidente.',
            'Publicar una queja en las redes sociales de la herramienta.',
        ],
        correct: 1,
        explanation: 'El AI Act Art. 73 establece un sistema obligatorio de notificación de incidentes graves. No reportar puede constituir una infracción.',
    },
    {
        id: 9,
        tema: 'Obligatoriedad Legal',
        lawRef: 'AI Act — Art. 4 (Obligación de Alfabetización)',
        question: 'La formación en IA para empleados según el AI Act europeo es:',
        options: [
            'Una recomendación opcional que las empresas pueden ignorar si son pequeñas.',
            'Una obligación legal estricta para todas las empresas que usen sistemas de IA.',
            'Un curso que solo deben realizar los ingenieros informáticos.',
        ],
        correct: 1,
        explanation: 'El Art. 4 del AI Act es explícito: los proveedores y usuarios de IA deben garantizar la alfabetización de las personas que trabajan con estos sistemas.',
    },
    {
        id: 10,
        tema: 'Uso Seguro de Prompts',
        lawRef: 'RGPD — Art. 25 (Privacidad por Diseño)',
        question: 'Al redactar un prompt (instrucción) en una IA corporativa, ¿cuál es la mejor práctica?',
        options: [
            'Dar todos los nombres, DNI y teléfonos para que el texto sea más preciso.',
            'Usar variables genéricas (ej: "Cliente X", "Empresa Y") anonimizando cualquier dato sensible.',
            'Escribir frases muy cortas para no saturar el servidor.',
        ],
        correct: 1,
        explanation: 'El RGPD Art. 25 establece la privacidad por diseño. Anonimizar datos en los prompts es una obligación, no solo una buena práctica.',
    },
];

export default function AutoevaluacionPage() {
    const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro');
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [selected, setSelected] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const totalQ = TEST_QUESTIONS.length;
    const score = TEST_QUESTIONS.filter(q => answers[q.id] === q.correct).length;
    const pct = Math.round((score / totalQ) * 100);
    const passed = pct >= 60;

    const handleAnswer = (idx: number) => {
        if (showExplanation) return;
        setSelected(idx);
        setShowExplanation(true);
    };

    const handleNext = async () => {
        if (selected === null) return;
        const q = TEST_QUESTIONS[currentQ];
        const newAnswers = { ...answers, [q.id]: selected };
        setAnswers(newAnswers);
        setSelected(null);
        setShowExplanation(false);

        if (currentQ + 1 < totalQ) {
            setCurrentQ(currentQ + 1);
        } else {
            setPhase('result');
            const finalScore = TEST_QUESTIONS.filter(q => newAnswers[q.id] === q.correct).length;
            const isPassed = (finalScore / totalQ) >= 0.6;

            // Guardar en localStorage
            localStorage.setItem('thoth_test_previo_done', 'true');
            localStorage.setItem('thoth_test_previo_score', String(Math.round((finalScore / totalQ) * 100)));

            // Guardar evidencia en Supabase
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
                    if (profile) {
                        const hashId = `TPREV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                        await supabase.from('evidences').insert({
                            user_id: user.id,
                            company_id: profile.company_id,
                            evidence_type: isPassed ? 'Test Previo Superado' : 'Test Previo — Necesita Mejora',
                            detail: `Test de Conocimiento Previo (AI Act + RGPD). Puntuación: ${finalScore}/${totalQ} (${Math.round((finalScore / totalQ) * 100)}%)`,
                            hash_id: hashId
                        });
                    }
                }
            } catch (err) {
                console.error('Error saving evidence:', err);
            }
        }
    };

    const currentQuestion = TEST_QUESTIONS[currentQ];
    const isCorrect = selected !== null && selected === currentQuestion?.correct;

    return (
        <div style={{ padding: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <Link href="/worker/panel" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    ← Volver al Panel
                </Link>
            </div>

            {/* ===== INTRO ===== */}
            {phase === 'intro' && (
                <div className="fade-in">
                    <div className="card" style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, rgba(201,162,39,0.06) 0%, rgba(20,20,20,0.9) 100%)',
                        border: '1px solid rgba(201,162,39,0.2)'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📋</div>
                        <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
                            Test de Conocimiento Previo
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
                            Antes de acceder a tu cualificación oficial, este test evalúa tu nivel de partida sobre la normativa de IA.
                            Es <strong style={{ color: '#fff' }}>obligatorio por el AI Act (Art. 4)</strong> y sirve para determinar el camino formativo más adecuado.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                            {[
                                { icon: '⏱️', label: '10 preguntas', sub: '~8 minutos' },
                                { icon: '⚖️', label: 'Basado en ley', sub: 'AI Act + RGPD' },
                                { icon: '📊', label: 'Sin bloqueo', sub: '60% para pasar' },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>{item.label}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(201,162,39,0.06)', borderRadius: '10px', border: '1px solid rgba(201,162,39,0.15)', maxWidth: '500px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>📌 Temas evaluados:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {['AI Act Art. 4', 'RGPD', 'Sesgos IA', 'Protección Datos', 'Supervisión Humana', 'Responsabilidad', 'Uso Seguro'].map((t, i) => (
                                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', color: 'var(--text-secondary)' }}>{t}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                            onClick={() => setPhase('test')}
                        >
                            Comenzar Test →
                        </button>
                    </div>
                </div>
            )}

            {/* ===== TEST ===== */}
            {phase === 'test' && (
                <div className="fade-in">
                    {/* Barra de Progreso */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Pregunta <strong style={{ color: '#fff' }}>{currentQ + 1}</strong> de {totalQ}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(201,162,39,0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                                {currentQuestion.tema} · {currentQuestion.lawRef}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '3px' }}>
                            {TEST_QUESTIONS.map((_, i) => (
                                <div key={i} style={{
                                    flex: 1, height: '5px', borderRadius: '3px',
                                    background: i < currentQ
                                        ? (answers[TEST_QUESTIONS[i].id] === TEST_QUESTIONS[i].correct ? 'var(--success)' : 'var(--error)')
                                        : i === currentQ ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                                }} />
                            ))}
                        </div>
                    </div>

                    {/* Tarjeta Pregunta */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.35rem', marginBottom: '2rem', color: '#fff', lineHeight: 1.5 }}>
                            {currentQuestion.question}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                            {currentQuestion.options.map((opt, idx) => {
                                let borderColor = 'rgba(255,255,255,0.1)';
                                let bg = 'rgba(255,255,255,0.04)';
                                let textColor = 'var(--text-secondary)';

                                if (showExplanation) {
                                    if (idx === currentQuestion.correct) {
                                        borderColor = 'var(--success)';
                                        bg = 'rgba(16,163,127,0.1)';
                                        textColor = '#fff';
                                    } else if (idx === selected && selected !== currentQuestion.correct) {
                                        borderColor = 'var(--error)';
                                        bg = 'rgba(239,68,68,0.1)';
                                        textColor = '#fff';
                                    }
                                } else if (selected === idx) {
                                    borderColor = 'var(--primary)';
                                    bg = 'rgba(201,162,39,0.1)';
                                    textColor = '#fff';
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={showExplanation}
                                        style={{
                                            display: 'flex', alignItems: 'flex-start', gap: '1rem',
                                            padding: '1rem 1.25rem', textAlign: 'left',
                                            background: bg, border: `1px solid ${borderColor}`,
                                            borderRadius: '10px', cursor: showExplanation ? 'default' : 'pointer',
                                            color: textColor, transition: 'all 0.15s ease',
                                            width: '100%'
                                        }}
                                    >
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.85rem',
                                            background: showExplanation && idx === currentQuestion.correct
                                                ? 'var(--success)'
                                                : showExplanation && idx === selected && selected !== currentQuestion.correct
                                                    ? 'var(--error)'
                                                    : selected === idx ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            color: selected === idx || (showExplanation && (idx === currentQuestion.correct || idx === selected)) ? '#000' : 'var(--text-secondary)',
                                        }}>
                                            {showExplanation && idx === currentQuestion.correct ? '✓' : showExplanation && idx === selected && selected !== currentQuestion.correct ? '✗' : String.fromCharCode(65 + idx)}
                                        </div>
                                        <span style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{opt}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explicación tras responder */}
                        {showExplanation && (
                            <div style={{
                                padding: '1rem 1.25rem',
                                background: isCorrect ? 'rgba(16,163,127,0.08)' : 'rgba(239,68,68,0.08)',
                                border: `1px solid ${isCorrect ? 'rgba(16,163,127,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                borderRadius: '10px',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ fontWeight: 700, color: isCorrect ? 'var(--success)' : 'var(--error)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    {isCorrect ? '✅ Correcto' : '❌ Incorrecto'} — {currentQuestion.lawRef}
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-primary"
                                style={{ padding: '0.75rem 2rem', opacity: showExplanation ? 1 : 0.3, cursor: showExplanation ? 'pointer' : 'not-allowed' }}
                                onClick={handleNext}
                                disabled={!showExplanation}
                            >
                                {currentQ + 1 < totalQ ? 'Siguiente pregunta →' : 'Ver mi resultado →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== RESULTADO ===== */}
            {phase === 'result' && (
                <div className="fade-in" style={{ textAlign: 'center' }}>
                    <div className="card" style={{
                        padding: '3rem', maxWidth: '680px', margin: '0 auto',
                        background: passed
                            ? 'linear-gradient(145deg, rgba(16,163,127,0.06) 0%, rgba(20,20,20,0.9) 100%)'
                            : 'linear-gradient(145deg, rgba(245,158,11,0.06) 0%, rgba(20,20,20,0.9) 100%)',
                        border: `1px solid ${passed ? 'rgba(16,163,127,0.3)' : 'rgba(245,158,11,0.3)'}`
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{passed ? '🎉' : '📚'}</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
                            {passed ? '¡Test Superado!' : 'Necesitas reforzar conceptos'}
                        </h2>
                        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: passed ? 'var(--success)' : 'var(--warning)', margin: '1rem 0' }}>
                            {pct}%
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                            Has respondido correctamente <strong style={{ color: '#fff' }}>{score} de {totalQ}</strong> preguntas.
                            {passed
                                ? ' Ya tienes acceso a la cualificación oficial. Te recomendamos el nivel que mejor se adapte a tu resultado.'
                                : ' Te recomendamos revisar los conceptos básicos antes de hacer la cualificación.'}
                        </p>

                        {/* Recomendación de nivel */}
                        <div style={{ padding: '1.25rem', background: 'rgba(201,162,39,0.06)', borderRadius: '10px', border: '1px solid rgba(201,162,39,0.2)', marginBottom: '2rem', textAlign: 'left' }}>
                            <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.75rem' }}>🎯 Nivel Recomendado para tu Cualificación:</strong>
                            {pct >= 80 && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>⚡ <strong style={{ color: '#fff' }}>Nivel Express o Medio</strong> — Tienes una base sólida. Puedes optar por el Express o profundizar con el Medio.</p>}
                            {pct >= 60 && pct < 80 && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>🌱 <strong style={{ color: '#fff' }}>Nivel Inicial o Medio</strong> — Bases correctas, consolida con el Nivel Inicial y avanza al Medio.</p>}
                            {pct < 60 && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📖 <strong style={{ color: '#fff' }}>Nivel Inicial</strong> — Te recomendamos empezar por el nivel Inicial para asentar las bases normativas.</p>}
                        </div>

                        {/* Resumen pregunta a pregunta */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '2rem', textAlign: 'left' }}>
                            {TEST_QUESTIONS.map(q => {
                                const ok = answers[q.id] === q.correct;
                                return (
                                    <div key={q.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', alignItems: 'flex-start' }}>
                                        <span style={{ color: ok ? 'var(--success)' : 'var(--error)', flexShrink: 0, fontWeight: 700 }}>{ok ? '✓' : '✗'}</span>
                                        <div>
                                            <span style={{ color: 'var(--text-secondary)' }}>{q.question.slice(0, 70)}...</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>({q.lawRef})</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn btn-secondary" onClick={() => {
                                setPhase('intro'); setCurrentQ(0); setAnswers({}); setSelected(null); setShowExplanation(false);
                            }}>
                                🔄 Repetir Test
                            </button>
                            <Link href="/worker/cualificacion" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                🎓 Ir a Mi Cualificación →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

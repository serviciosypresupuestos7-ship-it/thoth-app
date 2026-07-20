'use client';

import Link from 'next/link';
import { useState } from 'react';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const diagnosticQuestions = [
    {
        id: 1,
        question: '¿Qué es una "alucinación" en un modelo de Inteligencia Artificial Generativa (como ChatGPT, Copilot o Claude)?',
        options: [
            { id: 'a', text: 'Un error del sistema que hace que el ordenador se apague o se congele.' },
            { id: 'b', text: 'Cuando la IA genera información que parece completamente coherente y real, pero que es inventada o tácticamente falsa.' },
            { id: 'c', text: 'Un protocolo de seguridad que se activa cuando detecta un virus.' },
        ],
        correct: 'b',
    },
    {
        id: 2,
        question: 'Si una herramienta de IA le proporciona un dato estadístico, una ley o un análisis de mercado para un informe corporativo, ¿qué debe hacer?',
        options: [
            { id: 'a', text: 'Copiarlo y pegarlo directamente, ya que las IA procesan millones de datos y no se equivocan.' },
            { id: 'b', text: 'Verificar la información y las fuentes de manera manual antes de usarla o enviarla a un cliente.' },
            { id: 'c', text: 'Descartarlo por completo, ya que la IA nunca acierta en datos numéricos.' },
        ],
        correct: 'b',
    },
    {
        id: 3,
        question: '¿Qué es el "sesgo de automatización"?',
        options: [
            { id: 'a', text: 'La velocidad a la que la IA automatiza las tareas de la oficina.' },
            { id: 'b', text: 'La tendencia humana a confiar ciegamente en las decisiones o sugerencias de un sistema informático, dejando de lado el propio juicio crítico.' },
            { id: 'c', text: 'Un fallo técnico que duplica los procesos en segundo plano.' },
        ],
        correct: 'b',
    },
    {
        id: 4,
        question: 'Está redactando un informe financiero para un cliente importante. ¿Puede introducir los datos económicos reales de este cliente en una herramienta de IA de acceso público/gratuito para que los resuma?',
        options: [
            { id: 'a', text: 'Sí, siempre que el cliente no se entere.' },
            { id: 'b', text: 'No, bajo ningún concepto. Introducir datos confidenciales o personales en modelos públicos vulnera la ley de protección de datos (RGPD) y el secreto comercial.' },
            { id: 'c', text: 'Sí, porque las versiones gratuitas borran el historial cada 24 horas de forma automática.' },
        ],
        correct: 'b',
    },
    {
        id: 5,
        question: '¿Qué significa que un sistema de IA tenga un "sesgo"?',
        options: [
            { id: 'a', text: 'Que el sistema funciona más lento de lo habitual debido a la conexión de red.' },
            { id: 'b', text: 'Que el sistema ofrece resultados sistemáticamente distorsionados o discriminatorios debido a prejuicios presentes en los datos con los que fue entrenado.' },
            { id: 'c', text: 'Que la herramienta requiere un pago de licencia obligatorio.' },
        ],
        correct: 'b',
    },
    {
        id: 6,
        question: 'De acuerdo con la Política Interna de la empresa, ¿qué herramientas de IA está autorizado a utilizar en su puesto de trabajo?',
        options: [
            { id: 'a', text: 'Cualquier aplicación o extensión web que encuentre en internet y me ayude a ir más rápido.' },
            { id: 'b', text: 'Exclusivamente aquellas herramientas que hayan sido auditadas, aprobadas e introducidas formalmente en la "Lista Blanca" por el departamento de IT de la empresa.' },
            { id: 'c', text: 'Únicamente herramientas desarrolladas en España.' },
        ],
        correct: 'b',
    },
    {
        id: 7,
        question: 'Si una IA le ayuda a programar un código de software o a redactar un texto creativo para un cliente, ¿quién es el responsable final del contenido si este infringe derechos de autor o contiene errores graves?',
        options: [
            { id: 'a', text: 'La empresa desarrolladora de la IA (por ejemplo, OpenAI o Microsoft).' },
            { id: 'b', text: 'Nadie, porque los vacíos legales de la IA eximen de responsabilidad.' },
            { id: 'c', text: 'Usted (como operador) y la empresa (como implementadora), ya que existe la obligación legal de supervisión humana.' },
        ],
        correct: 'c',
    },
    {
        id: 8,
        question: '¿Cuál es el canal correcto si detecta que un sistema de IA de la empresa está arrojando resultados sospechosos, erróneos o potencialmente discriminatorios?',
        options: [
            { id: 'a', text: 'Ignorarlo y seguir trabajando de forma manual sin avisar a nadie.' },
            { id: 'b', text: 'Notificarlo de inmediato al Responsable del Plan de IA / Departamento de IT para que registre el incidente y tome medidas.' },
            { id: 'c', text: 'Publicar una queja en las redes sociales de la herramienta.' },
        ],
        correct: 'b',
    },
    {
        id: 9,
        question: 'En relación con el Reglamento Europeo de IA (AI Act), la alfabetización de los empleados en materia de IA es:',
        options: [
            { id: 'a', text: 'Una recomendación opcional que las empresas pueden ignorar si son pequeñas.' },
            { id: 'b', text: 'Una obligación legal estricta y exigible para todas las empresas que utilicen sistemas de IA.' },
            { id: 'c', text: 'Un curso que solo deben realizar los ingenieros informáticos.' },
        ],
        correct: 'b',
    },
    {
        id: 10,
        question: 'Al redactar un "prompt" (instrucción de texto) en una IA corporativa, ¿cuál es la mejor práctica de seguridad?',
        options: [
            { id: 'a', text: 'Darle todos los nombres, DNI y teléfonos de los implicados para que el texto sea lo más preciso posible.' },
            { id: 'b', text: 'Utilizar instrucciones claras y descriptivas utilizando variables genéricas (ej: "Cliente X", "Empresa Y"), anonimizando por completo cualquier dato sensible.' },
            { id: 'c', text: 'Escribir frases muy cortas de menos de tres palabras para no saturar el servidor.' },
        ],
        correct: 'b',
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

    const handleNext = async () => {
        if (!selected) return;
        const q = diagnosticQuestions[currentQ];
        const newAnswers = { ...answers, [q.id]: selected };
        setAnswers(newAnswers);
        setSelected(null);
        if (currentQ + 1 < diagnosticQuestions.length) {
            setCurrentQ(currentQ + 1);
        } else {
            setPhase('result');

            // Calculate final score
            const finalScore = diagnosticQuestions.filter(q => newAnswers[q.id] === q.correct).length;
            const isPassed = (finalScore / totalQ) >= 0.75;

            // Save to Supabase
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Get company id
                    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();

                    if (profile) {
                        const hashId = `EVID-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
                        await supabase.from('evidences').insert({
                            user_id: user.id,
                            company_id: profile.company_id,
                            evidence_type: isPassed ? 'Examen Aprobado' : 'Examen Suspendido',
                            detail: `Cuestionario de Evaluación (Nivel 1). Puntuación: ${finalScore}/${totalQ} (${Math.round((finalScore / totalQ) * 100)}%)`,
                            hash_id: hashId
                        });
                    }
                }
            } catch (err) {
                console.error("Error saving evidence:", err);
            }
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
                            Formación Continua 🔄
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                            La normativa europea exige un reciclaje constante. Completa este test periódico para mantener tu certificado de cumplimiento activo y actualizado.
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

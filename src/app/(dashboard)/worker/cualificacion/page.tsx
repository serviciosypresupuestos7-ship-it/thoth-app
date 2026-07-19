'use client';

import Link from 'next/link';
import { useState } from 'react';

const MISSIONS_MOCK = [
    { id: '1', title: 'Redactar correo a cliente con IA', action: 'Redactar correos', difficulty: 'Media', status: 'pending', time: '10 min', icon: '📧' },
    { id: '2', title: 'Resumir contrato de confidencialidad', action: 'Resumir documentos', difficulty: 'Alta', status: 'pending', time: '15 min', icon: '📝' },
    { id: '3', title: 'Analizar CV para puesto técnico', action: 'Analizar CV', difficulty: 'Baja', status: 'completed', time: '5 min', icon: '👤' },
];

export default function CualificacionPage() {
    // 'intro' | 'tutor' | 'missions'
    const [phase, setPhase] = useState<'intro' | 'tutor' | 'missions' | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

    // Tutor Chat State
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [tutorStep, setTutorStep] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    // Check if diagnostic/tutor was already completed
    import('react').then((React) => {
        React.useEffect(() => {
            const completed = localStorage.getItem('thoth_diagnostic_completed');
            if (completed === 'true') {
                setPhase('missions');
            } else {
                setPhase('intro');
            }
        }, []);
    });

    const startTutor = async () => {
        setPhase('tutor');
        setIsTyping(true);
        try {
            const initialMessages: any[] = [];
            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: initialMessages })
            });
            const data = await res.json();
            if (data.text) {
                setMessages([{ role: 'ai', text: data.text }]);
            } else {
                throw new Error("No text returned");
            }
        } catch (error) {
            console.error(error);
            setMessages([{ role: 'ai', text: 'Error al conectar con el tutor. Por favor, inténtalo de nuevo.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setInputText('');
        setIsTyping(true);

        try {
            // Convert to format expected by API
            const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }));

            const res = await fetch('/api/tutor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });
            const data = await res.json();

            if (data.text) {
                setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
                if (data.text.includes('TERMINAR')) {
                    setTutorStep(2); // Show finish button
                }
            } else {
                throw new Error("No text returned");
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', text: 'Error de conexión. Intenta enviar tu mensaje de nuevo.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    const pendingCount = MISSIONS_MOCK.filter(m => m.status === 'pending').length;
    const completedCount = MISSIONS_MOCK.filter(m => m.status === 'completed').length;

    if (!phase) return null; // Loading state

    return (
        <div style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>

            {/* Botón global de volver al menú */}
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/worker/panel" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    <span>←</span> Volver al Panel Principal
                </Link>
            </div>

            {/* ======= FASE 0: INTRODUCCIÓN ======= */}
            {phase === 'intro' && (
                <div className="fade-in card" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(145deg, rgba(16, 163, 127, 0.05) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(16, 163, 127, 0.2)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👋</div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        Bienvenido a tu Alfabetización en IA
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
                        El uso de la Inteligencia Artificial en el trabajo está regulado por la ley europea (AI Act). Como partimos de cero, vamos a hacer un pequeño curso interactivo antes de empezar a trabajar.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px', margin: '0 auto 3rem auto', textAlign: 'left' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(16, 163, 127, 0.2)', color: 'var(--success)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Tutoría Interactiva (3 minutos)</strong>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chatearás con la IA, que te explicará las 3 reglas de oro de forma muy sencilla y con ejemplos.</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ background: 'rgba(16, 163, 127, 0.2)', color: 'var(--success)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                            <div>
                                <strong style={{ color: '#fff', display: 'block', marginBottom: '0.25rem' }}>Misiones Prácticas</strong>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Casos reales de tu puesto de trabajo para poner en práctica lo aprendido.</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem' }} onClick={startTutor}>
                        Comenzar Tutoría Guiada →
                    </button>
                </div>
            )}

            {/* ======= FASE 1: TUTOR INTERACTIVO ======= */}
            {phase === 'tutor' && (
                <div className="fade-in" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <h1 className="title-gradient" style={{ fontSize: '1.8rem', margin: 0 }}>
                            Tutor de Alfabetización 🧠
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aprende los conceptos básicos chateando.</p>
                    </div>

                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        {/* Chat Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {messages.map((msg, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: msg.role === 'ai' ? 'rgba(201,162,39,0.2)' : 'rgba(16,163,127,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                                        {msg.role === 'ai' ? '🤖' : '👤'}
                                    </div>
                                    <div style={{ background: msg.role === 'ai' ? 'rgba(255,255,255,0.05)' : 'rgba(16,163,127,0.1)', padding: '1rem 1.25rem', borderRadius: '12px', border: msg.role === 'ai' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16,163,127,0.3)', maxWidth: '80%', whiteSpace: 'pre-wrap', lineHeight: '1.5', color: '#fff' }}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(201,162,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', color: 'var(--text-muted)' }}>Escribiendo...</div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                            {tutorStep === 2 ? (
                                <div style={{ textAlign: 'center' }}>
                                    <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }} onClick={() => {
                                        localStorage.setItem('thoth_diagnostic_completed', 'true');
                                        setPhase('missions');
                                    }}>
                                        🎯 Ir a mis Misiones Prácticas
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
                                        placeholder="Escribe tu respuesta aquí..."
                                        value={inputText}
                                        onChange={e => setInputText(e.target.value)}
                                        disabled={isTyping}
                                    />
                                    <button type="submit" className="btn btn-primary" disabled={isTyping || !inputText.trim()} style={{ padding: '0 2rem' }}>
                                        Enviar
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ======= FASE 2: MISIONES / CUALIFICACIONES ======= */}
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
                        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => {
                            localStorage.removeItem('thoth_diagnostic_completed');
                            setPhase('intro');
                            setTutorStep(0);
                            setMessages([]);
                        }}>
                            🔄 Repetir Tutoría
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

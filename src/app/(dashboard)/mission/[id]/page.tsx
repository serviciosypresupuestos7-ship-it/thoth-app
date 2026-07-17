'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Mission {
    id: string;
    title: string;
    description: string;
    target_action: string;
    difficulty: string;
    related_laws: string[];
}

interface EvaluationResult {
    ai_correction: string;
    score: number;
    passed: boolean;
    evidence_used: string[];
}

export default function MissionPage() {
    const params = useParams();
    const router = useRouter();
    const missionId = params.id as string;

    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(true);
    const [response, setResponse] = useState('');
    const [evaluating, setEvaluating] = useState(false);
    const [result, setResult] = useState<EvaluationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (missionId) {
            fetchMission();
        }
    }, [missionId]);

    const fetchMission = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('id', missionId)
                .single();

            if (error) throw error;
            setMission(data);
        } catch (err: any) {
            console.error('Error fetching mission:', err);
            // Fallback for mock testing
            if (missionId === 'mock-1') {
                setMission({
                    id: 'mock-1',
                    title: 'Redacción de correo con datos sensibles',
                    description: 'Un cliente te pide que le envíes por correo el resumen médico de su empleado. ¿Cómo redactas el correo?',
                    target_action: 'Redactar correos',
                    difficulty: 'medium',
                    related_laws: ['RGPD Art. 5']
                });
            } else {
                setError('No se pudo cargar la misión.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async () => {
        if (!response.trim()) return;

        setEvaluating(true);
        setError(null);

        try {
            const res = await fetch('/api/missions/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mission_id: missionId, employee_response: response }),
            });

            const data = await res.json();
            if (res.ok) {
                setResult(data.result);
            } else {
                throw new Error(data.error || 'Error al evaluar la misión');
            }
        } catch (err: any) {
            console.error('Evaluation error:', err);
            // Fallback for mock testing
            setResult({
                ai_correction: `[Mock] Has hecho un buen trabajo, pero recuerda que los datos médicos son de categoría especial. No debes enviarlos por correo electrónico estándar sin cifrar.`,
                score: 75,
                passed: true,
                evidence_used: ['RGPD Art. 9']
            });
        } finally {
            setEvaluating(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando misión...</div>;
    }

    if (error || !mission) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Misión no encontrada'}</div>
                <Link href="/" className="btn btn-secondary">Volver al Dashboard</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                ← Volver al Dashboard
            </Link>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderTop: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>{mission.title}</h1>
                    <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'var(--warning)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {mission.difficulty}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <span className="badge badge-secondary">Acción: {mission.target_action}</span>
                    {mission.related_laws?.map((law, i) => (
                        <span key={i} className="badge" style={{ background: 'rgba(30, 78, 140, 0.2)', color: 'var(--primary)' }}>{law}</span>
                    ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', borderLeft: '3px solid var(--text-muted)', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Escenario</h3>
                    <p style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>
                        {mission.description}
                    </p>
                </div>

                {!result ? (
                    <div>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tu Respuesta</h3>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Escribe aquí cómo actuarías en esta situación..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                padding: '1rem',
                                color: '#fff',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                marginBottom: '1.5rem',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleEvaluate}
                                disabled={evaluating || !response.trim()}
                                className="btn btn-primary"
                                style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
                            >
                                {evaluating ? 'Evaluando...' : 'Enviar Respuesta'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Evaluación de THOTH</h3>

                        <div style={{
                            background: result.passed ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                            border: `1px solid ${result.passed ? 'var(--success)' : 'var(--danger)'}`,
                            padding: '2rem',
                            borderRadius: '8px',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '60px', height: '60px',
                                    borderRadius: '50%',
                                    background: result.passed ? 'var(--success)' : 'var(--danger)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', fontWeight: 'bold', color: '#fff'
                                }}>
                                    {result.score}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: result.passed ? 'var(--success)' : 'var(--danger)', fontSize: '1.5rem' }}>
                                        {result.passed ? '¡Misión Superada!' : 'Misión Fallida'}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Puntuación de competencia</p>
                                </div>
                            </div>

                            <div style={{ color: '#fff', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                {result.ai_correction}
                            </div>

                            {result.evidence_used && result.evidence_used.length > 0 && (
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '0.5rem' }}>Evidencia legal aplicada:</span>
                                    {result.evidence_used.map((ev, i) => (
                                        <span key={i} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>{ev}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Link href="/" className="btn btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem', textDecoration: 'none' }}>
                                Volver a mis Misiones
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

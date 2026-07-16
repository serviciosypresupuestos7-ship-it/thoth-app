'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface Exercise {
    id: string;
    chunk_id: string;
    domain_id: string;
    legal_requirement: string;
    plain_language: string;
    department: string;
    job_role: string;
    task: string;
    risk: string;
    required_skill: string;
    exercise_type: string;
    difficulty: string;
    evidence: string;
    review_status: string;
    chunk?: {
        text: string;
        title: string;
        section: string;
        authority: string;
        url: string;
    };
}

function ReviewContent() {
    const searchParams = useSearchParams();
    const initialDomain = searchParams.get('domain') || 'ai_literacy';

    const [domain, setDomain] = useState(initialDomain);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editable form fields
    const [formData, setFormData] = useState<Partial<Exercise>>({});

    const supabase = createClient();

    useEffect(() => {
        fetchExercises();
    }, [domain]);

    const fetchExercises = async () => {
        setLoading(true);
        try {
            // Fetch exercises with chunk relation
            const { data, error } = await supabase
                .from('training_exercises')
                .select(`
          *,
          chunk:legal_chunks (
            text,
            title,
            section,
            authority,
            url
          )
        `)
                .eq('domain_id', domain)
                .eq('review_status', 'pending')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Map the response to our interface
            const mapped = (data || []).map((item: any) => ({
                ...item,
                chunk: item.chunk ? {
                    text: item.chunk.text,
                    title: item.chunk.title,
                    section: item.chunk.section,
                    authority: item.chunk.authority,
                    url: item.chunk.url
                } : undefined
            })) as Exercise[];

            setExercises(mapped);
            setCurrentIndex(0);
            if (mapped.length > 0) {
                setFormData(mapped[0]);
            } else {
                setFormData({});
            }
        } catch (err: any) {
            console.error('Error fetching exercises:', err);
            // Fallback mock data
            const mockExercises: Exercise[] = [
                {
                    id: 'ex-1',
                    chunk_id: 'chunk-1',
                    domain_id: 'ai_literacy',
                    legal_requirement: 'Garantizar la supervisión humana de los sistemas de IA',
                    plain_language: 'El trabajador no debe aceptar ciegamente las respuestas de la IA. Debe verificar la información antes de tomar decisiones.',
                    department: 'Administración',
                    job_role: 'Administrativo',
                    task: 'Redactar un correo a un cliente con plazos de entrega',
                    risk: 'La IA inventa plazos de entrega incorrectos y se envía información falsa al cliente.',
                    required_skill: 'Verificación de datos generados por IA',
                    exercise_type: 'simulation',
                    difficulty: 'basic',
                    evidence: 'El trabajador identifica y corrige el dato falso en el borrador del correo.',
                    review_status: 'pending',
                    chunk: {
                        text: '## Artículo 14. Supervisión humana\n1. Los sistemas de IA de alto riesgo se diseñarán y desarrollarán de manera que puedan ser supervisados eficazmente por personas físicas durante el período en que estén en uso.\n2. La supervisión humana tendrá por objeto prevenir o minimizar los riesgos para la salud, la seguridad o los derechos fundamentales...',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 14',
                        authority: 'Unión Europea - EUR-Lex',
                        url: 'https://eur-lex.europa.eu/...'
                    }
                },
                {
                    id: 'ex-2',
                    chunk_id: 'chunk-2',
                    domain_id: 'ai_literacy',
                    legal_requirement: 'Promover la alfabetización en IA entre el personal',
                    plain_language: 'La empresa debe capacitar a sus empleados para que usen la IA de forma segura, ética y eficiente.',
                    department: 'Recursos Humanos',
                    job_role: 'Gestor de Formación',
                    task: 'Diseñar el plan de formación anual de la plantilla',
                    risk: 'Los empleados usan herramientas de IA sin conocer sus limitaciones, exponiendo datos confidenciales.',
                    required_skill: 'Diseño de planes de capacitación en competencias digitales',
                    exercise_type: 'simulation',
                    difficulty: 'intermediate',
                    evidence: 'El gestor incluye un módulo obligatorio sobre uso seguro de IA en el plan de formación.',
                    review_status: 'pending',
                    chunk: {
                        text: '## Artículo 4. Alfabetización en materia de inteligencia artificial\nLos proveedores y los responsables del despliegue de sistemas de IA adoptarán medidas para garantizar, en la medida de lo posible, un nivel suficiente de alfabetización en materia de IA de su personal y de otras personas que se encarguen de la explotación y el uso de sistemas de IA...',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 4',
                        authority: 'Unión Europea - EUR-Lex',
                        url: 'https://eur-lex.europa.eu/...'
                    }
                }
            ].filter(ex => ex.domain_id === domain);

            setExercises(mockExercises);
            setCurrentIndex(0);
            if (mockExercises.length > 0) {
                setFormData(mockExercises[0]);
            } else {
                setFormData({});
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveStatus = async (status: 'approved' | 'rejected') => {
        if (exercises.length === 0) return;
        setSaving(true);
        const currentEx = exercises[currentIndex];

        try {
            const updateData = {
                legal_requirement: formData.legal_requirement,
                plain_language: formData.plain_language,
                department: formData.department,
                job_role: formData.job_role,
                task: formData.task,
                risk: formData.risk,
                required_skill: formData.required_skill,
                exercise_type: formData.exercise_type,
                difficulty: formData.difficulty,
                evidence: formData.evidence,
                review_status: status,
                reviewed_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('training_exercises')
                .update(updateData)
                .eq('id', currentEx.id);

            if (error) throw error;

            // Phase 10: Log to immutable validation_history
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || '00000000-0000-0000-0000-000000000000'; // Fallback for local testing if no auth

            await supabase.from('validation_history').insert({
                entity_type: 'exercise',
                entity_id: currentEx.id,
                action: status,
                previous_status: currentEx.review_status,
                new_status: status,
                reason: 'Human review via UI',
                snapshot_before: currentEx,
                snapshot_after: { ...currentEx, ...updateData },
                user_id: userId
            });

            // Remove from current list
            const updated = exercises.filter((_, idx) => idx !== currentIndex);
            setExercises(updated);

            if (updated.length > 0) {
                const nextIndex = currentIndex >= updated.length ? updated.length - 1 : currentIndex;
                setCurrentIndex(nextIndex);
                setFormData(updated[nextIndex]);
            } else {
                setFormData({});
            }
        } catch (err) {
            console.error('Error updating exercise status:', err);
            // Local fallback simulation
            alert(`[Simulación Local] Ejercicio marcado como ${status.toUpperCase()}`);
            const updated = exercises.filter((_, idx) => idx !== currentIndex);
            setExercises(updated);
            if (updated.length > 0) {
                const nextIndex = currentIndex >= updated.length ? updated.length - 1 : currentIndex;
                setCurrentIndex(nextIndex);
                setFormData(updated[nextIndex]);
            } else {
                setFormData({});
            }
        } finally {
            setSaving(false);
        }
    };

    const currentExercise = exercises[currentIndex];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Revisión Humana</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Valida y edita las propuestas de entrenamiento generadas por la IA.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label className="form-label" style={{ margin: 0 }}>Dominio:</label>
                    <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="form-select"
                        style={{ width: 'auto', minWidth: '200px' }}
                    >
                        <option value="ai_literacy">Alfabetización en IA</option>
                        <option value="autonomos">Normativa para Autónomos</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                    Cargando propuestas de entrenamiento...
                </div>
            ) : exercises.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>¡Todo al día!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>No hay propuestas de entrenamiento pendientes de revisión para este dominio.</p>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="badge badge-primary">
                            Propuesta {currentIndex + 1} de {exercises.length}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => {
                                    const prev = currentIndex - 1;
                                    setCurrentIndex(prev);
                                    setFormData(exercises[prev]);
                                }}
                                disabled={currentIndex === 0}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => {
                                    const next = currentIndex + 1;
                                    setCurrentIndex(next);
                                    setFormData(exercises[next]);
                                }}
                                disabled={currentIndex === exercises.length - 1}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>

                    <div className="review-layout">
                        {/* Left Panel: Source Text */}
                        <div className="source-panel">
                            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Fuente Oficial</h3>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documento</div>
                                <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{currentExercise?.chunk?.title}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sección / Artículo</div>
                                <div style={{ fontWeight: '600' }}>{currentExercise?.chunk?.section}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organismo</div>
                                <div>{currentExercise?.chunk?.authority}</div>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Texto del Fragmento</div>
                                <div className="source-text-box" style={{ flex: 1, overflowY: 'auto' }}>
                                    {currentExercise?.chunk?.text}
                                </div>
                            </div>

                            {currentExercise?.chunk?.url && (
                                <a
                                    href={currentExercise.chunk.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.85rem', padding: '0.5rem', textAlign: 'center' }}
                                >
                                    Ver Fuente Oficial ↗
                                </a>
                            )}
                        </div>

                        {/* Right Panel: Editable Exercise */}
                        <div className="exercise-panel">
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                                Propuesta de Entrenamiento (IA)
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Departamento</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department || ''}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rol Laboral</label>
                                    <input
                                        type="text"
                                        name="job_role"
                                        value={formData.job_role || ''}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Requisito Legal (Resumen)</label>
                                <input
                                    type="text"
                                    name="legal_requirement"
                                    value={formData.legal_requirement || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Explicación en Lenguaje Sencillo</label>
                                <textarea
                                    name="plain_language"
                                    value={formData.plain_language || ''}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tarea Laboral Cotidiana</label>
                                <input
                                    type="text"
                                    name="task"
                                    value={formData.task || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Riesgo Práctico</label>
                                <textarea
                                    name="risk"
                                    value={formData.risk || ''}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Habilidad Requerida</label>
                                <input
                                    type="text"
                                    name="required_skill"
                                    value={formData.required_skill || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Tipo de Ejercicio</label>
                                    <select
                                        name="exercise_type"
                                        value={formData.exercise_type || 'simulation'}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="simulation">Simulación</option>
                                        <option value="quiz">Cuestionario</option>
                                        <option value="roleplay">Juego de Rol</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Dificultad</label>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty || 'basic'}
                                        onChange={handleInputChange}
                                        className="form-select"
                                    >
                                        <option value="basic">Básico</option>
                                        <option value="intermediate">Intermedio</option>
                                        <option value="advanced">Avanzado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Evidencia de Aprendizaje</label>
                                <input
                                    type="text"
                                    name="evidence"
                                    value={formData.evidence || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="action-bar">
                                <button
                                    onClick={() => handleSaveStatus('rejected')}
                                    disabled={saving}
                                    className="btn btn-danger"
                                >
                                    Rechazar
                                </button>
                                <button
                                    onClick={() => handleSaveStatus('approved')}
                                    disabled={saving}
                                    className="btn btn-success"
                                >
                                    {saving ? 'Guardando...' : 'Aprobar y Publicar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Cargando interfaz de revisión...</div>}>
            <ReviewContent />
        </Suspense>
    );
}

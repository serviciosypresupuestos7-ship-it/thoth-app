'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type TabType = 'conceptos' | 'relaciones' | 'oportunidades';

function ReviewContent() {
    const searchParams = useSearchParams();
    const initialDomain = searchParams.get('domain') || 'ai_literacy';

    const [domain, setDomain] = useState(initialDomain);
    const [activeTab, setActiveTab] = useState<TabType>('oportunidades');
    const [items, setItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Editable form fields
    const [formData, setFormData] = useState<any>({});

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, [domain, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let data: any[] | null = [];
            let error = null;

            if (activeTab === 'conceptos') {
                const res = await supabase
                    .from('legal_concepts')
                    .select('*')
                    .eq('domain_id', domain)
                    .eq('status', 'proposed')
                    .order('created_at', { ascending: true });
                data = res.data;
                error = res.error;
            } else if (activeTab === 'relaciones') {
                const res = await supabase
                    .from('legal_relationships')
                    .select('*')
                    .eq('status', 'proposed')
                    .order('created_at', { ascending: true });
                data = res.data;
                error = res.error;
            } else if (activeTab === 'oportunidades') {
                const res = await supabase
                    .from('legal_opportunities')
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
                    .eq('status', 'proposed')
                    .order('created_at', { ascending: true });
                data = res.data;
                error = res.error;
            }

            if (error) throw error;

            setItems(data || []);
            setCurrentIndex(0);
            if (data && data.length > 0) {
                setFormData(data[0]);
            } else {
                setFormData({});
            }
        } catch (err: any) {
            console.error('Error fetching data:', err);

            // Fallback mock data for demonstration if DB is empty or errors
            if (activeTab === 'oportunidades') {
                const mockOpps = [
                    {
                        id: 'opp-1',
                        title: 'Bonificación por Supervisión Humana',
                        description: 'Posible reducción de cuotas si se implementa un sistema de supervisión humana certificada.',
                        opportunity_type: 'beneficio',
                        reasoning_summary: 'El artículo 14 exige supervisión humana. Implementarla proactivamente puede calificar para subvenciones de digitalización segura.',
                        conditions: ['Certificación ISO', 'Auditoría anual'],
                        limitations: ['Solo aplicable a PYMES'],
                        conflicts: [],
                        status: 'proposed',
                        chunk: {
                            text: '## Artículo 14. Supervisión humana\n1. Los sistemas de IA de alto riesgo se diseñarán y desarrollarán de manera que puedan ser supervisados eficazmente por personas físicas durante el período en que estén en uso.',
                            title: 'Reglamento Europeo de IA',
                            section: 'Artículo 14',
                            authority: 'Unión Europea - EUR-Lex',
                            url: 'https://eur-lex.europa.eu/...'
                        }
                    }
                ];
                setItems(mockOpps);
                setFormData(mockOpps[0]);
            } else {
                setItems([]);
                setFormData({});
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSaveStatus = async (status: 'approved' | 'rejected') => {
        if (items.length === 0) return;
        setSaving(true);
        const currentItem = items[currentIndex];

        try {
            let table = '';
            let updateData: any = { status };

            if (activeTab === 'conceptos') {
                table = 'legal_concepts';
                updateData.name = formData.name;
                updateData.description = formData.description;
            } else if (activeTab === 'relaciones') {
                table = 'legal_relationships';
                updateData.relationship_type = formData.relationship_type;
                updateData.description = formData.description;
            } else if (activeTab === 'oportunidades') {
                table = 'legal_opportunities';
                updateData.title = formData.title;
                updateData.description = formData.description;
                updateData.reasoning_summary = formData.reasoning_summary;
                updateData.reviewed_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from(table)
                .update(updateData)
                .eq('id', currentItem.id);

            if (error) throw error;

            // Phase 10: Log to immutable validation_history
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id || '00000000-0000-0000-0000-000000000000';

            await supabase.from('validation_history').insert({
                entity_type: activeTab.slice(0, -1), // concepto, relacion, oportunidad
                entity_id: currentItem.id,
                action: status,
                previous_status: currentItem.status,
                new_status: status,
                reason: 'Human review via UI',
                snapshot_before: currentItem,
                snapshot_after: { ...currentItem, ...updateData },
                user_id: userId
            });

            // Remove from current list
            const updated = items.filter((_, idx) => idx !== currentIndex);
            setItems(updated);

            if (updated.length > 0) {
                const nextIndex = currentIndex >= updated.length ? updated.length - 1 : currentIndex;
                setCurrentIndex(nextIndex);
                setFormData(updated[nextIndex]);
            } else {
                setFormData({});
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert(`[Simulación Local] Elemento marcado como ${status.toUpperCase()}`);
            const updated = items.filter((_, idx) => idx !== currentIndex);
            setItems(updated);
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

    const currentItem = items[currentIndex];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Validación</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Toda propuesta es revisada por un experto antes de incorporarse al conocimiento validado del sistema.</p>
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

            {/* Tabs Navigation */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
                <button
                    className={`nav-link ${activeTab === 'conceptos' ? 'active' : ''}`}
                    style={{ background: activeTab === 'conceptos' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: activeTab === 'conceptos' ? '1px solid var(--border-color)' : '1px solid transparent', color: activeTab === 'conceptos' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setActiveTab('conceptos')}
                >
                    Conceptos pendientes
                </button>
                <button
                    className={`nav-link ${activeTab === 'relaciones' ? 'active' : ''}`}
                    style={{ background: activeTab === 'relaciones' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: activeTab === 'relaciones' ? '1px solid var(--border-color)' : '1px solid transparent', color: activeTab === 'relaciones' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setActiveTab('relaciones')}
                >
                    Relaciones pendientes
                </button>
                <button
                    className={`nav-link ${activeTab === 'oportunidades' ? 'active' : ''}`}
                    style={{ background: activeTab === 'oportunidades' ? 'rgba(255, 107, 0, 0.1)' : 'transparent', border: activeTab === 'oportunidades' ? '1px solid var(--border-color)' : '1px solid transparent', color: activeTab === 'oportunidades' ? '#fff' : 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => setActiveTab('oportunidades')}
                >
                    Oportunidades pendientes
                </button>
                <button
                    className="nav-link"
                    style={{ background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => alert('Esta sección se implementará próximamente.')}
                >
                    Cambios BOE
                </button>
                <button
                    className="nav-link"
                    style={{ background: 'transparent', border: '1px solid transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    onClick={() => alert('Esta sección se implementará próximamente.')}
                >
                    Knowledge Gaps
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
                    Cargando propuestas...
                </div>
            ) : items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>¡Todo al día!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>No hay elementos pendientes de revisión en esta categoría.</p>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="badge badge-primary">
                            Propuesta {currentIndex + 1} de {items.length}
                        </span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => {
                                    const prev = currentIndex - 1;
                                    setCurrentIndex(prev);
                                    setFormData(items[prev]);
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
                                    setFormData(items[next]);
                                }}
                                disabled={currentIndex === items.length - 1}
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>

                    <div className="review-layout">
                        {/* Left Panel: Source Text (Only for Opportunities which have chunks) */}
                        <div className="source-panel">
                            <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>Fuente Oficial</h3>
                            {currentItem?.chunk ? (
                                <>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Documento</div>
                                        <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{currentItem.chunk.title}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sección / Artículo</div>
                                        <div style={{ fontWeight: '600' }}>{currentItem.chunk.section}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Organismo</div>
                                        <div>{currentItem.chunk.authority}</div>
                                    </div>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Texto del Fragmento</div>
                                        <div className="source-text-box" style={{ flex: 1, overflowY: 'auto' }}>
                                            {currentItem.chunk.text}
                                        </div>
                                    </div>

                                    {currentItem.chunk.url && (
                                        <a
                                            href={currentItem.chunk.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-secondary"
                                            style={{ fontSize: '0.85rem', padding: '0.5rem', textAlign: 'center' }}
                                        >
                                            Ver Fuente Oficial ↗
                                        </a>
                                    )}
                                </>
                            ) : (
                                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem 0' }}>
                                    Este elemento no tiene un fragmento de texto asociado directamente.
                                </div>
                            )}
                        </div>

                        {/* Right Panel: Editable Form based on Tab */}
                        <div className="exercise-panel">
                            <h3 style={{ fontSize: '1.2rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                                {activeTab === 'conceptos' ? 'Concepto Jurídico Identificado' :
                                    activeTab === 'relaciones' ? 'Relación Jurídica Inferida' :
                                        'Oportunidad Legal Detectada'}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>

                                {activeTab === 'conceptos' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Nombre del Concepto</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Descripción Legal</label>
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="form-textarea"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'relaciones' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Tipo de Relación</label>
                                            <input
                                                type="text"
                                                name="relationship_type"
                                                value={formData.relationship_type || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Justificación de la Relación</label>
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="form-textarea"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === 'oportunidades' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Título de la Oportunidad</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title || ''}
                                                onChange={handleInputChange}
                                                className="form-input"
                                                style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary)' }}
                                            />
                                        </div>

                                        <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '1rem' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Descripción</h4>
                                            <textarea
                                                name="description"
                                                value={formData.description || ''}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="form-textarea"
                                                style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                            />
                                        </div>

                                        <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '1rem' }}>
                                            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Razonamiento Jurídico</h4>
                                            <textarea
                                                name="reasoning_summary"
                                                value={formData.reasoning_summary || ''}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="form-textarea"
                                                style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '1rem' }}>
                                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Condiciones</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {(formData.conditions || []).map((cond: string, i: number) => (
                                                        <div key={i} style={{ fontSize: '0.9rem', color: '#c4b5fd' }}>• {cond}</div>
                                                    ))}
                                                    {(!formData.conditions || formData.conditions.length === 0) && <span style={{ color: 'var(--text-muted)' }}>Ninguna</span>}
                                                </div>
                                            </div>
                                            <div style={{ borderLeft: '3px solid var(--danger)', paddingLeft: '1rem' }}>
                                                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Limitaciones</h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {(formData.limitations || []).map((lim: string, i: number) => (
                                                        <div key={i} style={{ fontSize: '0.9rem', color: 'var(--danger)' }}>• {lim}</div>
                                                    ))}
                                                    {(!formData.limitations || formData.limitations.length === 0) && <span style={{ color: 'var(--text-muted)' }}>Ninguna</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div style={{ borderLeft: '3px solid #64748b', paddingLeft: '1rem', marginTop: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Observaciones del Revisor</h4>
                                    <textarea
                                        placeholder="Añadir notas internas o matices legales..."
                                        rows={2}
                                        className="form-textarea"
                                        style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                    />
                                </div>
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

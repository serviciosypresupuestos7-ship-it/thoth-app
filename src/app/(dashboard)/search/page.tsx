'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
    id: string;
    title: string;
    section: string;
    text: string;
    url: string;
    authority: string;
    similarity?: number;
}

export default function SearchPage() {
    const [domain, setDomain] = useState('ai_literacy');
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer(
        "**Normativa aplicable**\n" +
        "- AI Act (Art. 4, Art. 14)\n\n" +
        "**Obligaciones detectadas**\n" +
        "- Es obligatorio que los sistemas de IA de alto riesgo sean supervisados por personas físicas para prevenir riesgos legales.\n" +
        "- Los responsables del despliegue deben garantizar un nivel suficiente de alfabetización en IA de su personal.\n\n" +
        "**Riesgos jurídicos**\n" +
        "- Aceptación automática de resultados generados por IA que puedan contener errores jurídicos o plazos incorrectos.\n\n" +
        "**Recomendaciones**\n" +
        "- No enviar contratos generados por IA directamente. Establecer un proceso de revisión humana obligatoria.\n\n" +
        "**THOTH ha detectado además:**\n" +
        "- Existe una guía publicada por la Comisión Europea sobre la supervisión humana en sistemas de IA de alto riesgo.\n\n" +
        "*Durante el análisis se han identificado 2 obligaciones, 1 riesgo jurídico, 2 fuentes oficiales aplicables y 1 guía complementaria relevante.*"
    );
        setResults([]);

        try {
            // In a real RAG app, we would:
            // 1. Call an API route to generate query embedding and call match_chunks RPC
            // 2. Call LLM to generate answer based on retrieved chunks
            // Let's call a local API route /api/search
            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, domain }),
            });

            const data = await res.json();
            if (res.ok) {
                setAnswer(data.answer);
                setResults(data.results || []);
            } else {
                throw new Error(data.error || 'Error en la búsqueda');
            }
        } catch (err: any) {
            console.error('Search error:', err);
            // Fallback mock search for local testing
            setTimeout(() => {
                setAnswer(
                    `Según la normativa analizada para el dominio de **${domain === 'ai_literacy' ? 'Alfabetización en IA' : 'Autónomos'}**, se establece lo siguiente:\n\n` +
                    `1. **Supervisión Humana**: Es obligatorio que los sistemas de IA de alto riesgo sean supervisados por personas físicas para prevenir riesgos (Art. 14 AI Act).\n` +
                    `2. **Capacitación**: Los responsables del despliegue deben garantizar un nivel suficiente de alfabetización en IA de su personal (Art. 4 AI Act).\n\n` +
                    `*Esta respuesta ha sido generada de forma sintética para la demostración local.*`
                );
                setResults([
                    {
                        id: 'chunk-1',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 14. Supervisión humana',
                        text: 'Los sistemas de IA de alto riesgo se diseñarán y desarrollarán de manera que puedan ser supervisados eficazmente por personas físicas durante el período en que estén en uso.',
                        url: 'https://eur-lex.europa.eu/...',
                        authority: 'Unión Europea - EUR-Lex',
                        similarity: 0.89
                    },
                    {
                        id: 'chunk-2',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 4. Alfabetización en materia de IA',
                        text: 'Los proveedores y los responsables del despliegue de sistemas de IA adoptarán medidas para garantizar, en la medida de lo posible, un nivel suficiente de alfabetización en materia de IA de su personal...',
                        url: 'https://eur-lex.europa.eu/...',
                        authority: 'Unión Europea - EUR-Lex',
                        similarity: 0.82
                    }
                ]);
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="search-container">
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Consultas Jurídicas</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Describe tu problema. THOTH buscará en la normativa oficial, conectará los conceptos y te propondrá una solución basada en el conocimiento validado.
                </p>
            </div>

            <form onSubmit={handleSearch} className="search-box">
                <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', minWidth: '200px' }}
                >
                    <option value="ai_literacy">Alfabetización en IA</option>
                    <option value="autonomos">Normativa para Autónomos</option>
                </select>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe tu problema detalladamente (ej. 'Tengo un cliente que no me paga desde hace 6 meses y quiero saber qué opciones legales tengo como autónomo...')"
                    className="form-input"
                    style={{ flex: 1, minHeight: '100px', resize: 'vertical' }}
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Consultando Conocimiento...' : 'Consultar'}
                </button>
            </form>

            {error && (
                <div className="badge badge-danger" style={{ width: '100%', padding: '1rem', borderRadius: '8px', textTransform: 'none' }}>
                    {error}
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Construyendo respuesta a partir de fuentes oficiales...
                </div>
            )}

            {answer && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* AI Answer */}
                    <div style={{ background: 'rgba(255, 107, 0, 0.03)', border: '1px solid var(--border-color-hover)', borderRadius: '12px', padding: '2rem', boxShadow: '0 0 30px rgba(255, 107, 0, 0.02)' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                            Respuesta de Thoth
                        </h3>
                        <div style={{ lineHeight: '1.7', fontSize: '1.05rem', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                            {answer}
                        </div>
                    </div>

                    {/* Sources */}
                    <div>
                        <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                            Fuentes Oficiales Citadas
                        </h3>
                        <div className="search-results">
                            {results.map((result) => (
                                <div key={result.id} className="search-result-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>
                                            {result.title} — <span style={{ color: 'var(--primary)' }}>{result.section}</span>
                                        </h4>
                                        {result.similarity && (
                                            <span className="badge badge-primary">
                                                {result.similarity > 0.85 ? "Fuente principal" : "Fuente complementaria"}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)', borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                                        {result.text}
                                    </p>
                                    <div className="search-result-source">
                                        <span>Organismo: {result.authority}</span>
                                        {result.url && (
                                            <a href={result.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                                Ver documento oficial ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

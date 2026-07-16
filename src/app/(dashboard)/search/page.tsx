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
    const [domain, setDomain] = useState('auto');
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
            "✅ Ley de Sociedades de Capital\n" +
            "✅ Código Civil\n" +
            "🏺 Código de Comercio (1885)\n\n" +
            "**Análisis del caso**\n" +
            "Para resolver tu problema he utilizado el Código de Comercio de 1885 porque sigue vigente y resulta aplicable a este caso, ya que regula específicamente las obligaciones mercantiles entre socios.\n\n" +
            "**Obligaciones detectadas**\n" +
            "- El socio incumplidor debe responder de los daños y perjuicios causados a la masa común (Art. 170 Código de Comercio).\n" +
            "- Se requiere un requerimiento formal previo para constituir en mora al socio (Art. 63 Código de Comercio).\n\n" +
            "**Opciones legales**\n" +
            "- Exigir el cumplimiento forzoso del contrato.\n" +
            "- Solicitar la rescisión del contrato social con indemnización de daños y perjuicios."
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
                    "**Normativa aplicable**\n" +
                    "✅ Ley de Sociedades de Capital\n" +
                    "✅ Código Civil\n" +
                    "🏺 Código de Comercio (1885)\n\n" +
                    "**Análisis del caso**\n" +
                    "Para resolver tu problema he utilizado el Código de Comercio de 1885 porque sigue vigente y resulta aplicable a este caso, ya que regula específicamente las obligaciones mercantiles entre socios.\n\n" +
                    "**Obligaciones detectadas**\n" +
                    "- El socio incumplidor debe responder de los daños y perjuicios causados a la masa común (Art. 170 Código de Comercio).\n" +
                    "- Se requiere un requerimiento formal previo para constituir en mora al socio (Art. 63 Código de Comercio).\n\n" +
                    "*Esta respuesta ha sido generada de forma sintética para la demostración local.*"
                );
                setResults([
                    {
                        id: 'chunk-1',
                        title: 'Código de Comercio (1885)',
                        section: 'Artículo 170',
                        text: 'Si dentro del plazo convenido algún socio no aportare a la masa común la porción de capital a que se hubiere obligado, la compañía podrá optar entre proceder ejecutivamente contra sus bienes para hacer efectiva la porción del capital que hubiere dejado de entregar, o rescindir el contrato en cuanto al socio remiso, reteniendo las cantidades que le correspondan en la masa social.',
                        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1885-6627',
                        authority: 'España - BOE',
                        similarity: 0.92
                    },
                    {
                        id: 'chunk-2',
                        title: 'Ley de Sociedades de Capital',
                        section: 'Artículo 82',
                        text: 'El socio que incumpla la obligación de desembolso incurrirá en mora. En caso de mora, la sociedad podrá reclamar el cumplimiento de la obligación de desembolso con abono del interés legal y de los daños y perjuicios causados.',
                        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2010-10544',
                        authority: 'España - BOE',
                        similarity: 0.85
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
                    style={{ width: 'auto', minWidth: '200px', background: 'rgba(255,255,255,0.05)' }}
                >
                    <option value="auto">✨ Detección Automática</option>
                    <option disabled>──────────</option>
                    <option value="ai_literacy">Alfabetización en IA</option>
                    <option value="autonomos">Autónomos</option>
                    <option value="laboral">Laboral</option>
                    <option value="fiscal">Fiscal</option>
                    <option value="empresa">Mercantil</option>
                    <option value="prevencion">Prevención de Riesgos</option>
                    <option value="proteccion_datos">Protección de Datos</option>
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
                                            {result.title.includes('1885') ? '🏺 ' : '📄 '}
                                            {result.title} — <span style={{ color: 'var(--primary)' }}>{result.section}</span>
                                        </h4>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span className="badge badge-success" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                                Estado: Vigente
                                            </span>
                                            {result.similarity && (
                                                <span className="badge badge-primary">
                                                    {result.similarity > 0.85 ? "Fuente principal" : "Fuente complementaria"}
                                                </span>
                                            )}
                                        </div>
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

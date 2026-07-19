'use client';

import { useState } from 'react';

export default function NormativaPage() {
    const [selectedNorma, setSelectedNorma] = useState<string | null>('ai-act');
    const [showModal, setShowModal] = useState(false);
    const [newNormaName, setNewNormaName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [normas, setNormas] = useState([
        // 1. Normativa vinculante
        { id: 'ai-act', nombre: 'Reglamento (UE) 2024/1689 (AI Act)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'carta-derechos', nombre: 'Carta de los Derechos Fundamentales UE', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'tfue', nombre: 'Tratado de Funcionamiento UE (TFUE)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'rgpd', nombre: 'Reglamento (UE) 2016/679 (RGPD)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'eprivacy', nombre: 'Directiva 2002/58/CE (ePrivacy)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'data-act', nombre: 'Reglamento (UE) 2023/2854 (Data Act)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'dga', nombre: 'Reglamento (UE) 2022/868 (Data Governance Act)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'dsa', nombre: 'Reglamento (UE) 2022/2065 (DSA)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'dma', nombre: 'Reglamento (UE) 2022/1925 (DMA)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'nis2', nombre: 'Directiva (UE) 2022/2555 (NIS2)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'ens', nombre: 'Real Decreto 311/2022 (ENS)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'eidas2', nombre: 'Reglamento (UE) 2024/1183 (eIDAS 2)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'product-liability', nombre: 'Directiva (UE) 2024/2853 (Responsabilidad Productos)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'lopdgdd', nombre: 'Ley Orgánica 3/2018 (LOPDGDD)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'estatuto-trabajadores', nombre: 'RD Legislativo 2/2015 (Estatuto Trabajadores Art. 64)', nivel: '1. Normativa vinculante', estado: 'Vigente' },
        { id: 'estatuto-aesia', nombre: 'Real Decreto 729/2023 (Estatuto AESIA)', nivel: '1. Normativa vinculante', estado: 'Vigente' },

        // 2. Directrices oficiales no vinculantes
        { id: 'faq-art4', nombre: 'FAQ Oficiales del Artículo 4 (Comisión Europea)', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },
        { id: 'guidelines-ai', nombre: 'Directrices sobre definición de sistema de IA', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },
        { id: 'ai-pact', nombre: 'Pacto Europeo de Inteligencia Artificial (AI Pact)', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },
        { id: 'aesia-recursos', nombre: 'Recursos y Guías AESIA (Art. 4, Transparencia)', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },
        { id: 'aepd-guias', nombre: 'Guías AEPD (Evaluación Impacto, Biometría)', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },
        { id: 'incibe-guias', nombre: 'Guías de Ciberseguridad INCIBE / CCN-CERT', nivel: '2. Directrices oficiales no vinculantes', estado: 'Vigente' },

        // 3. Normas técnicas voluntarias
        { id: 'iso-42001', nombre: 'ISO/IEC 42001:2023 (Gestión de IA)', nivel: '3. Normas técnicas voluntarias', estado: 'Vigente' },
        { id: 'iso-23894', nombre: 'ISO/IEC 23894:2023 (Riesgos de IA)', nivel: '3. Normas técnicas voluntarias', estado: 'Vigente' },
        { id: 'iso-27001', nombre: 'ISO/IEC 27001:2022 (Seguridad)', nivel: '3. Normas técnicas voluntarias', estado: 'Vigente' },
        { id: 'iso-27701', nombre: 'ISO/IEC 27701:2025 (Privacidad)', nivel: '3. Normas técnicas voluntarias', estado: 'Vigente' },

        // 4. Marcos voluntarios internacionales
        { id: 'nist-ai', nombre: 'NIST AI Risk Management Framework 1.0', nivel: '4. Marcos voluntarios internacionales', estado: 'Vigente' },
        { id: 'ocde-ai', nombre: 'Principios de Inteligencia Artificial de la OCDE', nivel: '4. Marcos voluntarios internacionales', estado: 'Vigente' },
        { id: 'unesco-ai', nombre: 'Recomendación sobre la Ética de la IA (UNESCO)', nivel: '4. Marcos voluntarios internacionales', estado: 'Vigente' },
        { id: 'digcomp', nombre: 'Marco Europeo de Competencias Digitales (DigComp 3.0)', nivel: '4. Marcos voluntarios internacionales', estado: 'Vigente' },

        // 5. Histórico o seguimiento
        { id: 'ai-liability', nombre: 'AI Liability Directive (Propuesta Retirada)', nivel: '5. Histórico o seguimiento', estado: 'Borrador' },
    ]);

    const niveles = [
        '1. Normativa vinculante',
        '2. Directrices oficiales no vinculantes',
        '3. Normas técnicas voluntarias',
        '4. Marcos voluntarios internacionales',
        '5. Histórico o seguimiento'
    ];

    const handleAddNorma = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNormaName.trim() || !selectedFile) {
            alert("Por favor, introduce un nombre y selecciona un archivo.");
            return;
        }

        setIsUploading(true);

        try {
            const text = await selectedFile.text();

            const res = await fetch('/api/documents/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newNormaName,
                    text: text,
                    document_type: 'law'
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al procesar el documento');
            }

            const newNorma = {
                id: `norma-${Date.now()}`,
                nombre: newNormaName,
                nivel: '1. Normativa vinculante',
                estado: 'Vigente'
            };

            setNormas([newNorma, ...normas]);
            setShowModal(false);
            setNewNormaName('');
            setSelectedFile(null);
            setSelectedNorma(newNorma.id);
            alert("Documento procesado e indexado en el RAG correctamente.");
        } catch (error: any) {
            console.error(error);
            alert("Error: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Ecosistema Jurídico RAG 📚
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        El cerebro legal de Thoth. 5 niveles de profundidad normativa que garantizan el cumplimiento absoluto del Artículo 4 ante cualquier inspección.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Añadir Documento</button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
                {/* Left Panel: List of Norms grouped by Level */}
                <div className="card" style={{ flex: '0.4', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar en el ecosistema..."
                        className="form-input"
                        style={{ marginBottom: '1.5rem', width: '100%' }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                        {niveles.map(nivel => (
                            <div key={nivel}>
                                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--primary)', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    {nivel}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {normas.filter(n => n.nivel === nivel).map(norma => (
                                        <div
                                            key={norma.id}
                                            onClick={() => setSelectedNorma(norma.id)}
                                            style={{
                                                padding: '0.85rem 1rem',
                                                borderRadius: '8px',
                                                background: selectedNorma === norma.id ? 'rgba(201, 162, 39, 0.1)' : 'rgba(0,0,0,0.2)',
                                                border: selectedNorma === norma.id ? '1px solid var(--primary)' : '1px solid transparent',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <h4 style={{ margin: 0, color: selectedNorma === norma.id ? '#fff' : 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: selectedNorma === norma.id ? 600 : 400 }}>
                                                {norma.nombre}
                                            </h4>
                                            <span className={`badge ${norma.estado === 'Vigente' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                                                {norma.estado}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Norm Details & Mapping */}
                <div className="card" style={{ flex: '0.65', padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {selectedNorma === 'ai-act' ? (
                        <>
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>Ley de Inteligencia Artificial (AI Act)</h2>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Reglamento del Parlamento Europeo y del Consejo</p>
                                </div>
                                <button className="btn btn-secondary">Sincronizar Cambios</button>
                            </div>

                            {/* Artículo Específico */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--primary)' }}>Artículo 4</h3>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>Prácticas de IA prohibidas</span>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--error)', marginBottom: '1.5rem' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Texto Legal</h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        Se prohíbe la introducción en el mercado, la puesta en servicio o la utilización de un sistema de IA que se sirva de técnicas subliminales que trasciendan la conciencia de una persona para alterar de manera sustancial su comportamiento...
                                    </p>
                                </div>

                                <div style={{ background: 'rgba(30, 78, 140, 0.1)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                                    <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Explicación THOTH (Para Trabajadores)</h4>
                                    <p style={{ fontSize: '0.95rem', lineHeight: '1.6', margin: 0, color: 'var(--text-primary)' }}>
                                        No puedes usar IA para manipular a clientes o empleados sin que se den cuenta. Por ejemplo, no puedes usar un sistema que analice el tono de voz de un cliente en tiempo real para presionarle psicológicamente a comprar.
                                    </p>
                                </div>
                            </div>

                            {/* Mapeo de Misiones y Competencias */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>🎯</span> Misiones Relacionadas (12)
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                            Campaña de Marketing Persuasiva
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.9rem' }}>
                                            Análisis de Sentimiento en Llamadas
                                        </div>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>Ver todas las misiones</button>
                                    </div>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>🧠</span> Competencias Afectadas (2)
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--success)' }}>
                                            Uso Ético de IA
                                        </div>
                                        <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--success)' }}>
                                            Transparencia Algorítmica
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                            <h3>{normas.find(n => n.id === selectedNorma)?.nombre}</h3>
                            <p>Esta normativa está en proceso de indexación por la IA.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Añadir Normativa */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Añadir Nueva Normativa</h2>
                        <form onSubmit={handleAddNorma}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nombre de la Ley / Guía</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    placeholder="Ej: Directiva de Copyright..."
                                    value={newNormaName}
                                    onChange={(e) => setNewNormaName(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Subir Documento (TXT/MD)</label>
                                <input
                                    type="file"
                                    accept=".txt,.md"
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    disabled={isUploading}
                                />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    El sistema procesará el documento automáticamente, lo troceará y lo vectorizará en el RAG.
                                </p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isUploading}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                                    {isUploading ? 'Indexando en RAG...' : 'Indexar Normativa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

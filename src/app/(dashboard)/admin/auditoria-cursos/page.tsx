'use client';

import { useState } from 'react';

export default function AuditoriaCursosPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResult(null);
            setUploadSuccess(false);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setResult(null);
        setUploadSuccess(false);

        try {
            const text = await file.text();

            const response = await fetch('/api/validate-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseContent: text })
            });

            if (!response.ok) {
                throw new Error('Error en la validación');
            }

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Hubo un error al analizar el archivo.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleUploadToSupabase = async () => {
        if (!result || !result.cumple_regla_de_oro) {
            alert('Solo puedes subir cursos que cumplan la Regla de Oro.');
            return;
        }

        setIsUploading(true);
        // Aquí iría la lógica real para subir a Supabase
        // Simulamos una subida exitosa:
        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
        }, 1500);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                Auditoría Legal de Cursos (Regla de Oro) ⚖️
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Sube un archivo de texto (.txt, .md, .html) con el contenido de tu curso. La IA actuará como auditor legal para verificar que el contenido es 100% fiel a la normativa vigente antes de permitir su subida a la base de datos.
            </p>

            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <input
                    type="file"
                    accept=".txt,.md,.html"
                    onChange={handleFileChange}
                    style={{ marginBottom: '1rem', display: 'block' }}
                />

                <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={!file || isAnalyzing}
                    style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                >
                    {isAnalyzing ? 'Analizando con IA...' : 'Auditar Curso'}
                </button>
            </div>

            {result && (
                <div className="card" style={{ padding: '2rem', border: result.cumple_regla_de_oro ? '2px solid var(--success)' : '2px solid var(--danger)' }}>
                    <h2 style={{ color: result.cumple_regla_de_oro ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }}>
                        {result.cumple_regla_de_oro ? '✅ Cumple la Regla de Oro' : '❌ NO Cumple la Regla de Oro'}
                    </h2>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', flex: 1 }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Puntuación de Fidelidad</h3>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: result.puntuacion_fidelidad >= 8 ? 'var(--success)' : 'var(--warning)' }}>
                                {result.puntuacion_fidelidad} / 10
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Conclusión del Auditor</h3>
                        <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>{result.conclusion}</p>
                    </div>

                    {result.infracciones_detectadas && result.infracciones_detectadas.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Infracciones o Inexactitudes Detectadas</h3>
                            {result.infracciones_detectadas.map((inf: any, idx: number) => (
                                <div key={idx} style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger)', padding: '1rem', marginBottom: '1rem', borderRadius: '0 8px 8px 0' }}>
                                    <p style={{ margin: '0 0 0.5rem 0' }}><strong>Texto problemático:</strong> "{inf.texto_problematico}"</p>
                                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--danger)' }}><strong>Motivo:</strong> {inf.motivo}</p>
                                    <p style={{ margin: 0, color: 'var(--success)' }}><strong>Sugerencia:</strong> {inf.sugerencia_correccion}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                        {uploadSuccess && <span style={{ color: 'var(--success)' }}>¡Curso subido a Supabase correctamente!</span>}

                        <button
                            className="btn btn-success"
                            onClick={handleUploadToSupabase}
                            disabled={!result.cumple_regla_de_oro || isUploading || uploadSuccess}
                            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', opacity: !result.cumple_regla_de_oro ? 0.5 : 1 }}
                        >
                            {isUploading ? 'Subiendo...' : 'Subir a Supabase'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

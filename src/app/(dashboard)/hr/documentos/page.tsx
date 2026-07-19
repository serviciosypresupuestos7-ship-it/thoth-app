'use client';

import { useState } from 'react';

export default function DocumentosPage() {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!title || !text) {
            setMessage('Por favor, introduce un título y el texto del documento.');
            return;
        }

        setLoading(true);
        setMessage('Procesando documento (limpieza, chunking y embeddings)...');

        try {
            const res = await fetch('/api/documents/ingest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, document_type: 'internal_policy' })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`¡Éxito! Documento procesado en ${data.processed_chunks} fragmentos.`);
                setTitle('');
                setText('');
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error: any) {
            setMessage(`Error de conexión: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Gestor de Conocimiento Interno 📚
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Sube las políticas, manuales y normativas internas de tu empresa. THOTH las procesará, las dividirá en fragmentos y las vectorizará para que la IA pueda basarse en ellas al generar misiones y tests.
                </p>
            </div>

            <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Título del Documento
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Política de Uso de Inteligencia Artificial v2.0"
                        className="form-input"
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Contenido del Documento (Texto)
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Pega aquí el texto de la política o manual..."
                        className="form-input"
                        style={{ width: '100%', height: '300px', resize: 'vertical', fontFamily: 'monospace' }}
                    />
                </div>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        background: message.includes('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 163, 127, 0.1)',
                        color: message.includes('Error') ? '#ef4444' : '#10a37f',
                        border: `1px solid ${message.includes('Error') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 163, 127, 0.2)'}`
                    }}>
                        {message}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? 'Procesando y Vectorizando...' : 'Procesar Documento'}
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
    const [openaiKey, setOpenaiKey] = useState('');
    const [anthropicKey, setAnthropicKey] = useState('');
    const [preferredModel, setPreferredModel] = useState('gpt-4o-mini');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('tenant_settings')
                .select('*')
                .eq('tenant_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                throw error;
            }

            if (data) {
                setOpenaiKey(data.openai_api_key || '');
                setAnthropicKey(data.anthropic_api_key || '');
                setPreferredModel(data.preferred_model || 'gpt-4o-mini');
            }
        } catch (err: any) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            // Check if settings exist
            const { data: existing } = await supabase
                .from('tenant_settings')
                .select('tenant_id')
                .eq('tenant_id', user.id)
                .single();

            const settingsData = {
                tenant_id: user.id,
                openai_api_key: openaiKey,
                anthropic_api_key: anthropicKey,
                preferred_model: preferredModel,
                updated_at: new Date().toISOString()
            };

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('tenant_settings')
                    .update(settingsData)
                    .eq('tenant_id', user.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('tenant_settings')
                    .insert([settingsData]);
                error = insertError;
            }

            if (error) throw error;

            setMessage({ text: 'Configuración guardada correctamente.', type: 'success' });
        } catch (err: any) {
            console.error('Error saving settings:', err);
            setMessage({ text: `Error al guardar: ${err.message}`, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                Cargando configuración...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Configuración de IA</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Configura tus propias claves de API y selecciona el modelo de inteligencia artificial que prefieres utilizar para el análisis jurídico.
                </p>
            </div>

            {message && (
                <div className={`badge ${message.type === 'success' ? 'badge-success' : 'badge-danger'}`} style={{ width: '100%', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textTransform: 'none', fontSize: '1rem' }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Modelos y Claves</h2>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Modelo Preferido</label>
                    <select
                        value={preferredModel}
                        onChange={(e) => setPreferredModel(e.target.value)}
                        className="form-select"
                        style={{ width: '100%' }}
                    >
                        <optgroup label="OpenAI">
                            <option value="gpt-4o-mini">GPT-4o Mini (Recomendado, rápido y económico)</option>
                            <option value="gpt-4o">GPT-4o (Máxima precisión jurídica)</option>
                        </optgroup>
                        <optgroup label="Anthropic">
                            <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Excelente razonamiento)</option>
                            <option value="claude-3-haiku-20240307">Claude 3 Haiku (Rápido)</option>
                        </optgroup>
                    </select>
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        Este modelo se utilizará para la generación de respuestas en las consultas y para la extracción de conocimiento.
                    </small>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">OpenAI API Key</label>
                    <input
                        type="password"
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        placeholder="sk-..."
                        className="form-input"
                        style={{ width: '100%' }}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        Requerida si seleccionas un modelo de OpenAI. También se usa para generar los embeddings vectoriales.
                    </small>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="form-label">Anthropic API Key</label>
                    <input
                        type="password"
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                        placeholder="sk-ant-..."
                        className="form-input"
                        style={{ width: '100%' }}
                    />
                    <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        Requerida si seleccionas un modelo de Anthropic (Claude).
                    </small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
                        {saving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}

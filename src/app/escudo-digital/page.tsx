'use client';

import { useState } from 'react';
import { EscudoDigitalDownloadButton } from '@/components/EscudoDigitalDownloadButton';

export default function EscudoDigitalPage() {
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [listaBlanca, setListaBlanca] = useState('ChatGPT (versión Enterprise), Microsoft Copilot (con protección de datos corporativos)');
    const [listaProhibida, setListaProhibida] = useState('Datos personales de clientes, código fuente propietario, información financiera no pública');
    const [step, setStep] = useState(1);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'var(--font-sans)', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                        Escudo Digital
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                        Generador del Dossier Integral de Cumplimiento IA. Producto premium de documentación legal para empresas.
                    </p>
                </div>

                {step === 1 && (
                    <div className="card" style={{ backgroundColor: '#1e293b', padding: '3rem', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#ffffff' }}>Configuración del Dossier</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 500 }}>Nombre de la Empresa Auditada</label>
                            <input
                                type="text"
                                value={nombreEmpresa}
                                onChange={(e) => setNombreEmpresa(e.target.value)}
                                placeholder="Ej: Acme Corp S.L."
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#ffffff', fontSize: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 500 }}>Lista Blanca (Herramientas Autorizadas)</label>
                            <textarea
                                value={listaBlanca}
                                onChange={(e) => setListaBlanca(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontWeight: 500 }}>Lista Prohibida (Datos Restringidos)</label>
                            <textarea
                                value={listaProhibida}
                                onChange={(e) => setListaProhibida(e.target.value)}
                                rows={3}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', color: '#ffffff', fontSize: '1rem', resize: 'vertical' }}
                            />
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            disabled={!nombreEmpresa}
                            style={{ width: '100%', padding: '1.2rem', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 600, cursor: nombreEmpresa ? 'pointer' : 'not-allowed', opacity: nombreEmpresa ? 1 : 0.5, transition: 'all 0.2s' }}
                        >
                            Continuar a Emisión →
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="card" style={{ backgroundColor: '#1e293b', padding: '4rem 3rem', borderRadius: '16px', border: '1px solid #334155', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📄</div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ffffff' }}>Dossier Listo para Emisión</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            El Escudo Digital para <strong style={{ color: '#10b981' }}>{nombreEmpresa}</strong> ha sido configurado.
                            Este documento incluye el marco jurídico, políticas de uso, anexos contractuales y cuestionarios de evaluación.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setStep(1)}
                                style={{ padding: '1rem 2rem', backgroundColor: 'transparent', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
                            >
                                ← Modificar Datos
                            </button>

                            <EscudoDigitalDownloadButton
                                nombreEmpresa={nombreEmpresa}
                                listaBlanca={listaBlanca}
                                listaProhibida={listaProhibida}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

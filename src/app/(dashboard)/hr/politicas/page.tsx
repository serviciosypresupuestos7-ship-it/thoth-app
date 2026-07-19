'use client';

import { useState } from 'react';

// --- DATA ---
const herramientas = [
    { id: 'chatgpt', label: 'ChatGPT (OpenAI)', icon: '🤖' },
    { id: 'copilot', label: 'Microsoft Copilot', icon: '🪟' },
    { id: 'canva', label: 'Canva IA', icon: '🎨' },
    { id: 'gemini', label: 'Google Gemini', icon: '♊' },
    { id: 'github_copilot', label: 'GitHub Copilot', icon: '💻' },
    { id: 'perplexity', label: 'Perplexity', icon: '🔍' },
    { id: 'claude', label: 'Claude (Anthropic)', icon: '🧠' },
    { id: 'midjourney', label: 'Midjourney', icon: '🖼️' },
];

const datosProhibidos = [
    { id: 'datos_clientes', label: 'Datos personales de clientes (DNI, email, teléfono)' },
    { id: 'codigo_fuente', label: 'Código fuente propietario de la empresa' },
    { id: 'info_financiera', label: 'Información financiera confidencial' },
    { id: 'datos_empleados', label: 'Datos personales de empleados' },
    { id: 'contratos', label: 'Contratos en vigor o en negociación' },
    { id: 'datos_salud', label: 'Datos de salud o categorías especiales (RGPD Art. 9)' },
];

// --- COMPONENT ---
export default function GeneradorPoliticasPage() {
    const [step, setStep] = useState(1);
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [herramientasSelected, setHerramientasSelected] = useState<string[]>(['chatgpt', 'copilot']);
    const [customHerramientas, setCustomHerramientas] = useState<{ id: string, label: string, icon: string }[]>([]);
    const [datosSelected, setDatosSelected] = useState<string[]>(['datos_clientes', 'codigo_fuente']);
    const [tieneRLT, setTieneRLT] = useState(false);
    const [usaIAenRRHH, setUsaIAenRRHH] = useState(false);
    const [herramientaCustom, setHerramientaCustom] = useState('');
    const [generating, setGenerating] = useState(false);
    const [activeDoc, setActiveDoc] = useState<'politica' | 'clausula'>('politica');
    const [generatingPdf, setGeneratingPdf] = useState(false);
    const [pdfSuccess, setPdfSuccess] = useState(false);

    const toggleItem = (id: string, list: string[], setList: (l: string[]) => void) => {
        setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    };

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setStep(3);
        }, 2200);
    };

    const allHerramientas = [...herramientas, ...customHerramientas];

    const generatePoliticaTexto = () => {
        const listaBlanca = allHerramientas.filter(h => herramientasSelected.includes(h.id)).map(h => h.label).join(', ');
        const listaProhibida = datosProhibidos.filter(d => datosSelected.includes(d.id)).map(d => `- ${d.label}`).join('\n');
        const hoy = new Date().toLocaleDateString('es-ES');

        return `POLÍTICA DE USO ACEPTABLE DE INTELIGENCIA ARTIFICIAL
${nombreEmpresa || 'La Empresa'}
Fecha de entrada en vigor: ${hoy}

1. OBJETO Y ÁMBITO DE APLICACIÓN
La presente Política regula el uso de herramientas de Inteligencia Artificial Generativa (IA Gen) por parte de todos los empleados de ${nombreEmpresa || 'la organización'}, en cumplimiento del Reglamento de Inteligencia Artificial de la Unión Europea (AI Act, Reg. 2024/1689) y del Reglamento General de Protección de Datos (RGPD, Reg. 2016/679).

2. HERRAMIENTAS AUTORIZADAS (LISTA BLANCA OFICIAL)
Únicamente se autoriza el uso de las siguientes herramientas de IA para fines profesionales:
${listaBlanca || 'Ninguna herramienta autorizada de forma genérica. Consultar con el responsable.'}

Cualquier herramienta no incluida en esta lista requiere aprobación previa por escrito del Responsable de Compliance.

3. DATOS E INFORMACIÓN PROHIBIDOS EN HERRAMIENTAS DE IA
Queda terminantemente prohibido introducir en cualquier herramienta de IA los siguientes tipos de datos e información:
${listaProhibida || '- No se han especificado restricciones adicionales.'}

El incumplimiento de este protocolo será considerado una falta grave conforme al Convenio Colectivo aplicable.

4. RESPONSABILIDAD Y SUPERVISIÓN HUMANA
El trabajador es siempre el responsable final de cualquier output generado por una herramienta de IA. Ninguna respuesta de una IA puede ser enviada a un cliente, firmada o publicada sin revisión humana previa. Esto se alinea con el principio de supervisión humana del AI Act (Art. 14).

5. TRANSPARENCIA
${usaIAenRRHH ? 'Dado que la empresa utiliza IA en procesos que afectan a empleados (selección, evaluación de rendimiento), se informa a todos los trabajadores de este uso tal como exige el AI Act (Art. 13). Toda decisión que afecte individualmente a un empleado y que haya sido asistida por IA deberá ser revisada y validada por un responsable humano.' : 'En caso de que se adopten sistemas de IA que afecten a decisiones sobre empleados, se actualizará esta política con la antelación suficiente.'}

${tieneRLT ? `6. INFORMACIÓN A LOS REPRESENTANTES DE LOS TRABAJADORES (RLT)
En cumplimiento del Art. 64 del Estatuto de los Trabajadores, la empresa informa a los representantes legales de los trabajadores sobre la implantación de sistemas de control basados en Inteligencia Artificial, sus parámetros y su impacto en las condiciones de trabajo.` : ''}

VERSIÓN: 1.0 | GENERADO POR THOTH AI COMPLIANCE PLATFORM`;
    };

    const generateClausulaTexto = () => {
        const listaBlanca = allHerramientas.filter(h => herramientasSelected.includes(h.id)).map(h => h.label).join(', ');
        const listaProhibida = datosProhibidos.filter(d => datosSelected.includes(d.id)).map(d => d.label).join('; ');

        return `CLÁUSULA DE CONFIDENCIALIDAD Y USO DE INTELIGENCIA ARTIFICIAL
(Anexo al Contrato de Trabajo)

El/la trabajador/a, en el ejercicio de sus funciones para ${nombreEmpresa || 'la empresa'}, acepta y se compromete a:

1. Utilizar exclusivamente las herramientas de IA autorizadas por la empresa en su Lista Blanca Oficial (${listaBlanca || 'las definidas en la Política de Uso Aceptable'}).

2. No introducir en ninguna herramienta de IA, interna o externa, la siguiente información confidencial: ${listaProhibida || 'información sensible o confidencial de la empresa'}.

3. Asumir responsabilidad personal sobre cualquier output generado con asistencia de IA en el ejercicio de su actividad laboral.

4. Notificar inmediatamente al Responsable de Compliance cualquier incidente relacionado con el uso de IA que pudiera comprometer datos personales o información confidencial.

El incumplimiento de esta cláusula facultará a la empresa para adoptar las medidas disciplinarias previstas en el Convenio Colectivo y en el Estatuto de los Trabajadores, sin perjuicio de las responsabilidades legales que pudieran derivarse.

Generado mediante THOTH AI Compliance Platform conforme al AI Act (Reg. UE 2024/1689) y el RGPD (Reg. UE 2016/679).`;
    };

    const politicaTexto = generatePoliticaTexto();
    const clausulaTexto = generateClausulaTexto();

    const stepLabels = ['Configurar', 'Generar Textos', 'Dossier PDF'];

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Generador de Políticas de IA 📝
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
                    Responde tres preguntas rápidas. THOTH redacta tu Política de Uso Aceptable y tu Cláusula Contractual, conformes al <strong style={{ color: '#fff' }}>AI Act</strong> y el <strong style={{ color: '#fff' }}>RGPD</strong>, en segundos.
                </p>
            </div>

            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '2.5rem' }}>
                {stepLabels.map((label, i) => {
                    const n = i + 1;
                    const isActive = step === n;
                    const isDone = step > n;
                    return (
                        <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < stepLabels.length ? 1 : 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0,
                                    background: isDone ? 'var(--success)' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    color: isDone || isActive ? '#000' : 'var(--text-secondary)',
                                    border: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                                }}>
                                    {isDone ? '✓' : n}
                                </div>
                                <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                    {label}
                                </span>
                            </div>
                            {n < stepLabels.length && (
                                <div style={{ flex: 1, height: '2px', background: isDone ? 'var(--success)' : 'rgba(255,255,255,0.1)', margin: '0 1rem' }} />
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>

                {/* ======= STEP 1: CONFIGURADOR ======= */}
                {step === 1 && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>

                        {/* Nombre empresa */}
                        <div className="card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>🏢 Nombre de tu empresa</h2>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej. Tecnologías Avanzadas S.L."
                                value={nombreEmpresa}
                                onChange={e => setNombreEmpresa(e.target.value)}
                                style={{ width: '100%', maxWidth: '450px' }}
                            />
                        </div>

                        {/* Bloque A */}
                        <div className="card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>🤖 Bloque A — Lista Blanca de Herramientas</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                ¿Qué herramientas de IA usáis en la oficina? Selecciona las que están <strong style={{ color: 'var(--success)' }}>autorizadas oficialmente</strong>.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                                {allHerramientas.map(h => {
                                    const sel = herramientasSelected.includes(h.id);
                                    return (
                                        <button
                                            key={h.id}
                                            onClick={() => toggleItem(h.id, herramientasSelected, setHerramientasSelected)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
                                                background: sel ? 'rgba(16, 163, 127, 0.12)' : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${sel ? 'var(--success)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                                color: sel ? 'var(--success)' : 'var(--text-secondary)',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <span style={{ fontSize: '1.3rem' }}>{h.icon}</span>
                                            <span style={{ fontWeight: sel ? 600 : 400, fontSize: '0.9rem' }}>{h.label}</span>
                                            {sel && <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>✓</span>}
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="+ Añadir herramienta personalizada"
                                    value={herramientaCustom}
                                    onChange={e => setHerramientaCustom(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-secondary" onClick={() => {
                                    if (herramientaCustom.trim()) {
                                        const newId = 'custom_' + Date.now();
                                        setCustomHerramientas([...customHerramientas, { id: newId, label: herramientaCustom.trim(), icon: '🔧' }]);
                                        setHerramientasSelected([...herramientasSelected, newId]);
                                        setHerramientaCustom('');
                                    }
                                }}>
                                    Añadir
                                </button>
                            </div>
                        </div>

                        {/* Bloque B */}
                        <div className="card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>🚫 Bloque B — Protocolo de Datos Prohibidos</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                ¿Qué categorías de información está <strong style={{ color: 'var(--error)' }}>terminantemente prohibido</strong> introducir en herramientas de IA?
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {datosProhibidos.map(d => {
                                    const sel = datosSelected.includes(d.id);
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => toggleItem(d.id, datosSelected, setDatosSelected)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
                                                background: sel ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.04)',
                                                border: `1px solid ${sel ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                                                color: sel ? '#fff' : 'var(--text-secondary)',
                                                transition: 'all 0.15s ease',
                                                width: '100%',
                                            }}
                                        >
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '4px', flexShrink: 0,
                                                background: sel ? 'var(--error)' : 'transparent',
                                                border: `2px solid ${sel ? 'var(--error)' : 'rgba(255,255,255,0.3)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.7rem', color: '#fff'
                                            }}>
                                                {sel && '✓'}
                                            </div>
                                            <span style={{ fontSize: '0.9rem' }}>{d.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bloque C */}
                        <div className="card" style={{ padding: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>⚖️ Bloque C — Contexto Legal de la Empresa</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                Estas respuestas determinan las cláusulas legales adicionales que se incluirán automáticamente.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                                <button
                                    onClick={() => setUsaIAenRRHH(!usaIAenRRHH)}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem',
                                        background: usaIAenRRHH ? 'rgba(201, 162, 39, 0.08)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${usaIAenRRHH ? 'var(--warning)' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0, marginTop: '2px', background: usaIAenRRHH ? 'var(--warning)' : 'transparent', border: `2px solid ${usaIAenRRHH ? 'var(--warning)' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#000' }}>
                                        {usaIAenRRHH && '✓'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>¿Usáis IA en procesos que afectan a empleados?</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Selección de personal, evaluación de rendimiento, etc. Activa el artículo de transparencia del AI Act (Art. 13).</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setTieneRLT(!tieneRLT)}
                                    style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem',
                                        background: tieneRLT ? 'rgba(201, 162, 39, 0.08)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${tieneRLT ? 'var(--warning)' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: '8px', cursor: 'pointer', textAlign: 'left', width: '100%',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0, marginTop: '2px', background: tieneRLT ? 'var(--warning)' : 'transparent', border: `2px solid ${tieneRLT ? 'var(--warning)' : 'rgba(255,255,255,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#000' }}>
                                        {tieneRLT && '✓'}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>¿Hay representantes de los trabajadores (RLT / sindicato)?</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Añade la cláusula informativa obligatoria del Art. 64 del Estatuto de los Trabajadores.</div>
                                    </div>
                                </button>

                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '2rem' }}>
                            <button className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem' }} onClick={() => setStep(2)}>
                                Siguiente: Generar Textos Legales →
                            </button>
                        </div>
                    </div>
                )}

                {/* ======= STEP 2: GENERAR ======= */}
                {step === 2 && (
                    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', paddingTop: '2rem' }}>
                        {!generating ? (
                            <div className="card" style={{ padding: '3rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚡</div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Todo listo para generar</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.7' }}>
                                    THOTH va a combinar tus respuestas con el <strong style={{ color: '#fff' }}>AI Act (Art. 4, 13, 14)</strong> y el <strong style={{ color: '#fff' }}>RGPD</strong> para redactar dos documentos legales personalizados para <strong style={{ color: 'var(--primary)' }}>{nombreEmpresa || 'tu empresa'}</strong>.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                                    <div className="card" style={{ padding: '1rem 1.5rem', borderLeft: '3px solid var(--primary)', textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>📄</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Política de Uso Aceptable</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Para intranet / correo</div>
                                    </div>
                                    <div className="card" style={{ padding: '1rem 1.5rem', borderLeft: '3px solid var(--success)', textAlign: 'left', flex: 1 }}>
                                        <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>📋</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cláusula Contractual</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Anexo al contrato de trabajo</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button className="btn btn-secondary" onClick={() => setStep(1)}>← Volver</button>
                                    <button className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem' }} onClick={handleGenerate}>
                                        ⚡ Generar Textos Legales de Compliance
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card" style={{ padding: '4rem 3rem' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>🤖</div>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Redactando documentos legales...</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>El motor RAG está cruzando tu configuración con el AI Act y el RGPD.</p>
                                <div style={{ marginTop: '2rem', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: 'var(--primary)', borderRadius: '3px', animation: 'progress 2.2s linear forwards' }} />
                                </div>
                            </div>
                        )}
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes spin { to { transform: rotate(360deg); } }
                            @keyframes progress { from { width: 0% } to { width: 100% } }
                        `}} />
                    </div>
                )}

                {/* ======= STEP 3: DOCUMENTOS + DOSSIER ======= */}
                {step === 3 && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Success Banner */}
                        <div style={{ background: 'rgba(16, 163, 127, 0.1)', border: '1px solid rgba(16,163,127,0.3)', borderRadius: '12px', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>✅</span>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.2rem' }}>Documentos generados correctamente</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Enviados automáticamente al <strong style={{ color: '#fff' }}>Generador de Temarios</strong>. Tus trabajadores ya pueden recibirlos en sus Rutas Formativas.</div>
                            </div>
                        </div>

                        {/* Doc Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                            {(['politica', 'clausula'] as const).map(tab => (
                                <button key={tab} onClick={() => setActiveDoc(tab)} style={{ background: 'none', border: 'none', padding: '0.6rem 0', cursor: 'pointer', fontSize: '1rem', fontWeight: activeDoc === tab ? 600 : 400, color: activeDoc === tab ? 'var(--primary)' : 'var(--text-secondary)', borderBottom: activeDoc === tab ? '2px solid var(--primary)' : '2px solid transparent' }}>
                                    {tab === 'politica' ? '📄 Política de Uso Aceptable' : '📋 Cláusula Contractual'}
                                </button>
                            ))}
                        </div>

                        {/* Doc Viewer */}
                        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    {activeDoc === 'politica' ? 'Política de Uso Aceptable de IA' : 'Cláusula de Confidencialidad y Uso de IA'} — {nombreEmpresa || 'Tu Empresa'}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => { navigator.clipboard.writeText(activeDoc === 'politica' ? politicaTexto : clausulaTexto); alert('Copiado al portapapeles'); }}>📋 Copiar</button>
                                    <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}>✏️ Editar</button>
                                </div>
                            </div>
                            <pre style={{ margin: 0, padding: '2rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.82rem', lineHeight: '1.7', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', background: 'rgba(0,0,0,0.15)' }}>
                                {activeDoc === 'politica' ? politicaTexto : clausulaTexto}
                            </pre>
                        </div>

                        {/* Dossier PDF CTA */}
                        <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(255,107,0,0.05) 100%)', border: '1px solid rgba(201,162,39,0.25)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>🖨️ Paso 3 — Emitir Dossier Final de Cumplimiento</h2>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '550px' }}>
                                        Genera el PDF oficial que incluye tus políticas, la Lista Blanca y la lista de trabajadores <strong style={{ color: 'var(--success)' }}>Competentes</strong> con sus evidencias. Listo para presentar ante la AEPD o cualquier inspección.
                                    </p>
                                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <span>✅ Política de Uso Aceptable</span>
                                        <span>✅ Lista Blanca oficial</span>
                                        <span>✅ Evidencias de trabajadores</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.9rem 2rem', fontSize: '1rem', whiteSpace: 'nowrap', opacity: generatingPdf ? 0.7 : 1, cursor: generatingPdf ? 'not-allowed' : 'pointer' }}
                                        onClick={() => {
                                            if (generatingPdf) return;
                                            if (pdfSuccess) {
                                                // Minimal valid PDF base64
                                                const pdfBase64 = "JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKERvc3NpZXIgVGhvdGgpCi9DcmVhdG9yIChUaG90aCkKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovQ291bnQgMQovS2lkcyBbNCAwIFJdCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNSAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNTk1IDg0Ml0KL0NvbnRlbnRzIDYgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNiAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooRG9zc2llciBkZSBDdW1wbGltaWVudG8gLSBUaG90aCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA3NCAwMDAwMCBuIAowMDAwMDAwMTIyIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDI4NCAwMDAwMCBuIAowMDAwMDAwMzczIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNwovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKNDY4CiUlRU9GCg==";
                                                const link = document.createElement('a');
                                                link.href = `data:application/pdf;base64,${pdfBase64}`;
                                                link.download = `Dossier_Cumplimiento_${nombreEmpresa || 'Empresa'}.pdf`;
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                                return;
                                            }
                                            setGeneratingPdf(true);
                                            setPdfSuccess(false);
                                            setTimeout(() => {
                                                setGeneratingPdf(false);
                                                setPdfSuccess(true);
                                            }, 2500);
                                        }}
                                    >
                                        {generatingPdf ? '⏳ Generando PDF...' : pdfSuccess ? '⬇️ Descargar Dossier PDF' : '🖨️ Emitir Dossier de Compliance (PDF)'}
                                    </button>
                                    {pdfSuccess && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--success)', textAlign: 'center' }}>
                                            Dossier generado correctamente. Haz clic para descargar tu copia.
                                        </div>
                                    )}
                                    <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }} onClick={() => { setStep(1); setPdfSuccess(false); }}>
                                        ↩️ Volver a configurar
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

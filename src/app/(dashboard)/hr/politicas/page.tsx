'use client';

import { useState, useRef } from 'react';
import { EscudoDigitalPDF } from '@/components/EscudoDigitalPDF';

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

        return `POLÍTICA INTEGRAL DE USO ACEPTABLE Y GOBERNANZA DE INTELIGENCIA ARTIFICIAL
Entidad: ${nombreEmpresa || 'La Empresa'}
Fecha de entrada en vigor: ${hoy}
Versión: 1.0 (Generada por THOTH AI Compliance Platform)

1. DECLARACIÓN DE PRINCIPIOS Y COMPROMISO CORPORATIVO
${nombreEmpresa || 'La organización'} reconoce el potencial transformador de la Inteligencia Artificial (IA) para mejorar la productividad y la innovación. Sin embargo, este uso debe alinearse estrictamente con nuestros valores éticos, la normativa europea (AI Act, Reglamento UE 2024/1689) y la protección de datos (RGPD, Reglamento UE 2016/679). Esta política establece el marco de gobernanza obligatorio para todos los empleados, directivos y colaboradores externos.

2. ALFABETIZACIÓN EN IA Y FORMACIÓN CONTINUA (Art. 4 AI Act)
En estricto cumplimiento del Artículo 4 del Reglamento Europeo de Inteligencia Artificial, la empresa se compromete a garantizar un nivel adecuado de "alfabetización en IA" para todo su personal. 
- Todo empleado que utilice sistemas de IA deberá someterse a formación continua a través de la plataforma THOTH.
- La empresa evaluará periódicamente las competencias de los trabajadores para asegurar que comprenden los riesgos, sesgos y limitaciones de la IA.
- El uso de IA en el entorno laboral está condicionado a la superación de las misiones y evaluaciones de competencia establecidas por el departamento de Recursos Humanos.

3. HERRAMIENTAS AUTORIZADAS (LISTA BLANCA OFICIAL)
Para garantizar la seguridad de la información y el cumplimiento normativo, únicamente se autoriza el uso profesional de las siguientes herramientas de IA, las cuales han superado nuestra auditoría interna de riesgos:
${listaBlanca || 'Ninguna herramienta autorizada de forma genérica. Consultar con el responsable.'}

El uso de cualquier otra herramienta de IA generativa (Shadow AI) para tareas laborales queda estrictamente prohibido y será considerado una brecha de seguridad grave.

4. PROTECCIÓN DE DATOS Y RESTRICCIONES DE ENTRADA (PROMPTS)
Queda terminantemente prohibido introducir en cualquier herramienta de IA (incluso las autorizadas) los siguientes tipos de datos e información confidencial:
${listaProhibida || '- No se han especificado restricciones adicionales.'}

5. RESPONSABILIDAD, SUPERVISIÓN HUMANA Y SESGOS
El trabajador es el único y último responsable de cualquier contenido (texto, código, imagen, decisión) generado por una herramienta de IA. 
- Principio de "Human-in-the-loop" (Art. 14 AI Act): Ninguna respuesta de una IA puede ser enviada a un cliente, integrada en código de producción o publicada sin revisión crítica humana.
- Los empleados deben ser conscientes de que la IA puede generar "alucinaciones" (información falsa presentada con convicción) y perpetuar sesgos discriminatorios.

6. TRANSPARENCIA Y USO DE IA EN RECURSOS HUMANOS
${usaIAenRRHH ? 'Dado que la empresa utiliza IA en procesos que afectan a empleados (selección, evaluación de rendimiento, etc.), se informa a todos los trabajadores de este uso tal como exige el AI Act (Art. 13 y Anexo III). Toda decisión que afecte individualmente a un empleado y que haya sido asistida por IA será revisada y validada por un responsable humano, garantizando el derecho a la explicación.' : 'Actualmente, la empresa NO utiliza sistemas de IA de alto riesgo para la toma de decisiones sobre el empleo, selección o evaluación de trabajadores. En caso de adoptarse, se actualizará esta política con la antelación suficiente.'}

${tieneRLT ? `7. INFORMACIÓN A LOS REPRESENTANTES DE LOS TRABAJADORES (RLT)
En cumplimiento del Art. 64.4.d) del Estatuto de los Trabajadores, la empresa ha informado a la RLT sobre los parámetros, reglas e instrucciones en los que se basan los algoritmos o sistemas de IA que afectan a la toma de decisiones que pueden incidir en las condiciones de trabajo, el acceso y mantenimiento del empleo.` : ''}

8. RÉGIMEN DISCIPLINARIO
El incumplimiento de las directrices establecidas en esta política pondrá en grave riesgo la seguridad de la información de la empresa y de sus clientes, por lo que será considerado una falta grave o muy grave conforme al Convenio Colectivo aplicable, pudiendo derivar en sanciones disciplinarias.`;
    };

    const generateClausulaTexto = () => {
        const listaBlanca = allHerramientas.filter(h => herramientasSelected.includes(h.id)).map(h => h.label).join(', ');
        const listaProhibida = datosProhibidos.filter(d => datosSelected.includes(d.id)).map(d => d.label).join('; ');

        return `CLÁUSULA CONTRACTUAL DE CONFIDENCIALIDAD, USO DE IA Y ALFABETIZACIÓN DIGITAL
(Anexo vinculante al Contrato de Trabajo)

Reunidos de una parte ${nombreEmpresa || 'la empresa'}, y de otra el/la trabajador/a, acuerdan incorporar el presente anexo a su contrato laboral, en cumplimiento del Reglamento UE 2024/1689 (AI Act) y el Reglamento UE 2016/679 (RGPD).

PRIMERO.- DEBER DE ALFABETIZACIÓN EN IA (ART. 4 AI ACT)
El/la trabajador/a reconoce su obligación de participar activamente en los programas de formación y evaluación continua proporcionados por la empresa (a través de la plataforma THOTH o similares) para alcanzar y mantener un nivel adecuado de alfabetización en Inteligencia Artificial, comprendiendo sus riesgos, sesgos y funcionamiento básico.

SEGUNDO.- USO EXCLUSIVO DE HERRAMIENTAS AUTORIZADAS
El/la trabajador/a se compromete a utilizar exclusivamente las herramientas de IA autorizadas por la empresa en su Lista Blanca Oficial (${listaBlanca || 'las definidas en la Política de Uso Aceptable'}). El uso de herramientas no autorizadas para el procesamiento de información corporativa queda estrictamente prohibido.

TERCERO.- PROTECCIÓN DE LA CONFIDENCIALIDAD
El/la trabajador/a se obliga a NO introducir en ninguna herramienta de IA, interna o externa, la siguiente información: ${listaProhibida || 'información sensible o confidencial de la empresa'}. La vulneración de este punto será considerada una brecha de seguridad y violación del secreto profesional.

CUARTO.- SUPERVISIÓN HUMANA OBLIGATORIA
El/la trabajador/a asume la responsabilidad personal y directa sobre cualquier resultado (output) generado con asistencia de IA en el ejercicio de su actividad laboral. Se compromete a revisar, verificar y validar siempre la información antes de su uso, asumiendo que los sistemas de IA pueden cometer errores o alucinaciones.

QUINTO.- NOTIFICACIÓN DE INCIDENTES
El/la trabajador/a deberá notificar inmediatamente al Responsable de Seguridad o Compliance cualquier incidente, anomalía o sospecha de brecha de datos relacionada con el uso de sistemas de Inteligencia Artificial.

SEXTO.- RÉGIMEN DISCIPLINARIO
El incumplimiento de la presente cláusula facultará a la empresa para adoptar las medidas disciplinarias previstas en el Convenio Colectivo y en el Estatuto de los Trabajadores, incluyendo el despido disciplinario en los casos de especial gravedad, sin perjuicio de las responsabilidades civiles o penales que pudieran derivarse.

Leído y conforme, firman el presente anexo.`;
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
                                                const element = document.getElementById('dossier-pdf-content');
                                                if (element) {
                                                    element.style.display = 'block';
                                                    import('html2pdf.js').then((html2pdfModule) => {
                                                        const html2pdf = html2pdfModule.default || html2pdfModule;
                                                        const opt = {
                                                            margin: 10,
                                                            filename: `Dossier_Tecnico_IA_${nombreEmpresa || 'Empresa'}.pdf`,
                                                            image: { type: 'jpeg' as const, quality: 0.98 },
                                                            html2canvas: { scale: 2, useCORS: true },
                                                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
                                                        };
                                                        html2pdf().set(opt).from(element).save().then(() => {
                                                            element.style.display = 'none';
                                                            setGeneratingPdf(false);
                                                            setPdfSuccess(true);
                                                        });
                                                    });
                                                }
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

            {/* Hidden PDF Content */}
            <div style={{ display: 'none' }}>
                <EscudoDigitalPDF
                    nombreEmpresa={nombreEmpresa}
                    listaBlanca={allHerramientas.filter(h => herramientasSelected.includes(h.id)).map(h => h.label).join(', ')}
                    listaProhibida={datosProhibidos.filter(d => datosSelected.includes(d.id)).map(d => d.label).join('; ')}
                />
            </div>
        </div>
    );
}

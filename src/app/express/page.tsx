'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RutaExpressPage() {
    const [step, setStep] = useState(0);

    const steps = [
        { type: 'intro', title: 'Ruta Express Activada 🚀', content: 'Estás a punto de completar toda tu Ruta Formativa de una sola vez. THOTH te guiará paso a paso sin interrupciones. Tiempo estimado: 45 minutos.' },
        { type: 'lectura', title: 'Paso 1: Política de Privacidad de Datos', content: 'Lee atentamente el siguiente resumen generado por IA sobre la política de la empresa. \n\n"Está terminantemente prohibido introducir datos personales de clientes (nombres, DNI, emails, teléfonos) en herramientas de IA públicas como ChatGPT o Claude. Solo se permite el uso de la instancia privada de THOTH para procesar este tipo de información."' },
        { type: 'mision', title: 'Paso 2: Caso Práctico', content: 'Un cliente te pide que le resumas un contrato que contiene sus datos personales. ¿Qué herramienta utilizas para hacerlo?' },
        { type: 'evaluacion', title: 'Paso 3: Evaluación Automática', content: 'THOTH está evaluando tu respuesta...' },
        { type: 'exito', title: '¡Ruta Formativa Completada! 🎉', content: 'Has demostrado ser competente en el uso de la IA para tu puesto. Tu certificado ya está disponible.' }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
    };

    const currentStep = steps[step];

    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.1) 0%, transparent 70%)' }}>
            <title>Ruta Express | THOTH</title>
            <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '3rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
                    <div style={{ width: `${(step / (steps.length - 1)) * 100}%`, height: '100%', background: 'var(--error)', transition: 'width 0.5s ease' }}></div>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: step === steps.length - 1 ? 'var(--success)' : '#fff' }}>
                    {currentStep.title}
                </h1>

                {currentStep.type === 'lectura' && (
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', textAlign: 'left', marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                            {currentStep.content}
                        </p>
                    </div>
                )}

                {currentStep.type === 'mision' && (
                    <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{currentStep.content}</p>
                        <textarea className="form-input" rows={4} placeholder="Escribe tu respuesta aquí..." style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}></textarea>
                    </div>
                )}

                {currentStep.type === 'evaluacion' && (
                    <div style={{ padding: '3rem 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }}>🤖</div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{currentStep.content}</p>
                    </div>
                )}

                {(currentStep.type === 'intro' || currentStep.type === 'exito') && (
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        {currentStep.content}
                    </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {step < steps.length - 1 ? (
                        <>
                            <Link href="/worker/panel" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.2rem', textDecoration: 'none' }}>
                                Cancelar
                            </Link>
                            <button className="btn btn-primary" onClick={handleNext} style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'var(--error)', borderColor: 'var(--error)' }}>
                                {step === 0 ? 'Comenzar Ahora' : 'Siguiente Paso →'}
                            </button>
                        </>
                    ) : (
                        <Link href="/worker/progreso" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', background: 'var(--success)', borderColor: 'var(--success)', textDecoration: 'none' }}>
                            Ver mi Certificado
                        </Link>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
}

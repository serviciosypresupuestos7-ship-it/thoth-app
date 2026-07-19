'use client';

import Link from 'next/link';

export default function EscudoDigitalPage() {
    return (
        <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '800px', width: '100%', padding: '3rem', textAlign: 'center', background: 'linear-gradient(145deg, rgba(255, 107, 0, 0.05) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📄</div>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Bienvenido a Escudo Digital
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                    Has adquirido el plan <strong>Escudo Digital</strong> (Pago único). Este plan te da acceso inmediato y exclusivo a nuestro <strong>Asistente Redactor Legal</strong> para generar tu Política Interna de IA y Cláusula de Confidencialidad a medida.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                        <span style={{ color: 'var(--primary)' }}>✓</span> Cuestionario guiado por IA
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                        <span style={{ color: 'var(--primary)' }}>✓</span> Generación de Política Interna a medida
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff' }}>
                        <span style={{ color: 'var(--primary)' }}>✓</span> Descarga del Dossier de Cumplimiento en PDF
                    </div>
                </div>

                <Link href="/hr/politicas" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📝</span> Iniciar Asistente Redactor Legal
                </Link>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '3rem' }}>
                    Nota: Este plan no incluye mantenimiento mensual ni acceso a la plataforma de formación (Rutas Formativas, Simulador IA, etc.). Si deseas ampliar tu plan, contacta con soporte.
                </p>
            </div>
        </div>
    );
}

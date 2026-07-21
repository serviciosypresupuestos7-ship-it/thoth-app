'use client';

import Link from 'next/link';

export default function CualificacionContinuaPage() {
    return (
        <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Cualificación Continua 🔄
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Mantén tus conocimientos actualizados con las últimas normativas, casos de uso y herramientas de Inteligencia Artificial.
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Actualizaciones Mensuales</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Revisa los cambios recientes en el AI Act y cómo afectan a tu rol específico.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Ver Novedades</button>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Misiones de Refuerzo</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Completa casos prácticos cortos para mantener tu certificación activa.
                    </p>
                    <Link href="/worker/simulador" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Ir al Simulador</Link>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Nuevos Materiales</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Accede a las últimas guías y políticas subidas por Recursos Humanos.
                    </p>
                    <Link href="/worker/biblioteca" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>Ir a la Biblioteca</Link>
                </div>
            </div>
        </div>
    );
}

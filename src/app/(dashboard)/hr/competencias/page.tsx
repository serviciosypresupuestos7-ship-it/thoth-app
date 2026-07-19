'use client';

const mockComps = [
    { nombre: 'Uso Seguro de IA', empleados: 50, competentes: 41, enDesarrollo: 6, sinIniciar: 3 },
    { nombre: 'Protección de Datos (RGPD)', empleados: 50, competentes: 38, enDesarrollo: 10, sinIniciar: 2 },
    { nombre: 'Supervisión Humana (HITL)', empleados: 50, competentes: 22, enDesarrollo: 20, sinIniciar: 8 },
    { nombre: 'Detección de Alucinaciones', empleados: 50, competentes: 15, enDesarrollo: 18, sinIniciar: 17 },
];

export default function HRCompetenciasPage() {
    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Estado Competencial 🧠</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Visión agregada de las competencias de toda la plantilla. Identifica brechas formativas antes de una auditoría.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mockComps.map(c => {
                    const pct = Math.round((c.competentes / c.empleados) * 100);
                    return (
                        <div key={c.nombre} className="card" style={{ padding: '1.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{c.nombre}</h3>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)' }}>{pct}%</span>
                            </div>
                            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)', transition: 'width 0.5s' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--success)' }}>✅ {c.competentes} competentes</span>
                                <span style={{ color: 'var(--warning)' }}>⚠️ {c.enDesarrollo} en desarrollo</span>
                                <span style={{ color: 'var(--error)' }}>❌ {c.sinIniciar} sin iniciar</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

'use client';

export default function HRInformesPage() {
    const stats = [
        { label: 'Trabajadores formados', value: '82%', icon: '👥', color: 'var(--success)', sub: '41 de 50 empleados' },
        { label: 'Misiones completadas', value: '127', icon: '🎯', color: 'var(--primary)', sub: 'Este trimestre' },
        { label: 'Certificados emitidos', value: '38', icon: '🏆', color: 'var(--warning)', sub: 'Nivel básico y medio' },
        { label: 'Riesgo crítico', value: '3', icon: '⚠️', color: 'var(--error)', sub: 'Empleados sin formación' },
    ];

    const deptData = [
        { dept: 'Marketing', formados: 90, total: 10 },
        { dept: 'Legal', formados: 60, total: 5 },
        { dept: 'IT', formados: 100, total: 8 },
        { dept: 'Soporte', formados: 75, total: 12 },
        { dept: 'Ventas', formados: 55, total: 15 },
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Informes de Cumplimiento 📈</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Estadísticas globales de formación, misiones y certificaciones. Exporta el informe PDF para auditorías.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Exportación PDF en desarrollo.')}>📄 Exportar PDF</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.label}</span>
                            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: s.color, margin: '0.5rem 0' }}>{s.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Cumplimiento por Departamento</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {deptData.map(d => (
                        <div key={d.dept}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                                <span style={{ fontWeight: 500 }}>{d.dept}</span>
                                <span style={{ color: d.formados >= 80 ? 'var(--success)' : d.formados >= 60 ? 'var(--warning)' : 'var(--error)', fontWeight: 600 }}>{d.formados}%</span>
                            </div>
                            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${d.formados}%`, background: d.formados >= 80 ? 'var(--success)' : d.formados >= 60 ? 'var(--warning)' : 'var(--error)', borderRadius: '5px', transition: 'width 0.5s' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

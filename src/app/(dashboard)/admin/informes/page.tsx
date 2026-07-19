'use client';

export default function AdminInformesPage() {
    const stats = [
        { label: 'Ingresos Mensuales (MRR)', value: '$124,500', icon: '💰', color: 'var(--success)' },
        { label: 'Empresas Activas', value: '342', icon: '🏢', color: 'var(--primary)' },
        { label: 'Usuarios Totales', value: '12,450', icon: '👥', color: 'var(--warning)' },
        { label: 'Consumo Tokens (Mes)', value: '845M', icon: '🤖', color: '#a855f7' },
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Estadísticas Globales 📊</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Métricas de negocio, uso de la plataforma y facturación global.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{s.label}</span>
                            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: s.color, marginTop: '0.5rem' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ marginBottom: '0.5rem', color: '#fff' }}>Gráficos en Desarrollo</h3>
                <p>La integración con el motor de analítica (Chart.js/Recharts) está programada para el próximo sprint.</p>
            </div>
        </div>
    );
}

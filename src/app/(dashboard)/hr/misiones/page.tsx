'use client';

import { useState } from 'react';

const mockMissions = [
    { id: '1', title: 'Escribir correo a cliente enfadado', employee: 'Ana Martínez', dept: 'Marketing', difficulty: 'Alta', status: 'completed', score: 92, date: '18/07/2026' },
    { id: '2', title: 'Resumir contrato de confidencialidad', employee: 'Carlos López', dept: 'Soporte', difficulty: 'Media', status: 'pending', score: null, date: '17/07/2026' },
    { id: '3', title: 'Analizar CV para puesto técnico', employee: 'Laura Gómez', dept: 'IT', difficulty: 'Baja', status: 'completed', score: 78, date: '15/07/2026' },
    { id: '4', title: 'Detección de alucinaciones en informe', employee: 'Pedro Ruiz', dept: 'Legal', difficulty: 'Alta', status: 'pending', score: null, date: '16/07/2026' },
    { id: '5', title: 'Generar presupuesto con IA', employee: 'María Torres', dept: 'Ventas', difficulty: 'Media', status: 'failed', score: 42, date: '14/07/2026' },
];

const statusConfig: Record<string, { label: string; color: string; badge: string }> = {
    completed: { label: 'Completada', color: 'var(--success)', badge: 'badge-success' },
    pending: { label: 'Pendiente', color: 'var(--warning)', badge: 'badge-warning' },
    failed: { label: 'Fallida', color: 'var(--error)', badge: 'badge-danger' },
};

export default function HRMisionesPage() {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
    const [search, setSearch] = useState('');

    const filtered = mockMissions
        .filter(m => filter === 'all' || m.status === filter)
        .filter(m =>
            m.title.toLowerCase().includes(search.toLowerCase()) ||
            m.employee.toLowerCase().includes(search.toLowerCase()) ||
            m.dept.toLowerCase().includes(search.toLowerCase())
        );

    const counts = {
        all: mockMissions.length,
        pending: mockMissions.filter(m => m.status === 'pending').length,
        completed: mockMissions.filter(m => m.status === 'completed').length,
        failed: mockMissions.filter(m => m.status === 'failed').length,
    };

    return (
        <div style={{ padding: '1rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Control de Misiones 🎯
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px' }}>
                        Seguimiento en tiempo real de las misiones asignadas a la plantilla. Supervisa el progreso y detecta empleados que necesitan apoyo.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Generador de misiones masivas en desarrollo.')}>
                    + Asignar Misión
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Misiones', value: counts.all, icon: '📋', color: 'var(--primary)' },
                    { label: 'Pendientes', value: counts.pending, icon: '⏳', color: 'var(--warning)' },
                    { label: 'Completadas', value: counts.completed, icon: '✅', color: 'var(--success)' },
                    { label: 'Fallidas', value: counts.failed, icon: '❌', color: 'var(--error)' },
                ].map(kpi => (
                    <div key={kpi.label} className="card" style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{kpi.label}</span>
                            <span style={{ fontSize: '1.3rem' }}>{kpi.icon}</span>
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: kpi.color, marginTop: '0.5rem' }}>{kpi.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters + Search */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Buscar por misión, empleado o departamento..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, minWidth: '250px' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['all', 'pending', 'completed', 'failed'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={filter === f ? 'btn btn-primary' : 'btn btn-secondary'}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        >
                            {f === 'all' ? `Todas (${counts.all})` : f === 'pending' ? `Pendientes (${counts.pending})` : f === 'completed' ? `Completadas (${counts.completed})` : `Fallidas (${counts.failed})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                            {['Misión', 'Empleado', 'Depto.', 'Dificultad', 'Estado', 'Puntuación', 'Fecha', 'Acciones'].map(h => (
                                <th key={h} style={{ padding: '1rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay misiones que coincidan con los filtros.</td></tr>
                        ) : filtered.map(m => {
                            const sc = statusConfig[m.status];
                            return (
                                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: '#fff', maxWidth: '220px' }}>{m.title}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{m.employee}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ background: 'rgba(30,78,140,0.3)', color: '#8bb4e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{m.dept}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${m.difficulty === 'Alta' ? 'badge-danger' : m.difficulty === 'Media' ? 'badge-warning' : 'badge-success'}`}>{m.difficulty}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge ${sc.badge}`}>{sc.label}</span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {m.score !== null
                                            ? <span style={{ fontWeight: 'bold', color: m.score >= 70 ? 'var(--success)' : 'var(--error)', fontSize: '1.1rem' }}>{m.score}%</span>
                                            : <span style={{ color: 'var(--text-muted)' }}>—</span>
                                        }
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{m.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                                            onClick={() => alert(`Revisando misión de ${m.employee}: ${m.title}`)}>
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

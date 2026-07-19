'use client';

import { useState } from 'react';

const mockRoutes = [
    { id: '1', name: 'Uso Seguro de IA – Nivel Básico', dept: 'Todos', employees: 12, completados: 10, pendientes: 2, estado: 'Activa' },
    { id: '2', name: 'AI Act para Managers', dept: 'Dirección', employees: 4, completados: 2, pendientes: 2, estado: 'Activa' },
    { id: '3', name: 'RGPD y Protección de Datos', dept: 'RRHH', employees: 5, completados: 5, pendientes: 0, estado: 'Completada' },
    { id: '4', name: 'Detección de Alucinaciones', dept: 'Legal', employees: 3, completados: 0, pendientes: 3, estado: 'En progreso' },
];

export default function HRRutasPage() {
    const [search, setSearch] = useState('');
    const filtered = mockRoutes.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.dept.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Rutas Formativas 🧭</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Gestiona las rutas de aprendizaje asignadas a cada departamento y supervisa su progreso colectivo.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Creación de ruta en desarrollo.')}>+ Nueva Ruta</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input type="text" placeholder="Buscar ruta o departamento..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ maxWidth: '400px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filtered.map(r => {
                    const pct = Math.round((r.completados / r.employees) * 100);
                    return (
                        <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem' }}>{r.name}</h3>
                                    <span style={{ background: 'rgba(30,78,140,0.3)', color: '#8bb4e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{r.dept}</span>
                                </div>
                                <span className={`badge ${r.estado === 'Completada' ? 'badge-success' : r.estado === 'Activa' ? 'badge-primary' : 'badge-warning'}`}>{r.estado}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span>👥 {r.employees} empleados</span>
                                <span>✅ {r.completados} completados</span>
                                <span>⏳ {r.pendientes} pendientes</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--success)' : 'var(--primary)', transition: 'width 0.5s' }} />
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{pct}% completado</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

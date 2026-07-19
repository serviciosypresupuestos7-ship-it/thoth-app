'use client';

import { useState } from 'react';

const mockUsers = [
    { id: '1', name: 'Admin Principal', email: 'admin@thoth.ai', role: 'Superadmin', status: 'Activo', lastLogin: 'Hace 2 horas' },
    { id: '2', name: 'Soporte Técnico', email: 'soporte@thoth.ai', role: 'Soporte', status: 'Activo', lastLogin: 'Hace 1 día' },
    { id: '3', name: 'Ventas B2B', email: 'ventas@thoth.ai', role: 'Ventas', status: 'Inactivo', lastLogin: 'Hace 1 semana' },
];

export default function AdminUsuariosPage() {
    const [search, setSearch] = useState('');

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Usuarios del Sistema 👥</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Gestiona los administradores internos de la plataforma THOTH.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Invitar usuario en desarrollo.')}>+ Invitar Usuario</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <input type="text" placeholder="Buscar por nombre o email..." value={search} onChange={e => setSearch(e.target.value)} className="form-input" style={{ maxWidth: '400px' }} />
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Nombre</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Email</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Rol</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Último Acceso</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#fff' }}>{u.name}</td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                                <td style={{ padding: '1rem 1.5rem' }}><span className="badge" style={{ background: 'rgba(30,78,140,0.3)', color: '#8bb4e5' }}>{u.role}</span></td>
                                <td style={{ padding: '1rem 1.5rem' }}><span className={`badge ${u.status === 'Activo' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.lastLogin}</td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

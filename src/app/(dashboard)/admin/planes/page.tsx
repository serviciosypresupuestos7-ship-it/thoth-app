'use client';

import { useState } from 'react';

const mockPlanes = [
    {
        id: '1',
        nombre: 'THOTH Individual',
        precio: '29',
        subtitle: 'Para autónomos y consultores',
        features: [
            '1 usuario',
            'IA incluida',
            'Todas las rutas formativas',
            'Tutor IA y Simulaciones',
            'Certificados y Evidencias',
            'Biblioteca Legal'
        ]
    },
    {
        id: '2',
        nombre: 'THOTH Empresa',
        precio: '99',
        subtitle: 'Hasta 15 trabajadores incluidos',
        highlight: true,
        features: [
            'Todo lo del plan Individual',
            'Panel de RRHH y Cumplimiento',
            'Motor Documental (Políticas internas)',
            'Informes de progreso',
            '+6 €/mes por trabajador (16 a 50)',
            '+4 €/mes por trabajador (51 a 200)'
        ]
    },
    {
        id: '3',
        nombre: 'Enterprise',
        precio: 'Personalizado',
        subtitle: 'Para grandes corporaciones',
        features: [
            'Trabajadores ilimitados',
            'Integración SSO',
            'Posibilidad de usar API propia (BYOK)',
            'Soporte prioritario',
            'Despliegue dedicado'
        ]
    },
];

export default function AdminPlanesPage() {
    return (
        <div style={{ padding: '1rem', height: '100%', overflowY: 'auto' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Estrategia Comercial y Planes 💳</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Gestiona los planes de suscripción. El modelo de negocio se basa en el valor aportado y el número de usuarios, abstrayendo por completo la complejidad técnica (tokens, modelos) de cara al cliente.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Creación de plan en desarrollo.')}>+ Nuevo Plan</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '1200px' }}>
                {mockPlanes.map(p => (
                    <div key={p.id} className="card" style={{
                        padding: '2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        border: p.highlight ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {p.highlight && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'var(--primary)', color: '#000', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem' }}>
                                MÁS POPULAR
                            </div>
                        )}
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', marginTop: p.highlight ? '1rem' : '0' }}>{p.nombre}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{p.subtitle}</p>

                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: p.highlight ? 'var(--primary)' : '#fff', marginBottom: '2rem' }}>
                            {p.precio !== 'Personalizado' ? `$${p.precio}` : 'A medida'}
                            {p.precio !== 'Personalizado' && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/mes</span>}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '1rem', fontSize: '0.9rem', color: '#fff' }}>Incluye:</strong>
                                <ul style={{ margin: 0, paddingLeft: '0', listStyle: 'none', color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {p.features.map((f, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <span style={{ color: 'var(--primary)' }}>✓</span>
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <button className={p.highlight ? "btn btn-primary" : "btn btn-secondary"} style={{ width: '100%' }}>
                            Editar Plan
                        </button>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '2rem', marginTop: '3rem', maxWidth: '1200px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🛒</span> Marketplace de Contenidos (Próximamente)
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Además de la suscripción a la plataforma, las empresas podrán adquirir rutas formativas especializadas (One-off o Add-ons).
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {['Competencia IA Básica', 'IA para RRHH', 'IA para Marketing', 'RGPD + IA', 'AI Act Alto Riesgo'].map((curso, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>{curso}</span>
                            <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>+ 49€</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

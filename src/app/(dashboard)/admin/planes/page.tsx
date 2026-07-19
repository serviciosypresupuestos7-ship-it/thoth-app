'use client';

import { useState } from 'react';

const mockPlanes = [
    {
        id: '1',
        nombre: 'Acreditado 🆔',
        precio: '29',
        subtitle: 'Para autónomos y consultores',
        features: [
            '1 usuario',
            'IA incluida (Tutor y Simulador en entorno seguro)',
            'Todas las rutas formativas generales',
            'Certificados oficiales y Evidencias personales',
            'Biblioteca Legal'
        ]
    },
    {
        id: '2',
        nombre: 'Control Equipo 👥',
        precio: '99',
        subtitle: 'Hasta 15 trabajadores incluidos',
        highlight: true,
        features: [
            'Todo lo del plan Acreditado',
            'Panel de RRHH y Cumplimiento',
            'Motor Documental (Asistente Redactor de Políticas Internas)',
            'Generador de Temarios ✨ básico: índices por IA basados en la ley oficial',
            'Informes de progreso y registro de evidencias inmutables de la plantilla',
            '+12 € / mes por cada trabajador adicional (a partir del empleado 16)'
        ]
    },
    {
        id: '3',
        nombre: 'Escudo Digital 📄',
        precio: '149',
        isOneOff: true,
        subtitle: 'Solo documentación (Sin software)',
        features: [
            'Acceso inmediato al Asistente Redactor Legal',
            'Cuestionario guiado por IA para generar tu Política Interna y Cláusula de Confidencialidad a medida',
            'Descarga del Dossier de Cumplimiento base en PDF listo para firmar ante inspecciones',
            'Sin mantenimiento mensual ni acceso a la plataforma de formación'
        ]
    },
    {
        id: '4',
        nombre: 'Corporativo 👑',
        precio: 'Personalizado',
        subtitle: 'Para grandes corporaciones',
        features: [
            'Trabajadores ilimitados',
            'Generador de Temarios ✨ avanzado (Publicación e índices ilimitados de cursos propios corporativos)',
            'Integración avanzada de sistemas (SSO)',
            'Posibilidad de conectar tu propia API Key de OpenAI (BYOK)',
            'Soporte de auditoría prioritario y despliegue dedicado'
        ]
    },
];

export default function AdminPlanesPage() {
    return (
        <div style={{ padding: '1rem 2rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Estrategia Comercial y Planes 💳</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Gestiona los planes de suscripción. El modelo de negocio se basa en el valor aportado y el número de usuarios, abstrayendo por completo la complejidad técnica (tokens, modelos) de cara al cliente.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('Creación de plan en desarrollo.')}>+ Nuevo Plan</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
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
                            {p.precio !== 'Personalizado' ? `${p.precio} €` : 'A medida'}
                            {p.precio !== 'Personalizado' && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>{p.isOneOff ? ' / Pago único' : ' / mes'}</span>}
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

            <div className="card" style={{ padding: '2rem', marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🛒</span> Marketplace de Contenidos (Próximamente)
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Además de la suscripción a la plataforma, las empresas podrán adquirir rutas formativas especializadas como módulos adicionales (One-off).
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {['Competencia IA Básica', 'IA para RRHH', 'IA para Marketing', 'RGPD + IA', 'AI Act Alto Riesgo'].map((curso, i) => (
                        <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 500 }}>{curso}</span>
                            <span style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>+ 49 €</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: '2rem', marginTop: '3rem', maxWidth: '1400px', background: 'linear-gradient(145deg, rgba(255, 107, 0, 0.05) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📐</span> Guía rápida visual para tu pasarela de cobro
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Ejemplos con el +12 € para que recuerdes cómo aplica el escalado del plan Control Equipo en tu código de Stripe a partir del trabajador 16:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Empresa de 12 empleados:</strong>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Se mantiene en la base fija de 99 € / mes (cubre hasta 15).</p>
                        <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff' }}>Factura: 99 € / mes</div>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Empresa de 20 empleados:</strong>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Tiene 5 empleados extra sobre el límite de 15.</p>
                        <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff' }}>Factura: 99 € + (5 × 12 €) = <strong style={{ color: 'var(--primary)' }}>159 € / mes</strong></div>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                        <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Empresa de 35 empleados:</strong>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Tiene 20 empleados extra sobre el límite de 15.</p>
                        <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '1.1rem', color: '#fff' }}>Factura: 99 € + (20 × 12 €) = <strong style={{ color: 'var(--primary)' }}>339 € / mes</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

function SolicitarBtn() {
    const [sent, setSent] = useState(false);
    if (sent) return <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ Solicitud enviada a RRHH</span>;
    return <button className="btn btn-primary" onClick={() => setSent(true)}>Solicitar Evaluación</button>;
}

export default function CompetenciasPage() {
    const competencias = [
        {
            id: '1',
            nombre: 'Uso Seguro de IA (Políticas Internas)',
            nivel: 'Avanzado',
            estado: 'Competente',
            ultimaEvaluacion: 'Hace 12 días',
            proximaRevision: 'Dentro de 6 meses',
            color: 'var(--success)',
            misiones: ['No introducir datos de clientes', 'Uso exclusivo de ChatGPT Enterprise'],
            recomendaciones: ['Revisar actualización Q3 de política de datos']
        },
        {
            id: '2',
            nombre: 'Protección de Datos (RGPD)',
            nivel: 'Experto',
            estado: 'Competente',
            ultimaEvaluacion: 'Hace 1 mes',
            proximaRevision: 'Dentro de 1 año',
            color: 'var(--success)',
            misiones: ['Anonimización de CVs', 'Gestión de consentimientos'],
            recomendaciones: ['Mantener al día con las resoluciones de la AEPD']
        },
        {
            id: '3',
            nombre: 'Supervisión Humana (HITL)',
            nivel: 'Intermedio',
            estado: 'En Desarrollo',
            ultimaEvaluacion: 'Hace 5 días',
            proximaRevision: 'Próxima semana',
            color: 'var(--warning)',
            misiones: ['Revisión de ofertas generadas por IA', 'Filtro de candidatos'],
            recomendaciones: ['Completar módulo práctico de "Validación de resultados IA"']
        },
        {
            id: '4',
            nombre: 'Detección de Alucinaciones',
            nivel: 'Básico',
            estado: 'Requiere Acción',
            ultimaEvaluacion: 'Nunca',
            proximaRevision: 'Inmediata',
            color: 'var(--error)',
            misiones: ['Búsqueda de información legal', 'Análisis de mercado'],
            recomendaciones: ['Iniciar ruta formativa básica sobre Modelos de Lenguaje']
        }
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Tus Competencias 🧠
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Aquí puedes ver tus habilidades consolidadas según el marco competencial de tu puesto. Evaluamos tanto el cumplimiento del AI Act como las políticas internas de la empresa.
                    </p>
                </div>
                <SolicitarBtn />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {competencias.map(comp => (
                    <div key={comp.id} className="card" style={{ padding: '2rem', borderLeft: `4px solid ${comp.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {comp.estado === 'Competente' ? '✅' : comp.estado === 'En Desarrollo' ? '⚠️' : '❌'} {comp.nombre}
                                </h2>
                                <span style={{ color: comp.color, fontSize: '1rem', fontWeight: 600 }}>Nivel: {comp.nivel}</span>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', gap: '2rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Última evaluación</div>
                                    <div style={{ fontWeight: 500 }}>{comp.ultimaEvaluacion}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Estado</div>
                                    <div style={{ fontWeight: 'bold', color: comp.color }}>{comp.estado}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Próxima revisión</div>
                                    <div style={{ fontWeight: 500 }}>{comp.proximaRevision}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Misiones Relacionadas */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>🎯</span> Criterios Evaluados (Políticas y AI Act)
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {comp.misiones.map((m, i) => (
                                        <li key={i}>{m}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recomendaciones */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>💡</span> Recomendaciones de THOTH
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {comp.recomendaciones.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                                <Link href="/worker/formacion" className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                    {comp.estado !== 'Competente' ? 'Ir a Formación Recomendada →' : 'Repasar Formación →'}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

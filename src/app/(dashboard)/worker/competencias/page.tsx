'use client';

import Link from 'next/link';

export default function CompetenciasPage() {
    const competencias = [
        {
            id: '1',
            nombre: 'Uso Responsable de IA',
            nivel: 85,
            estado: '✅',
            color: 'var(--success)',
            evolucion: '+12% este mes',
            misiones: ['Redactar correos', 'Generar presupuestos'],
            recomendaciones: ['Revisar guía de sesgos algorítmicos']
        },
        {
            id: '2',
            nombre: 'Protección de Datos (RGPD)',
            nivel: 92,
            estado: '✅',
            color: 'var(--success)',
            evolucion: '+5% este mes',
            misiones: ['Resumir contratos', 'Analizar CVs'],
            recomendaciones: ['¡Nivel experto alcanzado! Mantener al día con las actualizaciones.']
        },
        {
            id: '3',
            nombre: 'Supervisión Humana (HITL)',
            nivel: 55,
            estado: '⚠️',
            color: 'var(--warning)',
            evolucion: '-2% este mes',
            misiones: ['Toma de decisiones automatizada', 'Filtro de candidatos'],
            recomendaciones: ['Completar módulo práctico de "Validación de resultados IA"']
        },
        {
            id: '4',
            nombre: 'Detección de Alucinaciones',
            nivel: 30,
            estado: '❌',
            color: 'var(--error)',
            evolucion: 'Nueva competencia',
            misiones: ['Búsqueda de información legal', 'Análisis de mercado'],
            recomendaciones: ['Iniciar ruta formativa básica sobre Modelos de Lenguaje']
        }
    ];

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Tus Competencias 🧠
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Aquí puedes ver tus habilidades consolidadas. Tu nivel sube a medida que completas misiones con éxito y apruebas evaluaciones teóricas.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {competencias.map(comp => (
                    <div key={comp.id} className="card" style={{ padding: '2rem', borderLeft: `4px solid ${comp.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {comp.estado} {comp.nombre}
                                </h2>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Evolución: {comp.evolucion}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: comp.color, lineHeight: 1 }}>
                                    {comp.nivel}%
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Nivel de dominio</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
                            <div style={{ width: `${comp.nivel}%`, height: '100%', background: comp.color, borderRadius: '4px' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Misiones Relacionadas */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px' }}>
                                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>🎯</span> Misiones que evalúan esta competencia
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
                                {comp.nivel < 80 && (
                                    <button className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', padding: '0.5rem' }}>
                                        Ir a Formación Recomendada
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

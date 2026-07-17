'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EmployeeCompetence {
    id: string;
    email: string;
    role: string;
    missions_completed: number;
    average_score: number;
    risk_level: 'Bajo' | 'Medio' | 'Alto';
}

export default function CompetenceDashboard() {
    const [employees, setEmployees] = useState<EmployeeCompetence[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompetenceData();
    }, []);

    const fetchCompetenceData = async () => {
        setLoading(true);
        try {
            // In a real app, we'd fetch from employee_profiles and mission_results
            // For now, we'll use mock data to demonstrate the UI

            const mockData: EmployeeCompetence[] = [
                {
                    id: '1',
                    email: 'maria.garcia@empresa.com',
                    role: 'Administración',
                    missions_completed: 12,
                    average_score: 92,
                    risk_level: 'Bajo'
                },
                {
                    id: '2',
                    email: 'carlos.ruiz@empresa.com',
                    role: 'Comercial',
                    missions_completed: 5,
                    average_score: 65,
                    risk_level: 'Medio'
                },
                {
                    id: '3',
                    email: 'laura.martinez@empresa.com',
                    role: 'RRHH',
                    missions_completed: 2,
                    average_score: 40,
                    risk_level: 'Alto'
                }
            ];

            setEmployees(mockData);
        } catch (err) {
            console.error('Error fetching competence data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Bajo': return 'var(--success)';
            case 'Medio': return 'var(--warning)';
            case 'Alto': return 'var(--danger)';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto 3rem auto' }}>
                <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>
                    Panel de Competencia en IA
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Monitoriza el nivel de competencia de tu plantilla y genera evidencias de cumplimiento para auditorías (AI Act Art. 4).
                </p>
            </div>

            {/* Global Metrics */}
            <div className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(145deg, rgba(30, 78, 140, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(30, 78, 140, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>3</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Empleados Activos</div>
                    </div>
                    <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>|</div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)', lineHeight: '1' }}>19</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Misiones Superadas</div>
                    </div>
                    <div style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>|</div>
                    <div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)', lineHeight: '1' }}>65%</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Competencia Media</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Estado de la Plantilla</h2>
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    📥 Exportar Evidencias (PDF)
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    Cargando datos...
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 'normal', borderBottom: '1px solid var(--border-color)' }}>Empleado</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 'normal', borderBottom: '1px solid var(--border-color)' }}>Departamento</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 'normal', borderBottom: '1px solid var(--border-color)' }}>Misiones</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 'normal', borderBottom: '1px solid var(--border-color)' }}>Puntuación</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 'normal', borderBottom: '1px solid var(--border-color)' }}>Riesgo Legal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem', color: '#fff' }}>{emp.email}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{emp.role}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: '#fff' }}>{emp.missions_completed}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${emp.average_score}%`, height: '100%', background: 'var(--primary)' }}></div>
                                            </div>
                                            <span style={{ color: '#fff', fontSize: '0.9rem' }}>{emp.average_score}/100</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className="badge" style={{ background: 'transparent', border: `1px solid ${getRiskColor(emp.risk_level)}`, color: getRiskColor(emp.risk_level) }}>
                                            {emp.risk_level}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

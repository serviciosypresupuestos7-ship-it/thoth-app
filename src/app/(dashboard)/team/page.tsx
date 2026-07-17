'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
    actions: string[];
}

export default function TeamPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newDepartment, setNewDepartment] = useState('');
    const [newActions, setNewActions] = useState('');

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            // In a real app, we would fetch from employee_profiles and employee_actions
            // For the MVP demo, we'll use mock data if DB is empty
            const mockData: Employee[] = [
                {
                    id: '1',
                    name: 'María García',
                    email: 'maria.garcia@empresa.com',
                    role: 'Especialista en Marketing',
                    department: 'Marketing',
                    actions: ['Redactar copys publicitarios', 'Analizar datos de clientes']
                },
                {
                    id: '2',
                    name: 'Carlos Ruiz',
                    email: 'carlos.ruiz@empresa.com',
                    role: 'Desarrollador Frontend',
                    department: 'IT',
                    actions: ['Programar código con Copilot', 'Revisar logs de errores']
                }
            ];
            setEmployees(mockData);
        } catch (err) {
            console.error('Error fetching team:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        const newEmp: Employee = {
            id: Math.random().toString(),
            name: newName,
            email: newEmail,
            role: newRole,
            department: newDepartment,
            actions: newActions.split(',').map(a => a.trim()).filter(a => a)
        };

        setEmployees([...employees, newEmp]);
        setShowForm(false);
        // Reset form
        setNewName('');
        setNewEmail('');
        setNewRole('');
        setNewDepartment('');
        setNewActions('');
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Gestión de Equipo</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Configura los perfiles de tus empleados y define las acciones específicas que realizan con IA en su día a día.
                    </p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancelar' : '+ Añadir Empleado'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAddEmployee} className="card" style={{ padding: '2rem', marginBottom: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1.5rem' }}>Nuevo Empleado</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label">Nombre Completo</label>
                            <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="form-input" placeholder="Ej. Ana Martínez" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Correo Electrónico</label>
                            <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="form-input" placeholder="ana@empresa.com" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Departamento</label>
                            <select required value={newDepartment} onChange={e => setNewDepartment(e.target.value)} className="form-select">
                                <option value="">Seleccionar...</option>
                                <option value="RRHH">Recursos Humanos</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Ventas">Ventas</option>
                                <option value="IT">Tecnología (IT)</option>
                                <option value="Legal">Legal</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Puesto / Rol</label>
                            <input required type="text" value={newRole} onChange={e => setNewRole(e.target.value)} className="form-input" placeholder="Ej. Reclutador IT" />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Acciones con IA (separadas por comas)</label>
                        <textarea
                            required
                            value={newActions}
                            onChange={e => setNewActions(e.target.value)}
                            className="form-input"
                            placeholder="Ej. Filtrar currículums, Redactar ofertas de empleo, Analizar salarios"
                            style={{ minHeight: '80px', resize: 'vertical' }}
                        />
                        <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                            THOTH utilizará estas acciones exactas para generar las misiones personalizadas de este empleado.
                        </small>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                            Guardar Perfil
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando equipo...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {employees.map(emp => (
                        <div key={emp.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 0.25rem 0' }}>{emp.name}</h3>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{emp.email}</div>
                                </div>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}>{emp.department}</span>
                            </div>

                            <div style={{ color: 'var(--primary)', fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                                {emp.role}
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
                                    Acciones Asignadas
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {emp.actions.map((action, i) => (
                                        <span key={i} className="badge" style={{ background: 'rgba(30, 78, 140, 0.2)', color: 'var(--text-primary)', border: '1px solid rgba(30, 78, 140, 0.4)' }}>
                                            {action}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

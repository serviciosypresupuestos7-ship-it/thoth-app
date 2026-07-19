'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function AdminEmpresasPage() {
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCompany, setNewCompany] = useState({ name: '', plan: 'Acreditado' });
    const supabase = createClient();

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setEmpresas(data);
            } else {
                setEmpresas([]);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let initialFeatures = { ...defaultFeatures };
            if (newCompany.plan === 'Acreditado') {
                initialFeatures = { ...initialFeatures, rutas_formativas: true, simulador_ia: true, certificados: true };
            } else if (newCompany.plan === 'Control Equipo') {
                initialFeatures = { ...initialFeatures, rutas_formativas: true, simulador_ia: true, certificados: true, panel_rrhh: true, asistente_legal: true, generador_temarios: true };
            } else if (newCompany.plan === 'Escudo Digital') {
                initialFeatures = { ...initialFeatures, asistente_legal: true };
            } else if (newCompany.plan === 'Corporativo') {
                initialFeatures = { ...initialFeatures, rutas_formativas: true, simulador_ia: true, certificados: true, panel_rrhh: true, asistente_legal: true, generador_temarios: true };
            }

            const { error } = await supabase
                .from('companies')
                .insert([{
                    name: newCompany.name,
                    plan: newCompany.plan,
                    status: 'Activa',
                    ai_consumption_percentage: 0,
                    features: initialFeatures
                }]);

            if (error) throw error;

            setShowModal(false);
            setNewCompany({ name: '', plan: 'Acreditado' });
            fetchEmpresas(); // Recargar lista
        } catch (error) {
            console.error('Error adding company:', error);
            alert('Error al crear la empresa');
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Suspendida' ? 'Activa' : 'Suspendida';
        try {
            const { error } = await supabase
                .from('companies')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchEmpresas(); // Recargar lista
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        }
    };

    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case 'Activa': return <span className="badge badge-success">Activa</span>;
            case 'Prueba': return <span className="badge badge-warning">Prueba</span>;
            case 'Suspendida': return <span className="badge badge-danger">Suspendida</span>;
            default: return <span className="badge">{estado}</span>;
        }
    };

    const [showModulesModal, setShowModulesModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);

    const defaultFeatures = {
        asistente_legal: false,
        generador_temarios: false,
        rutas_formativas: false,
        simulador_ia: false,
        certificados: false,
        panel_rrhh: false
    };

    const handleOpenModules = (company: any) => {
        setSelectedCompany({
            ...company,
            features: company.features || defaultFeatures
        });
        setShowModulesModal(true);
    };

    const handleToggleFeature = (featureKey: string) => {
        setSelectedCompany({
            ...selectedCompany,
            features: {
                ...selectedCompany.features,
                [featureKey]: !selectedCompany.features[featureKey]
            }
        });
    };

    const handleSaveModules = async () => {
        try {
            const { error } = await supabase
                .from('companies')
                .update({ features: selectedCompany.features })
                .eq('id', selectedCompany.id);

            if (error) throw error;
            setShowModulesModal(false);
            fetchEmpresas();
        } catch (error) {
            console.error('Error saving modules:', error);
            alert('Error al guardar los módulos');
        }
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Gestión de Empresas 🏢
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Panel de Superadministrador. Controla las cuentas, planes, consumo de IA y módulos activos de todos los clientes de THOTH.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-secondary" onClick={() => alert('Función de exportación en desarrollo')}>Exportar Datos</button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nueva Empresa</button>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '0', marginBottom: '2.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Empresas</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{loading ? '...' : empresas.length}</div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Usuarios Activos</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>14,592</div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Consumo Global IA (Mes)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>$4,250</div>
                </div>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>MRR Estimado</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>$32,400</div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar empresa por nombre o ID..."
                        className="form-input"
                        style={{ width: '300px', background: 'rgba(0,0,0,0.2)' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select className="form-select" style={{ width: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                            <option>Todos los planes</option>
                            <option>Corporativo</option>
                            <option>Escudo Digital</option>
                            <option>Control Equipo</option>
                            <option>Acreditado</option>
                        </select>
                        <select className="form-select" style={{ width: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                            <option>Todos los estados</option>
                            <option>Activa</option>
                            <option>Prueba</option>
                            <option>Suspendida</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Empresa</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Plan</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Trabajadores</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Consumo IA</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Coste Facturable</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando empresas...</td></tr>
                            ) : empresas.length === 0 ? (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay empresas registradas.</td></tr>
                            ) : (
                                empresas.map(emp => (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} className="table-row-hover">
                                        <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#fff' }}>{emp.name}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{emp.plan}</td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)' }}>{Math.floor(Math.random() * 500) + 10}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(emp.status)}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ color: emp.ai_consumption_percentage > 90 ? 'var(--error)' : 'var(--text-secondary)' }}>{emp.ai_consumption_percentage}%</span>
                                                <div style={{ width: '50px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                    <div style={{ width: `${emp.ai_consumption_percentage}%`, height: '100%', background: emp.ai_consumption_percentage > 90 ? 'var(--error)' : 'var(--primary)', borderRadius: '2px' }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', color: 'var(--warning)', fontWeight: 'bold' }}>${(Math.random() * 500).toFixed(2)}</td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', marginRight: '0.5rem' }} onClick={() => handleOpenModules(emp)}>Módulos</button>
                                            {emp.status === 'Suspendida' ? (
                                                <button className="btn btn-success" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => toggleStatus(emp.id, emp.status)}>Reactivar</button>
                                            ) : (
                                                <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => toggleStatus(emp.id, emp.status)}>Bloquear</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Nueva Empresa */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Añadir Nueva Empresa</h2>
                        <form onSubmit={handleAddCompany}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nombre de la Empresa</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    required
                                    value={newCompany.name}
                                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Plan de Suscripción</label>
                                <select
                                    className="form-select"
                                    value={newCompany.plan}
                                    onChange={(e) => setNewCompany({ ...newCompany, plan: e.target.value })}
                                >
                                    <option value="Acreditado">Acreditado 🆔</option>
                                    <option value="Control Equipo">Control Equipo 👥</option>
                                    <option value="Escudo Digital">Escudo Digital 📄</option>
                                    <option value="Corporativo">Corporativo 👑</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Crear Empresa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Configurar Módulos */}
            {showModulesModal && selectedCompany && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Configurar Módulos</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Activa o desactiva las funcionalidades para <strong>{selectedCompany.name}</strong> ({selectedCompany.plan}).</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            {[
                                { key: 'asistente_legal', label: 'Asistente Redactor Legal', desc: 'Generación de políticas y cláusulas con IA.' },
                                { key: 'generador_temarios', label: 'Generador de Temarios', desc: 'Creación de cursos e índices estructurados.' },
                                { key: 'rutas_formativas', label: 'Rutas Formativas', desc: 'Acceso a la plataforma de aprendizaje para workers.' },
                                { key: 'simulador_ia', label: 'Simulador IA', desc: 'Entorno seguro de práctica de casos reales.' },
                                { key: 'certificados', label: 'Certificados y Evidencias', desc: 'Emisión de PDFs inmutables de cumplimiento.' },
                                { key: 'panel_rrhh', label: 'Panel de RRHH', desc: 'Dashboard de gestión de empleados y auditoría.' }
                            ].map(mod => (
                                <div key={mod.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{mod.label}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{mod.desc}</div>
                                    </div>
                                    <button
                                        className={`btn ${selectedCompany.features[mod.key] ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{
                                            padding: '0.4rem 1rem',
                                            background: selectedCompany.features[mod.key] ? 'var(--primary)' : 'transparent',
                                            color: selectedCompany.features[mod.key] ? '#000' : 'var(--text-secondary)'
                                        }}
                                        onClick={() => handleToggleFeature(mod.key)}
                                    >
                                        {selectedCompany.features[mod.key] ? 'ACTIVADO' : 'DESACTIVADO'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModulesModal(false)}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveModules}>Guardar Configuración</button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}} />
        </div>
    );
}

'use client';

import { useState } from 'react';

export default function HRConfiguracionPage() {
    const [saved, setSaved] = useState(false);
    const [empresa, setEmpresa] = useState('Empresa Demo SL');
    const [sector, setSector] = useState('Tecnología');
    const [notif, setNotif] = useState(true);
    const [renovacion, setRenovacion] = useState('12');

    return (
        <div style={{ padding: '1rem', maxWidth: '700px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Configuración ⚙️</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Ajusta los parámetros de cumplimiento, notificaciones y ciclos de renovación de competencias.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Datos de la Organización</h3>
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label className="form-label">Nombre de la empresa</label>
                        <input className="form-input" value={empresa} onChange={e => setEmpresa(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sector</label>
                        <input className="form-input" value={sector} onChange={e => setSector(e.target.value)} />
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Ciclos de Competencia</h3>
                    <div className="form-group">
                        <label className="form-label">Renovación de competencias (meses)</label>
                        <select className="form-select" value={renovacion} onChange={e => setRenovacion(e.target.value)}>
                            <option value="6">Cada 6 meses</option>
                            <option value="12">Cada 12 meses</option>
                            <option value="24">Cada 24 meses</option>
                        </select>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Notificaciones</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={notif} onChange={e => setNotif(e.target.checked)} />
                        <span>Notificar a RRHH cuando una competencia expire o un empleado falle una evaluación</span>
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} onClick={() => setSaved(true)}>
                        {saved ? '✅ Guardado' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}

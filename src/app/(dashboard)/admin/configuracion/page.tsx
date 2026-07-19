'use client';

import { useState } from 'react';

export default function AdminConfiguracionPage() {
    const [activeTab, setActiveTab] = useState('marca');

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Configuración de la Plataforma ⚙️
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Personaliza la apariencia de THOTH (Marca Blanca) y configura tus datos fiscales para la emisión automática de facturas a tus clientes.
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('marca')}
                    style={{
                        background: 'none', border: 'none', padding: '0.5rem 0', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500,
                        color: activeTab === 'marca' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'marca' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    Personalización de Marca
                </button>
                <button
                    onClick={() => setActiveTab('facturacion')}
                    style={{
                        background: 'none', border: 'none', padding: '0.5rem 0', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 500,
                        color: activeTab === 'facturacion' ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'facturacion' ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                >
                    Datos Fiscales y Facturación
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {activeTab === 'marca' && (
                    <div className="card" style={{ maxWidth: '800px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Identidad Visual (Marca Blanca)</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Nombre de la Plataforma</label>
                                <input type="text" className="form-input" defaultValue="THOTH AI" style={{ width: '100%' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Logotipo Principal</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>T</div>
                                    <button className="btn btn-secondary">Subir nuevo logo</button>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Recomendado: PNG transparente, 512x512px.</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Color Principal (Acentos)</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="color" defaultValue="#c9a227" style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                        <input type="text" className="form-input" defaultValue="#c9a227" style={{ flex: 1 }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Color Secundario (Fondos)</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="color" defaultValue="#1e4e8c" style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }} />
                                        <input type="text" className="form-input" defaultValue="#1e4e8c" style={{ flex: 1 }} />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => alert('Configuración de marca guardada.')}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'facturacion' && (
                    <div className="card" style={{ maxWidth: '800px' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Datos Fiscales Emisor</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                            Estos datos aparecerán en la cabecera de las facturas PDF que se emitan automáticamente a tus empresas suscritas.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Razón Social</label>
                                    <input type="text" className="form-input" placeholder="Ej. Mi Empresa SaaS S.L." style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>NIF / CIF / VAT</label>
                                    <input type="text" className="form-input" placeholder="Ej. B12345678" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Dirección Fiscal</label>
                                <input type="text" className="form-input" placeholder="Calle, Número, Piso..." style={{ width: '100%' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Código Postal</label>
                                    <input type="text" className="form-input" placeholder="Ej. 28001" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Ciudad / País</label>
                                    <input type="text" className="form-input" placeholder="Ej. Madrid, España" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email de Facturación</label>
                                    <input type="email" className="form-input" placeholder="facturacion@miempresa.com" style={{ width: '100%' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>IBAN (Para transferencias)</label>
                                    <input type="text" className="form-input" placeholder="ESXX XXXX XXXX XXXX XXXX" style={{ width: '100%' }} />
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn btn-primary" onClick={() => alert('Datos fiscales guardados correctamente.')}>Guardar Datos Fiscales</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

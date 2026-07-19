'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function HREmpleadosPage() {
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({ nombre: '', apellidos: '', dni: '', email: '', puesto: 'General' });

    const [empleados, setEmpleados] = useState([
        { id: '1', nombre: 'Ana García López', dni: '12345678A', email: 'ana.garcia@empresa.com', puesto: 'Comercial', nivel: 'Avanzado', estado: 'Competente', misiones: 12, ultimaActividad: 'Hoy', fechaCapacitacion: '2026-06-15' },
        { id: '2', nombre: 'Carlos Ruiz Gómez', dni: '87654321B', email: 'carlos.ruiz@empresa.com', puesto: 'Administrativo', nivel: 'Intermedio', estado: 'En Desarrollo', misiones: 5, ultimaActividad: 'Ayer', fechaCapacitacion: 'Pendiente' },
        { id: '3', nombre: 'Laura Martínez Silva', dni: '11223344C', email: 'laura.m@empresa.com', puesto: 'RRHH', nivel: 'Experto', estado: 'Competente', misiones: 18, ultimaActividad: 'Hace 2 días', fechaCapacitacion: '2026-05-20' },
        { id: '4', nombre: 'David López Torres', dni: '44332211D', email: 'david.l@empresa.com', puesto: 'Atención al Cliente', nivel: 'Básico', estado: 'Requiere Acción', misiones: 2, ultimaActividad: 'Hace 1 semana', fechaCapacitacion: 'Pendiente' },
    ]);

    const handleAddEmployee = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmployee.nombre || !newEmployee.apellidos || !newEmployee.dni || !newEmployee.email) return;

        const newEmp = {
            id: Date.now().toString(),
            nombre: `${newEmployee.nombre} ${newEmployee.apellidos}`,
            dni: newEmployee.dni,
            email: newEmployee.email,
            puesto: newEmployee.puesto,
            nivel: 'Sin evaluar',
            estado: 'Requiere Acción',
            misiones: 0,
            ultimaActividad: 'Nunca',
            fechaCapacitacion: 'Pendiente'
        };

        setEmpleados([newEmp, ...empleados]);
        setShowModal(false);
        setNewEmployee({ nombre: '', apellidos: '', dni: '', email: '', puesto: 'General' });
    };

    const generateCertificate = async (empleado: any) => {
        setIsGeneratingPDF(true);
        setSelectedEmployee(empleado);

        // Wait for React to render the selected employee data in the hidden template
        setTimeout(async () => {
            try {
                const certificateElement = document.getElementById('certificate-template');
                if (certificateElement) {
                    certificateElement.style.display = 'block';
                    const canvas = await html2canvas(certificateElement, { scale: 2 });
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('landscape', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Certificado_Competencia_IA_${empleado.nombre.replace(/ /g, '_')}.pdf`);
                    certificateElement.style.display = 'none';
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Hubo un error al generar el certificado.');
            } finally {
                setIsGeneratingPDF(false);
                setSelectedEmployee(null);
            }
        }, 100);
    };

    return (
        <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        Gestión de Plantilla 👥
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                        Supervisa el progreso de tus trabajadores y emite certificaciones oficiales de competencia en IA con los datos de tu empresa.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Invitar Empleado</button>
            </div>

            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar empleado..."
                        className="form-input"
                        style={{ width: '300px', background: 'rgba(0,0,0,0.2)' }}
                    />
                    <select className="form-select" style={{ width: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                        <option>Todos los marcos</option>
                        <option>Comercial</option>
                        <option>Administrativo</option>
                        <option>RRHH</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Empleado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>DNI / ID</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Marco Competencial</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Nivel IA</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>Estado</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ fontWeight: 500, color: '#fff' }}>{emp.nombre}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{emp.dni}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{emp.puesto}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--primary)' }}>{emp.nivel}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span className="badge" style={{
                                            background: emp.estado === 'Competente' ? 'rgba(34, 197, 94, 0.2)' : emp.estado === 'En Desarrollo' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: emp.estado === 'Competente' ? 'var(--success)' : emp.estado === 'En Desarrollo' ? 'var(--warning)' : 'var(--error)'
                                        }}>
                                            {emp.estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                            onClick={() => generateCertificate(emp)}
                                            disabled={isGeneratingPDF || emp.estado === 'Requiere Acción'}
                                        >
                                            {isGeneratingPDF && selectedEmployee?.id === emp.id ? 'Generando...' : 'Emitir Certificado'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hidden Certificate Template for PDF Generation */}
            <div id="certificate-template" style={{
                display: 'none',
                width: '1122px', // A4 Landscape width at 96 DPI
                height: '793px', // A4 Landscape height at 96 DPI
                background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
                color: '#1f2937',
                padding: '60px',
                boxSizing: 'border-box',
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                fontFamily: 'Arial, sans-serif'
            }}>
                <div style={{
                    border: '4px solid #1e4e8c',
                    height: '100%',
                    padding: '40px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {/* Company Logo / Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '40px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <h2 style={{ margin: 0, color: '#1e4e8c', fontSize: '24px' }}>ACME CORP S.L.</h2>
                            <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Departamento de Recursos Humanos y Compliance</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>ID Certificado: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                            <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Fecha Emisión: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <h1 style={{ fontSize: '48px', color: '#111827', margin: '20px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Certificado de Competencia en IA
                    </h1>

                    <p style={{ fontSize: '20px', color: '#4b5563', margin: '20px 0' }}>
                        Por la presente se certifica que
                    </p>

                    <h2 style={{ fontSize: '42px', color: '#c9a227', margin: '10px 0', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px', width: '80%' }}>
                        {selectedEmployee?.nombre || 'Nombre del Empleado'}
                    </h2>
                    <p style={{ fontSize: '18px', color: '#4b5563', margin: '10px 0' }}>
                        Con Documento de Identidad (DNI/Pasaporte): <strong>{selectedEmployee?.dni || 'XXXXXXXX'}</strong>
                    </p>

                    <p style={{ fontSize: '18px', color: '#4b5563', margin: '30px 0', maxWidth: '800px', lineHeight: '1.6' }}>
                        Ha completado satisfactoriamente la Ruta Formativa correspondiente a su <strong>Marco Competencial de {selectedEmployee?.puesto || 'Puesto'}</strong>, demostrando un nivel <strong>{selectedEmployee?.nivel || 'Nivel'}</strong> en el uso seguro, ético y responsable de la Inteligencia Artificial Generativa. Las evidencias de sus misiones y evaluaciones están registradas en el sistema.
                    </p>

                    <div style={{ display: 'flex', gap: '40px', marginTop: '20px', textAlign: 'left', background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#111827' }}>Detalles de la Capacitación:</h4>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '14px' }}>
                                <li><strong>Fecha de Capacitación:</strong> {selectedEmployee?.fechaCapacitacion || 'Pendiente'}</li>
                                <li>Cumplimiento estricto del AI Act Europeo.</li>
                                <li>Aplicación de Políticas Internas de Privacidad de Datos.</li>
                                <li>Resolución de {selectedEmployee?.misiones || 'X'} misiones prácticas en entorno simulado.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: 'auto', paddingTop: '40px' }}>
                        <div style={{ textAlign: 'center', width: '250px' }}>
                            <div style={{ borderBottom: '1px solid #9ca3af', height: '40px', marginBottom: '10px' }}></div>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>Dirección de RRHH</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Acme Corp S.L.</p>
                        </div>

                        {/* Seal */}
                        <div style={{ width: '100px', height: '100px', border: '4px double #c9a227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-15deg)' }}>
                            <div style={{ textAlign: 'center', color: '#c9a227', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }}>
                                Sello de<br />Compliance<br />IA
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', width: '250px' }}>
                            <div style={{ borderBottom: '1px solid #9ca3af', height: '40px', marginBottom: '10px' }}></div>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#111827' }}>Auditoría Tecnológica</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Plataforma THOTH AI</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Nuevo Empleado */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '400px', padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Invitar Empleado</h2>
                        <form onSubmit={handleAddEmployee}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Nombre</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    value={newEmployee.nombre}
                                    onChange={e => setNewEmployee({ ...newEmployee, nombre: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Apellidos</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    value={newEmployee.apellidos}
                                    onChange={e => setNewEmployee({ ...newEmployee, apellidos: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>DNI / Pasaporte</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    value={newEmployee.dni}
                                    onChange={e => setNewEmployee({ ...newEmployee, dni: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    style={{ width: '100%' }}
                                    value={newEmployee.email}
                                    onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Departamento / Puesto</label>
                                <select
                                    className="form-select"
                                    style={{ width: '100%' }}
                                    value={newEmployee.puesto}
                                    onChange={e => setNewEmployee({ ...newEmployee, puesto: e.target.value })}
                                >
                                    <option value="General">General</option>
                                    <option value="Recursos Humanos">Recursos Humanos</option>
                                    <option value="Marketing y Ventas">Marketing y Ventas</option>
                                    <option value="IT y Desarrollo">IT y Desarrollo</option>
                                    <option value="Atención al Cliente">Atención al Cliente</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Invitar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

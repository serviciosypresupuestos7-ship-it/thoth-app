'use client';

import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function WorkerProgresoPage() {
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const certRef = useRef<HTMLDivElement>(null);

    const generateCertificate = async () => {
        if (!certRef.current) return;
        setIsGeneratingPDF(true);

        try {
            certRef.current.style.display = 'block';

            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                backgroundColor: '#ffffff'
            });

            certRef.current.style.display = 'none';

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for certificates
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Certificado_IA_Thoth.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Hubo un error al generar el certificado.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    Tu Progreso 📈
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
                    Sigue tu evolución, revisa tus métricas y descarga tus certificados de competencia.
                </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Puntuación Global</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>850</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Top 15% de la empresa</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Misiones Completadas</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>24</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>+3 esta semana</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏱️</div>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 0.5rem 0' }}>Tiempo de Práctica</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--warning)' }}>12h</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>En el Simulador IA</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Historial */}
                <div className="card">
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Historial de Actividad</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', marginTop: '6px' }}></div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>Misión Completada: Cliente Enfadado</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Puntuación: 95/100. Excelente uso de la empatía.</p>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hace 2 horas</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>Lectura: Guía AI Act</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Documento leído y comprendido.</p>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Ayer</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)', marginTop: '6px' }}></div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0' }}>Certificado Obtenido</h4>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Uso Seguro de IA (Nivel 1)</p>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Hace 1 semana</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificados */}
                <div className="card" style={{ background: 'linear-gradient(145deg, rgba(30, 78, 140, 0.2) 0%, rgba(20, 20, 20, 0.8) 100%)' }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem' }}>Tus Certificados</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h4 style={{ margin: 0 }}>Uso Seguro de IA</h4>
                                <span style={{ fontSize: '1.2rem' }}>🏆</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>Válido hasta: Dic 2026</p>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem' }}
                                onClick={generateCertificate}
                                disabled={isGeneratingPDF}
                            >
                                {isGeneratingPDF ? 'Generando...' : 'Descargar PDF'}
                            </button>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>🔒</span>
                            <h4 style={{ margin: '0.5rem 0', color: 'var(--text-secondary)' }}>Protección de Datos</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Completa 2 misiones más para desbloquear.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden Certificate Template */}
            <div ref={certRef} style={{ display: 'none', width: '1123px', height: '794px', padding: '60px', background: '#ffffff', color: '#000000', fontFamily: 'serif', position: 'relative', border: '20px solid #1e4e8c', boxSizing: 'border-box' }}>
                <div style={{ border: '2px solid #c9a227', height: '100%', padding: '40px', boxSizing: 'border-box', textAlign: 'center', position: 'relative' }}>
                    <h1 style={{ color: '#1e4e8c', fontSize: '48px', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '4px' }}>Certificado de Competencia</h1>
                    <h2 style={{ color: '#666', fontSize: '24px', fontWeight: 'normal', margin: '0 0 60px 0' }}>THOTH AI Platform</h2>

                    <p style={{ fontSize: '20px', color: '#333', margin: '0 0 20px 0' }}>Se certifica que</p>
                    <h3 style={{ fontSize: '42px', color: '#000', margin: '0 0 40px 0', borderBottom: '2px solid #c9a227', display: 'inline-block', paddingBottom: '10px' }}>Usuario Trabajador</h3>

                    <p style={{ fontSize: '20px', color: '#333', margin: '0 0 20px 0' }}>ha completado satisfactoriamente la formación y evaluación práctica en:</p>
                    <h4 style={{ fontSize: '32px', color: '#1e4e8c', margin: '0 0 60px 0' }}>Uso Seguro y Ético de Inteligencia Artificial</h4>

                    <p style={{ fontSize: '16px', color: '#666', maxWidth: '800px', margin: '0 auto 60px auto', lineHeight: '1.6' }}>
                        Demostrando competencia en la aplicación de directrices de seguridad, protección de datos y supervisión humana (HITL) en entornos corporativos, en conformidad con los requisitos de formación del AI Act (Reglamento UE 2024/1689).
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', position: 'absolute', bottom: '40px', left: '60px', right: '60px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '10px' }}></div>
                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>Fecha de Emisión</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                        <div style={{ width: '100px', height: '100px', background: '#f8fafc', border: '2px solid #c9a227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-15deg)' }}>
                            <span style={{ color: '#c9a227', fontWeight: 'bold', fontSize: '14px', textAlign: 'center' }}>SELLO<br />OFICIAL</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #000', width: '200px', marginBottom: '10px' }}></div>
                            <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>ID de Verificación</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>THOTH-CERT-{Date.now().toString().slice(-6)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

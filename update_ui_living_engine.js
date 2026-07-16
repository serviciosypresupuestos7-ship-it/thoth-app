const fs = require('fs');

// 1. Update Dashboard (src/app/(dashboard)/page.tsx)
let dashboardContent = fs.readFileSync('src/app/(dashboard)/page.tsx', 'utf8');

// Clean up domain names
dashboardContent = dashboardContent.replace("'Alfabetización en IA y Normativa'", "'Alfabetización en IA'");
dashboardContent = dashboardContent.replace("'Normativa para Autónomos'", "'Autónomos'");
dashboardContent = dashboardContent.replace("'Normativa Laboral'", "'Laboral'");
dashboardContent = dashboardContent.replace("'Normativa Fiscal y Tributaria'", "'Fiscal'");
dashboardContent = dashboardContent.replace("'Derecho Societario y Mercantil'", "'Mercantil'");
dashboardContent = dashboardContent.replace("'Prevención de Riesgos Laborales'", "'Prevención de Riesgos'");
dashboardContent = dashboardContent.replace("'Protección de Datos (RGPD/LOPDGDD)'", "'Protección de Datos'");

// Add "Descubrimientos recientes" and "Cambios normativos" sections before the domains grid
const newSections = `
      {/* Novedades y Descubrimientos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '3rem' }}>
        {/* Cambios Normativos */}
        <div className="card" style={{ background: 'linear-gradient(145deg, rgba(255, 107, 0, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span> Cambios Normativos
          </h3>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>8</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5rem' }}>Detectados esta semana</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Pendientes de revisar</span>
            <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>3</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Conocimiento actualizado</span>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Hace 2 horas</span>
          </div>
        </div>

        {/* Descubrimientos Recientes */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Descubrimientos Recientes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Nueva Relación Detectada</div>
              <div style={{ color: '#fff' }}>Conexión identificada entre el <strong>Art. 14 del AI Act</strong> y el <strong>Art. 22 del RGPD</strong> sobre decisiones automatizadas.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--success)', marginBottom: '0.25rem' }}>Nueva Guía Oficial</div>
              <div style={{ color: '#fff' }}>Se ha vinculado la nueva <strong>FAQ de la AESIA</strong> a 4 obligaciones ya existentes en el dominio de IA.</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid var(--warning)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--warning)', marginBottom: '0.25rem' }}>Oportunidades Pendientes</div>
              <div style={{ color: '#fff' }}><strong>2 nuevas oportunidades jurídicas</strong> identificadas en la última actualización del Estatuto de los Trabajadores.</div>
            </div>
          </div>
        </div>
      </div>
`;

dashboardContent = dashboardContent.replace('{loading ? (', newSections + '\n      {loading ? (');

// Add "Última actualización" to domain cards
const domainStatsReplacement = `
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', margin: '1rem 0' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Normas Base</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.documents_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fragmentos</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>{domain.chunks_count}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Por Validar</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>{domain.pending_exercises}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aprobado</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{domain.approved_exercises}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Última actualización:</span>
                <span style={{ color: '#fff' }}>Hoy, 08:30</span>
              </div>
`;

dashboardContent = dashboardContent.replace(/<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1\.5rem', margin: '1rem 0' }}>[\s\S]*?<\/div>\s*<\/div>/, domainStatsReplacement);

fs.writeFileSync('src/app/(dashboard)/page.tsx', dashboardContent);


// 2. Update Search (src/app/(dashboard)/search/page.tsx)
let searchContent = fs.readFileSync('src/app/(dashboard)/search/page.tsx', 'utf8');

// Make domain dropdown optional
searchContent = searchContent.replace("const [domain, setDomain] = useState('ai_literacy');", "const [domain, setDomain] = useState('auto');");

const oldSelect = `<select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', minWidth: '200px' }}
                >
                    <option value="ai_literacy">Alfabetización en IA</option>
                    <option value="autonomos">Normativa para Autónomos</option>
                    <option value="laboral">Normativa Laboral</option>
                    <option value="fiscal">Normativa Fiscal y Tributaria</option>
                    <option value="empresa">Derecho Societario y Mercantil</option>
                    <option value="prevencion">Prevención de Riesgos Laborales</option>
                    <option value="proteccion_datos">Protección de Datos (RGPD/LOPDGDD)</option>
                </select>`;

const newSelect = `<select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', minWidth: '200px', background: 'rgba(255,255,255,0.05)' }}
                >
                    <option value="auto">✨ Detección Automática</option>
                    <option disabled>──────────</option>
                    <option value="ai_literacy">Alfabetización en IA</option>
                    <option value="autonomos">Autónomos</option>
                    <option value="laboral">Laboral</option>
                    <option value="fiscal">Fiscal</option>
                    <option value="empresa">Mercantil</option>
                    <option value="prevencion">Prevención de Riesgos</option>
                    <option value="proteccion_datos">Protección de Datos</option>
                </select>`;

searchContent = searchContent.replace(oldSelect, newSelect);
fs.writeFileSync('src/app/(dashboard)/search/page.tsx', searchContent);


// 3. Update Review (src/app/(dashboard)/review/page.tsx)
let reviewContent = fs.readFileSync('src/app/(dashboard)/review/page.tsx', 'utf8');

// Add Tabs
const tabsHTML = `
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <button className="btn" style={{ background: 'transparent', border: 'none', borderBottom: '2px solid var(--primary)', borderRadius: 0, color: 'var(--primary)', padding: '0.5rem 1rem' }}>Obligaciones y Derechos</button>
                <button className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem 1rem' }}>Conceptos Jurídicos</button>
                <button className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem 1rem' }}>Relaciones</button>
                <button className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem 1rem' }}>Oportunidades</button>
                <button className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem 1rem' }}>Cambios</button>
                <button className="btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem 1rem' }}>Knowledge Gaps</button>
            </div>
`;

reviewContent = reviewContent.replace('<div className="review-grid">', tabsHTML + '\n            <div className="review-grid">');

// Transform form to report style
const oldForm = `<div className="form-group">
                                <label className="form-label">Interpretación jurídica</label>
                                <textarea
                                    name="plain_language"
                                    value={formData.plain_language || ''}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Aplicación práctica</label>
                                <input
                                    type="text"
                                    name="task"
                                    value={formData.task || ''}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Riesgos jurídicos</label>
                                <textarea
                                    name="risk"
                                    value={formData.risk || ''}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="form-textarea"
                                />
                            </div>`;

const newForm = `<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Obligaciones</h4>
                                    <textarea
                                        name="plain_language"
                                        value={formData.plain_language || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="form-textarea"
                                        style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                    />
                                </div>

                                <div style={{ borderLeft: '3px solid var(--warning)', paddingLeft: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Riesgos Jurídicos</h4>
                                    <textarea
                                        name="risk"
                                        value={formData.risk || ''}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="form-textarea"
                                        style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                    />
                                </div>

                                <div style={{ borderLeft: '3px solid var(--success)', paddingLeft: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Aplicación Práctica</h4>
                                    <input
                                        type="text"
                                        name="task"
                                        value={formData.task || ''}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                    />
                                </div>

                                <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Conceptos Relacionados</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>Supervisión humana</span>
                                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>Alfabetización en IA</span>
                                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>Riesgo alto</span>
                                    </div>
                                </div>
                                
                                <div style={{ borderLeft: '3px solid #64748b', paddingLeft: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Observaciones del Revisor</h4>
                                    <textarea
                                        placeholder="Añadir notas internas o matices legales..."
                                        rows={2}
                                        className="form-textarea"
                                        style={{ background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.5rem' }}
                                    />
                                </div>
                            </div>`;

reviewContent = reviewContent.replace(oldForm, newForm);
fs.writeFileSync('src/app/(dashboard)/review/page.tsx', reviewContent);

console.log('UI updated successfully!');

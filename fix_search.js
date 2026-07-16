const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/search/page.tsx', 'utf8');

const corruptedForm = `<form onSubmit={handleSearch} className="search-box">
                    style={{ flex: 1, minHeight: '100px', resize: 'vertical' }}
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Consultando Conocimiento...' : 'Consultar'}
                </button>
            </form>`;

const fixedForm = `<form onSubmit={handleSearch} className="search-box">
                <select
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
                </select>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe tu problema detalladamente..."
                    className="form-input"
                    style={{ flex: 1, minHeight: '100px', resize: 'vertical' }}
                />
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Consultando Conocimiento...' : 'Consultar'}
                </button>
            </form>`;

content = content.replace(corruptedForm, fixedForm);
fs.writeFileSync('src/app/(dashboard)/search/page.tsx', content);
console.log('Fixed search page!');

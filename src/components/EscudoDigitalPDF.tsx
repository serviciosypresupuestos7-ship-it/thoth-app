import React from 'react';

interface EscudoDigitalPDFProps {
    nombreEmpresa: string;
    listaBlanca: string;
    listaProhibida: string;
}

export const EscudoDigitalPDF: React.FC<EscudoDigitalPDFProps> = ({ nombreEmpresa, listaBlanca, listaProhibida }) => {
    const empresa = nombreEmpresa || 'La Empresa';
    const hoy = new Date().toLocaleDateString('es-ES');

    const pageStyle = {
        padding: '40px 60px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        background: '#fff',
        fontSize: '11pt',
        lineHeight: '1.6',
        minHeight: '297mm', // A4 height
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
    };

    const h1Style = { fontSize: '24pt', color: '#10a37f', marginBottom: '20px', borderBottom: '3px solid #10a37f', paddingBottom: '10px' };
    const h2Style = { fontSize: '18pt', color: '#2c3e50', marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' };
    const h3Style = { fontSize: '14pt', color: '#34495e', marginTop: '20px', marginBottom: '10px' };
    const pStyle = { marginBottom: '15px', textAlign: 'justify' as const };
    const ulStyle = { marginBottom: '15px', paddingLeft: '20px' };
    const liStyle = { marginBottom: '8px' };

    return (
        <div id="escudo-digital-pdf-content" style={{ background: '#f0f0f0' }}>

            {/* PÁGINA 1: PORTADA */}
            <div style={{ ...pageStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ border: '4px solid #10a37f', padding: '60px', borderRadius: '10px', width: '100%', maxWidth: '800px' }}>
                    <h1 style={{ fontSize: '36pt', color: '#10a37f', marginBottom: '20px', fontWeight: 'bold' }}>ESCUDO DIGITAL</h1>
                    <h2 style={{ fontSize: '24pt', color: '#2c3e50', marginBottom: '40px' }}>Dossier Integral de Cumplimiento y Gobernanza IA</h2>

                    <div style={{ margin: '60px 0', width: '100px', height: '4px', background: '#10a37f', marginInline: 'auto' }}></div>

                    <div style={{ fontSize: '18pt', color: '#34495e', marginBottom: '15px' }}><strong>Entidad Auditada:</strong></div>
                    <div style={{ fontSize: '22pt', color: '#000', marginBottom: '40px', fontWeight: 'bold' }}>{empresa}</div>

                    <div style={{ fontSize: '14pt', color: '#7f8c8d', marginBottom: '10px' }}><strong>Fecha de Emisión:</strong> {hoy}</div>
                    <div style={{ fontSize: '12pt', color: '#95a5a6', marginTop: '40px' }}>Generado por THOTH AI Compliance Platform</div>
                    <div style={{ fontSize: '10pt', color: '#bdc3c7', marginTop: '10px' }}>Documento Confidencial y de Uso Interno</div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 2: ÍNDICE */}
            <div style={pageStyle}>
                <h1 style={h1Style}>Índice de Contenidos</h1>
                <div style={{ fontSize: '14pt', lineHeight: '2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>1. Introducción y Objeto del Dossier</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>2. Marco Jurídico y Contexto Normativo (AI Act & RGPD)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>3. Calendario de Aplicación y Régimen Sancionador</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>4. Alcance y Obligaciones de la Empresa (Rol de Implementador)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>5. Plan Interno de Gobernanza y Control de IA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>6. Política Corporativa de Uso Aceptable de IA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>7. Plan Formativo e Itinerario por Perfiles</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>ANEXO I: Cláusula Legal de Confidencialidad y Uso de IA</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>ANEXO II: Cuestionario Oficial de Evaluación (Nivel 1)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #ccc', marginBottom: '10px' }}>
                        <span>ANEXO III: Jerarquía Normativa y Base de Conocimiento</span>
                    </div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 3: INTRODUCCIÓN Y MARCO JURÍDICO */}
            <div style={pageStyle}>
                <h1 style={h1Style}>1. Introducción y Objeto del Dossier</h1>
                <p style={pStyle}>El presente <strong>Escudo Digital</strong> constituye el documento rector de cumplimiento normativo en materia de Inteligencia Artificial para <strong>{empresa}</strong>. Su objetivo es dotar a la organización de un marco de gobernanza robusto, auditable y alineado con las exigencias legales europeas y nacionales.</p>
                <p style={pStyle}>La adopción de sistemas de IA en el entorno corporativo introduce riesgos significativos en materia de protección de datos, propiedad intelectual, sesgos algorítmicos y responsabilidad civil. Este dossier actúa como prueba documental proactiva (principio de <em>accountability</em>) ante posibles inspecciones de la Agencia Española de Supervisión de la Inteligencia Artificial (AESIA) o la Agencia Española de Protección de Datos (AEPD).</p>

                <h2 style={h2Style}>2. Marco Jurídico y Contexto Normativo</h2>
                <p style={pStyle}>La alfabetización en Inteligencia Artificial ha dejado de ser una recomendación formativa o una estrategia de optimización interna para convertirse en una obligación legal estricta para el tejido empresarial en toda la Unión Europea y, por ende, en España.</p>

                <h3 style={h3Style}>La Norma Europea: El Reglamento de IA (AI Act)</h3>
                <p style={pStyle}>El Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo (conocido de forma global como AI Act), publicado en el Diario Oficial de la UE el 12 de julio de 2024, regula esta materia de forma transversal.</p>
                <p style={pStyle}>La base legal de la alfabetización obligatoria se encuentra estructurada en dos puntos críticos:</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong>Artículo 3, apartado 56 (Definición):</strong> Define la «alfabetización en materia de IA» como las capacidades, los conocimientos y la comprensión necesarios para desplegar sistemas de IA de manera informada, así como para tomar conciencia de sus oportunidades, riesgos y posibles perjuicios.</li>
                    <li style={liStyle}><strong>Artículo 4 (Obligación de alfabetización en materia de IA):</strong> Establece de forma explícita que los proveedores y los responsables del despliegue (denominados implementadores o empresas usuarias) adoptarán medidas para garantizar, en la mayor medida posible, un nivel suficiente de alfabetización en IA entre su personal y otras personas que utilicen o gestionen dichos sistemas en su nombre.</li>
                </ul>

                <h3 style={h3Style}>El Marco de Adaptación en España</h3>
                <p style={pStyle}>Al tratarse de un Reglamento Comunitario, es de aplicación directa en España sin necesidad de una transposición previa. No obstante, el ecosistema regulatorio nacional se apoya en dos pilares ejecutivos:</p>
                <ol style={ulStyle}>
                    <li style={liStyle}><strong>AESIA (Agencia Española de Supervisión de la Inteligencia Artificial):</strong> Es la autoridad nacional encargada de velar por el cumplimiento del AI Act. AESIA tiene plenas competencias para realizar inspecciones, auditar a las empresas, requerir evidencias de formación y tramitar expedientes sancionadores.</li>
                    <li style={liStyle}><strong>Anteproyecto de Ley Orgánica sobre el Uso Adecuado y Gobernanza de la IA:</strong> El marco legislativo español está adaptando el ordenamiento jurídico interno para coordinar las inspecciones de la AESIA con otras normativas preexistentes nacionales (como las inspecciones de Trabajo, la AEPD en materia de protección de datos y los planes de formación bonificada a través de la FUNDAE).</li>
                </ol>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 4: CALENDARIO Y ALCANCE */}
            <div style={pageStyle}>
                <h2 style={h2Style}>3. Calendario de Aplicación y Régimen Sancionador</h2>
                <p style={pStyle}>El despliegue temporal del AI Act es progresivo, pero los plazos relativos a la alfabetización del personal ya se encuentran plenamente activos.</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong>1 de agosto de 2024:</strong> Entrada en vigor del Reglamento.</li>
                    <li style={liStyle}><strong>2 de febrero de 2025:</strong> Obligatoriedad de la Alfabetización (Art. 4). Desde esta fecha, la alfabetización en IA es legalmente exigible a cualquier organización que utilice herramientas algorítmicas o modelos de lenguaje.</li>
                    <li style={liStyle}><strong>2 de agosto de 2026:</strong> Plena capacidad inspectora y sancionadora. La AESIA adquiere la facultad de inspeccionar activamente de oficio y sancionar a las empresas que carezcan de planes formativos contrastables o evidencias documentales.</li>
                    <li style={liStyle}><strong>2 de diciembre de 2027:</strong> Sistemas de Alto Riesgo (Anexo III).</li>
                </ul>

                <div style={{ background: '#fdf2e9', borderLeft: '4px solid #e67e22', padding: '15px', marginTop: '20px', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#d35400' }}>Régimen Económico de Sanciones (Artículo 99)</h4>
                    <p style={{ margin: 0 }}>El incumplimiento del deber de asegurar una alfabetización suficiente e informada del personal se rige bajo un severo esquema de multas coercitivas de hasta <strong>15.000.000 € o el 3% del volumen de negocios global</strong> de la empresa durante el ejercicio anterior (la cuantía que sea mayor). Para Pymes y Startups, las sanciones se modularán bajo criterios de proporcionalidad, pero en ningún caso eximen de la obligación.</p>
                </div>

                <h2 style={h2Style}>4. Alcance y Obligaciones de la Empresa</h2>
                <p style={pStyle}>Existe el error generalizado de asumir que esta ley solo afecta a gigantes tecnológicos o desarrolladores de software de IA. El perímetro de la norma es de carácter universal.</p>
                <p style={pStyle}><strong>Criterio de Aplicación: El Rol de la Empresa</strong></p>
                <p style={pStyle}>El reglamento distingue principalmente entre dos figuras, y ambas están obligadas a alfabetizar a sus equipos (Art. 4):</p>
                <ol style={ulStyle}>
                    <li style={liStyle}><strong>Proveedor (Provider):</strong> Quien desarrolla un sistema de IA o lo introduce en el mercado bajo su propio nombre comercial.</li>
                    <li style={liStyle}><strong>Responsable del despliegue / Implementador (Deployer):</strong> Cualquier empresa, autónomo u organismo público que utilice un sistema de IA bajo su autoridad en el ejercicio de una actividad profesional.</li>
                </ol>
                <p style={{ ...pStyle, fontStyle: 'italic', background: '#f8f9fa', padding: '15px', border: '1px solid #e9ecef' }}>
                    Ejemplo cotidiano: Si una correduría de seguros, un despacho de abogados o una tienda minorista utiliza ChatGPT corporativo para redactar correos, un bot conversacional en su web para atender clientes, o Copilot para resumir actas, esa empresa se convierte automáticamente en Implementador. Está obligada por ley a formar a sus empleados sobre cómo usar esas herramientas de manera segura e informada.
                </p>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 5: PLAN INTERNO Y POLÍTICA */}
            <div style={pageStyle}>
                <h2 style={h2Style}>5. Plan Interno de Gobernanza y Control</h2>
                <p style={pStyle}>Antes de formar, la empresa debe sentar las bases legales e institucionales para que la alfabetización tenga un propósito claro. <strong>{empresa}</strong> establece el siguiente marco de control:</p>

                <h3 style={h3Style}>5.1. El Registro de Sistemas de IA (Inventario Corporativo)</h3>
                <p style={pStyle}>La empresa audita y clasifica cada herramienta. Este inventario documenta qué IA se usa, quién la provee, qué datos procesa y cuál es su nivel de riesgo según el AI Act.</p>

                <h3 style={h3Style}>5.2. La Política de Uso Aceptable (Normativa Interna)</h3>
                <p style={pStyle}>Un documento vinculante que determina las reglas de juego para todos los empleados de <strong>{empresa}</strong>:</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong>Lista Blanca:</strong> Herramientas autorizadas por el departamento de IT. Solo se permite el uso profesional de: <br /><em>{listaBlanca || 'Las definidas por la empresa.'}</em></li>
                    <li style={liStyle}><strong>Protocolo de Inputs Prohibidos:</strong> Prohibición expresa de introducir datos confidenciales en sistemas de IA públicos: <br /><em>{listaProhibida || 'Datos sensibles, personales o secretos comerciales.'}</em></li>
                    <li style={liStyle}><strong>Derecho de Información Laboral:</strong> Cumplimiento del Artículo 64 del Estatuto de los Trabajadores informando a la representación legal de los empleados sobre la implantación de estos sistemas.</li>
                </ul>

                <h2 style={h2Style}>6. Plan Formativo e Itinerario por Perfiles</h2>
                <p style={pStyle}>Los organismos subrayan que la formación debe ser proporcional al puesto. El plan de <strong>{empresa}</strong> se segmenta en tres niveles básicos:</p>
                <ul style={ulStyle}>
                    <li style={liStyle}><strong>Nivel 1: Concienciación General (Toda la plantilla).</strong><br />Duración recomendada: 2 a 4 horas.<br />Contenidos: Qué es y qué no es la IA, el sesgo de automatización, seguridad de la información, alucinaciones y protección de datos básicos.</li>
                    <li style={liStyle}><strong>Nivel 2: Operadores e Implementadores Específicos (Finanzas, Ventas, Marketing, RRHH).</strong><br />Duración recomendada: 10 a 15 horas.<br />Contenidos: Ingeniería de Prompts y Verificación, Propiedad Intelectual, Riesgo sectorial, anonimización avanzada de datos.</li>
                    <li style={liStyle}><strong>Nivel 3: Comité de Control, Legal e IT (Directivos y Responsables).</strong><br />Duración recomendada: 15 a 20 horas.<br />Contenidos: Marco Regulatorio del AI Act, Gestión de Incidentes, Evaluación de Proveedores, auditoría algorítmica.</li>
                </ul>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 6: ANEXO I (CLÁUSULA) */}
            <div style={pageStyle}>
                <h1 style={h1Style}>ANEXO I: Cláusula Legal de Confidencialidad y Uso de IA</h1>
                <p style={pStyle}><em>Esta cláusula debe ser incorporada como un Anexo al Contrato de Trabajo o como una Política de Obligado Cumplimiento anexa al Convenio de la Empresa. Está redactada en base a la legislación española (Estatuto de los Trabajadores, LOPDGDD 3/2018 y Reglamento UE 2024/1689).</em></p>

                <div style={{ border: '1px solid #333', padding: '30px', backgroundColor: '#fff', marginTop: '20px', fontSize: '10pt' }}>
                    <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px', fontSize: '12pt' }}>ANEXO AL CONTRATO DE TRABAJO: REGULACIÓN, CONFIDENCIALIDAD Y BUEN USO DE SISTEMAS DE INTELIGENCIA ARTIFICIAL</h3>
                    <p>En _____________, a _____ de _________________ de 202_.</p>
                    <p><strong>DE UNA PARTE:</strong> D./Dña. _________________________, en nombre y representación de la entidad <strong>{empresa}</strong>, con C.I.F. ____________ (en adelante, la Empresa).</p>
                    <p><strong>DE OTRA PARTE:</strong> D./Dña. _________________________, con D.N.I./NIE ____________ (en adelante, el Trabajador).</p>
                    <p>Ambas partes se reconocen mutuamente capacidad legal suficiente para suscribir el presente documento de obligaciones complementarias, y al efecto:</p>

                    <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>EXPONEN</h4>
                    <p style={{ marginBottom: '10px' }}>Que en cumplimiento del Reglamento (UE) 2024/1689 (Reglamento de Inteligencia Artificial), específicamente su Artículo 4 relativo a la alfabetización obligatoria en materia de IA, así como de la Ley Orgánica 3/2018 (LOPDGDD) y el secreto comercial establecido en la Ley 1/2019, la Empresa ha desarrollado un marco normativo interno para garantizar un uso seguro, ético y legal de las herramientas tecnológicas basadas en algoritmos e Inteligencia Artificial (en adelante, Sistemas de IA).</p>
                    <p style={{ marginBottom: '15px' }}>Por todo ello, las partes acuerdan someterse a las siguientes:</p>

                    <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>CLÁUSULAS</h4>
                    <p style={{ marginBottom: '10px' }}><strong>PRIMERA. Ámbito de Aplicación y Obligación de Alfabetización.</strong><br />El Trabajador declara haber recibido, o comprometerse a realizar en el tiempo de trabajo facilitado por la empresa, las acciones formativas provistas para alcanzar un nivel suficiente de alfabetización en IA. El Trabajador se obliga a utilizar los Sistemas de IA puestos a su disposición de manera informada y con pleno conocimiento de sus riesgos de acuerdo con los manuales internos proporcionados.</p>
                    <p style={{ marginBottom: '10px' }}><strong>SEGUNDA. Limitación de Herramientas Autorizadas ("Lista Blanca").</strong><br />El Trabajador se compromete a utilizar única y exclusivamente aquellos Sistemas de IA que hayan sido formalmente autorizados y desplegados por el departamento de sistemas de la Empresa. Queda expresamente prohibido descargar, instalar o introducir credenciales corporativas en aplicaciones, extensiones de navegador o plataformas web de IA que no estén explícitamente validadas en el inventario interno de la organización. Herramientas autorizadas: {listaBlanca || 'Las definidas por la empresa'}.</p>
                    <p style={{ marginBottom: '10px' }}><strong>TERCERA. Confidencialidad Extrema y Secreto Comercial.</strong><br />Queda estrictamente prohibido introducir, alimentar o entrenar a cualquier Sistema de IA (especialmente aquellos de acceso público o externo) con Datos de Carácter Personal (nombres de clientes, DNI, datos de salud, nóminas, etc.), secretos comerciales de la Empresa, código fuente, estrategias de negocio o información financiera de clientes. Información restringida: {listaProhibida || 'Datos sensibles'}. Cualquier texto o información introducida en un Sistema de IA deberá ser previamente anonimizada o tratada bajo variables abstractas. El incumplimiento de este punto se considerará una vulneración muy grave del deber de buena fe contractual.</p>
                    <p style={{ marginBottom: '10px' }}><strong>CUARTA. Obligación de Supervisión Humana y Mitigación de Errores.</strong><br />El Trabajador reconoce conocer que los Sistemas de IA operan bajo modelos estadísticos predictivos y pueden cometer errores factuales denominados "alucinaciones" o perpetuar "sesgos". Por tanto, el Trabajador asume la obligación inexcusable de revisar y auditar humanamente todo resultado, texto, código o análisis generado por una IA antes de integrarlo en cualquier flujo de trabajo, envío de correos, o entrega a clientes. La IA es una herramienta de asistencia; la responsabilidad de la veracidad y calidad técnica del trabajo sigue recayendo en el Trabajador.</p>
                    <p style={{ marginBottom: '10px' }}><strong>QUINTA. Deber de Notificación de Incidentes.</strong><br />En caso de que el Trabajador detecte un fallo grave de seguridad, un comportamiento discriminatorio, un sesgo evidente hacia un colectivo, o una fuga de datos relacionada con un Sistema de IA dentro del entorno de trabajo, tendrá la obligación de comunicarlo de manera inmediata a través de los canales internos habilitados para su registro ante la AESIA si procediera.</p>
                    <p style={{ marginBottom: '15px' }}><strong>SEXTA. Régimen de Incumplimientos y Sanciones.</strong><br />El incumplimiento voluntario o negligente de las obligaciones recogidas en este documento, en especial la filtración de secretos comerciales por el uso indebido de IA o el desacato a la política de herramientas autorizadas, será sancionado de conformidad con el régimen disciplinario establecido en el Convenio Colectivo aplicable y en el Artículo 54 del Estatuto de los Trabajadores, sin perjuicio de las responsabilidades civiles o penales que de ello se pudiesen derivar.</p>

                    <p style={{ marginBottom: '30px' }}>Y en prueba de conformidad con cuanto antecede, firman el presente documento por duplicado ejemplar y a un solo efecto, en el lugar y fecha arriba indicados.</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', padding: '0 20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #000', width: '200px', height: '60px' }}></div>
                            <div style={{ marginTop: '10px' }}><strong>Fdo.: La Empresa</strong></div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #000', width: '200px', height: '60px' }}></div>
                            <div style={{ marginTop: '10px' }}><strong>Fdo.: El Trabajador</strong></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 7: ANEXO II (CUESTIONARIO) */}
            <div style={pageStyle}>
                <h1 style={h1Style}>ANEXO II: Cuestionario Oficial de Evaluación (Nivel 1)</h1>
                <p style={pStyle}><em>Este test sirve como evidencia documental física ante la AESIA de que el empleado ha comprendido los conceptos básicos de seguridad, sesgos y alucinaciones. Debe ser custodiado por el departamento de RRHH.</em></p>

                <div style={{ border: '2px solid #10a37f', padding: '20px', marginBottom: '30px', borderRadius: '8px', backgroundColor: '#f0fdf4' }}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}><strong>Nombre del Empleado:</strong> <span style={{ borderBottom: '1px solid #333', display: 'inline-block', width: '100%' }}></span></div>
                        <div style={{ width: '150px' }}><strong>DNI/NIE:</strong> <span style={{ borderBottom: '1px solid #333', display: 'inline-block', width: '100%' }}></span></div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}><strong>Departamento:</strong> <span style={{ borderBottom: '1px solid #333', display: 'inline-block', width: '100%' }}></span></div>
                        <div style={{ width: '150px' }}><strong>Fecha:</strong> <span style={{ borderBottom: '1px solid #333', display: 'inline-block', width: '100%' }}></span></div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '10pt' }}>
                    <div>
                        <strong>1. ¿Qué es una "alucinación" en un modelo de Inteligencia Artificial Generativa (como ChatGPT, Copilot o Claude)?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Un error del sistema que hace que el ordenador se apague o se congele.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Cuando la IA genera información que parece completamente coherente y real, pero que es inventada o tácticamente falsa.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Un protocolo de seguridad que se activa cuando detecta un virus.</div>
                    </div>
                    <div>
                        <strong>2. Si una herramienta de IA le proporciona un dato estadístico, una ley o un análisis de mercado para un informe corporativo, ¿qué debe hacer?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Copiarlo y pegarlo directamente, ya que las IA procesan millones de datos y no se equivocan.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Verificar la información y las fuentes de manera manual antes de usarla o enviarla a un cliente.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Descartarlo por completo, ya que la IA nunca acierta en datos numéricos.</div>
                    </div>
                    <div>
                        <strong>3. ¿Qué es el "sesgo de automatización"?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) La velocidad a la que la IA automatiza las tareas de la oficina.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) La tendencia humana a confiar ciegamente en las decisiones o sugerencias de un sistema informático, dejando de lado el propio juicio crítico.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Un fallo técnico que duplica los procesos en segundo plano.</div>
                    </div>
                    <div>
                        <strong>4. Está redactando un informe financiero para un cliente importante. ¿Puede introducir los datos económicos reales de este cliente en una herramienta de IA de acceso público/gratuito para que los resuma?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Sí, siempre que el cliente no se entere.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) No, bajo ningún concepto. Introducir datos confidenciales o personales en modelos públicos vulnera la ley de protección de datos (RGPD) y el secreto comercial.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Sí, porque las versiones gratuitas borran el historial cada 24 horas de forma automática.</div>
                    </div>
                    <div>
                        <strong>5. ¿Qué significa que un sistema de IA tenga un "sesgo"?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Que el sistema funciona más lento de lo habitual debido a la conexión de red.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Que el sistema ofrece resultados sistemáticamente distorsionados o discriminatorios debido a prejuicios presentes en los datos con los que fue entrenado.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Que la herramienta requiere un pago de licencia obligatorio.</div>
                    </div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 8: ANEXO II (CUESTIONARIO CONT.) */}
            <div style={pageStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '10pt' }}>
                    <div>
                        <strong>6. De acuerdo con la Política Interna de la empresa, ¿qué herramientas de IA está autorizado a utilizar en su puesto de trabajo?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Cualquier aplicación o extensión web que encuentre en internet y me ayude a ir más rápido.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Exclusivamente aquellas herramientas que hayan sido auditadas, aprobadas e introducidas formalmente en la "Lista Blanca" por el departamento de IT de la empresa.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Únicamente herramientas desarrolladas en España.</div>
                    </div>
                    <div>
                        <strong>7. Si una IA le ayuda a programar un código de software o a redactar un texto creativo para un cliente, ¿quién es el responsable final del contenido si este infringe derechos de autor o contiene errores graves?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) La empresa desarrolladora de la IA (por ejemplo, OpenAI o Microsoft).</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Nadie, porque los vacíos legales de la IA eximen de responsabilidad.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Usted (como operador) y la empresa (como implementadora), ya que existe la obligación legal de supervisión humana.</div>
                    </div>
                    <div>
                        <strong>8. ¿Cuál es el canal correcto si detecta que un sistema de IA de la empresa está arrojando resultados sospechosos, erróneos o potencialmente discriminatorios?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Ignorarlo y seguir trabajando de forma manual sin avisar a nadie.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Notificarlo de inmediato al Responsable del Plan de IA / Departamento de IT para que registre el incidente y tome medidas.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Publicar una queja en las redes sociales de la herramienta.</div>
                    </div>
                    <div>
                        <strong>9. En relación con el Reglamento Europeo de IA (AI Act), la alfabetización de los empleados en materia de IA es:</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Una recomendación opcional que las empresas pueden ignorar si son pequeñas.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Una obligación legal estricta y exigible para todas las empresas que utilicen sistemas de IA.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Un curso que solo deben realizar los ingenieros informáticos.</div>
                    </div>
                    <div>
                        <strong>10. Al redactar un "prompt" (instrucción de texto) en una IA corporativa, ¿cuál es la mejor práctica de seguridad?</strong>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] a) Darle todos los nombres, DNI y teléfonos de los implicados para que el texto sea lo más preciso posible.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] b) Utilizar instrucciones claras y descriptivas utilizando variables genéricas (ej: "Cliente X", "Empresa Y"), anonimizando por completo cualquier dato sensible.</div>
                        <div style={{ marginLeft: '15px', marginTop: '5px' }}>[ ] c) Escribir frases muy cortas de menos de tres palabras para no saturar el servidor.</div>
                    </div>
                </div>

                <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#34495e', color: '#fff', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1abc9c' }}>Declaración de Conformidad</h4>
                    <p style={{ margin: '0 0 20px 0', fontSize: '9pt' }}>Declaro haber leído y comprendido el material formativo proporcionado por la empresa y que las respuestas a este cuestionario han sido completadas por mí de forma individual.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #fff', width: '200px', height: '40px' }}></div>
                            <div style={{ marginTop: '10px', fontSize: '9pt' }}><strong>Firma del Empleado</strong></div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#eef2f5', borderLeft: '4px solid #10a37f', fontSize: '9pt' }}>
                    <strong>Soluciones para el Evaluador (Uso Exclusivo RRHH):</strong><br />
                    1. b | 2. b | 3. b | 4. b | 5. b | 6. b | 7. c | 8. b | 9. b | 10. b
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* PÁGINA 9: ANEXO III (JERARQUÍA NORMATIVA) */}
            <div style={pageStyle}>
                <h1 style={h1Style}>ANEXO III: Jerarquía Normativa y Base de Conocimiento</h1>
                <p style={pStyle}>El presente dossier y las políticas de <strong>{empresa}</strong> se fundamentan en la siguiente estructura jurídica y técnica, que sirve como base de conocimiento para auditorías:</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderLeft: '4px solid #e74c3c' }}>
                        <h4 style={{ color: '#c0392b', margin: '0 0 10px 0' }}>NIVEL 1. Normativa principal (Obligatoria y Vinculante)</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10pt' }}>
                            <li style={{ marginBottom: '5px' }}><strong>Reglamento (UE) 2024/1689 (AI Act):</strong> Art. 3 (definiciones), Art. 4 (alfabetización), Arts. 13 y 14 (transparencia y supervisión humana), Arts. 16-29 (obligaciones), Capítulo XII (sanciones).</li>
                            <li style={{ marginBottom: '5px' }}><strong>Carta de Derechos Fundamentales de la Unión Europea:</strong> Principios de dignidad, privacidad, igualdad y no discriminación algorítmica.</li>
                            <li><strong>Tratado de Funcionamiento de la Unión Europea.</strong></li>
                        </ul>
                    </div>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderLeft: '4px solid #e67e22' }}>
                        <h4 style={{ color: '#d35400', margin: '0 0 10px 0' }}>NIVEL 2. Reglamentos europeos relacionados</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10pt' }}>
                            <li style={{ marginBottom: '5px' }}><strong>Reglamento General de Protección de Datos (RGPD):</strong> Artículos 5, 6, 9, 13, 14, 22 (decisiones automatizadas), 24, 25, 30, 32, 35 (EIPD).</li>
                            <li style={{ marginBottom: '5px' }}><strong>Directiva NIS2:</strong> Ciberseguridad en infraestructuras críticas.</li>
                            <li style={{ marginBottom: '5px' }}><strong>Data Act & Data Governance Act.</strong></li>
                            <li style={{ marginBottom: '5px' }}><strong>Digital Services Act (DSA) & Digital Markets Act (DMA).</strong></li>
                            <li><strong>Product Liability Directive:</strong> Responsabilidad civil por daños causados por sistemas de IA.</li>
                        </ul>
                    </div>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderLeft: '4px solid #f1c40f' }}>
                        <h4 style={{ color: '#f39c12', margin: '0 0 10px 0' }}>NIVEL 3. Documentación oficial de la Comisión Europea</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10pt' }}>
                            <li style={{ marginBottom: '5px' }}>FAQ oficiales del Artículo 4 sobre Alfabetización.</li>
                            <li style={{ marginBottom: '5px' }}>Guidelines on AI System Definition & Prohibited AI Practices.</li>
                            <li>AI Office Guidance & AI Pact (webinars, documentos, buenas prácticas).</li>
                        </ul>
                    </div>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderLeft: '4px solid #3498db' }}>
                        <h4 style={{ color: '#2980b9', margin: '0 0 10px 0' }}>NIVEL 4. Marco Regulatorio en España</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10pt' }}>
                            <li style={{ marginBottom: '5px' }}><strong>AESIA:</strong> Agencia Española de Supervisión de la Inteligencia Artificial (Criterios de inspección).</li>
                            <li style={{ marginBottom: '5px' }}><strong>AEPD:</strong> Guías sobre IA, decisiones automatizadas y biometría.</li>
                            <li><strong>INCIBE & CCN-CERT:</strong> Guías de Ciberseguridad aplicadas a IA.</li>
                        </ul>
                    </div>

                    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderLeft: '4px solid #9b59b6' }}>
                        <h4 style={{ color: '#8e44ad', margin: '0 0 10px 0' }}>NIVEL 5. Normas Técnicas Internacionales (Compliance)</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '10pt' }}>
                            <li style={{ marginBottom: '5px' }}><strong>ISO/IEC 42001:</strong> Sistema de gestión de Inteligencia Artificial.</li>
                            <li style={{ marginBottom: '5px' }}><strong>ISO 23894:</strong> Gestión de Riesgos en IA.</li>
                            <li style={{ marginBottom: '5px' }}><strong>ISO 27001 & ISO 27701:</strong> Seguridad de la Información y Privacidad.</li>
                            <li><strong>NIST AI Risk Management Framework.</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
};

import React from 'react';

interface DossierPDFProps {
    nombreEmpresa: string;
    listaBlanca: string;
    listaProhibida: string;
}

export const DossierPDF: React.FC<DossierPDFProps> = ({ nombreEmpresa, listaBlanca, listaProhibida }) => {
    const empresa = nombreEmpresa || 'La Empresa';
    const hoy = new Date().toLocaleDateString('es-ES');

    return (
        <div id="dossier-pdf-content" style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#000', background: '#fff', fontSize: '12px', lineHeight: '1.5' }}>

            {/* PORTADA */}
            <div style={{ textAlign: 'center', marginBottom: '100px', marginTop: '100px' }}>
                <h1 style={{ fontSize: '28px', color: '#10a37f', marginBottom: '20px' }}>DOSSIER TÉCNICO DE CUMPLIMIENTO Y GOBERNANZA IA</h1>
                <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '40px' }}>Alfabetización Obligatoria en IA para Empresas</h2>
                <div style={{ fontSize: '16px', color: '#555', marginBottom: '10px' }}><strong>Entidad:</strong> {empresa}</div>
                <div style={{ fontSize: '14px', color: '#777', marginBottom: '10px' }}><strong>Fecha de emisión:</strong> {hoy}</div>
                <div style={{ fontSize: '14px', color: '#777' }}><strong>Generado por:</strong> THOTH AI Compliance Platform</div>
            </div>

            <div className="html2pdf__page-break"></div>

            {/* SECCIÓN 1 */}
            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>1. Marco Jurídico y Contexto Normativo</h2>
            <p>La alfabetización en Inteligencia Artificial ha dejado de ser una recomendación formativa o una estrategia de optimización interna para convertirse en una obligación legal estricta para el tejido empresarial en toda la Unión Europea y, por ende, en España.</p>

            <h3 style={{ color: '#333' }}>La Norma Europea: El Reglamento de IA (AI Act)</h3>
            <p>El Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo (conocido de forma global como AI Act), publicado en el Diario Oficial de la UE el 12 de julio de 2024, regula esta materia de forma transversal.</p>
            <p>La base legal de la alfabetización obligatoria se encuentra estructurada en dos puntos críticos:</p>
            <ul>
                <li><strong>Artículo 3, apartado 56 (Definición):</strong> Define la «alfabetización en materia de IA» como las capacidades, los conocimientos y la comprensión necesarios para desplegar sistemas de IA de manera informada, así como para tomar conciencia de sus oportunidades, riesgos y posibles perjuicios.</li>
                <li><strong>Artículo 4 (Obligación de alfabetización en materia de IA):</strong> Establece de forma explícita que los proveedores y los responsables del despliegue (denominados implementadores o empresas usuarias) adoptarán medidas para garantizar, en la mayor medida posible, un nivel suficiente de alfabetización en IA entre su personal y otras personas que utilicen o gestionen dichos sistemas en su nombre.</li>
            </ul>

            <h3 style={{ color: '#333' }}>El Marco de Adaptación en España</h3>
            <p>Al tratarse de un Reglamento Comunitario, es de aplicación directa en España sin necesidad de una transposición previa. No obstante, el ecosistema regulatorio nacional se apoya en dos pilares ejecutivos:</p>
            <ol>
                <li><strong>AESIA (Agencia Española de Supervisión de la Inteligencia Artificial):</strong> Es la autoridad nacional encargada de velar por el cumplimiento del AI Act. AESIA tiene plenas competencias para realizar inspecciones, auditar a las empresas, requerir evidencias de formación y tramitar expedientes sancionadores.</li>
                <li><strong>Anteproyecto de Ley Orgánica sobre el Uso Adecuado y Gobernanza de la IA:</strong> El marco legislativo español está adaptando el ordenamiento jurídico interno para coordinar las inspecciones de la AESIA con otras normativas preexistentes nacionales (como las inspecciones de Trabajo, la AEPD en materia de protección de datos y los planes de formación bonificada a través de la FUNDAE).</li>
            </ol>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px', marginTop: '30px' }}>2. Calendario de Aplicación y Régimen Sancionador</h2>
            <p>El despliegue temporal del AI Act es progresivo, pero los plazos relativos a la alfabetización del personal ya se encuentran plenamente activos.</p>
            <ul>
                <li><strong>1 de agosto de 2024:</strong> Entrada en vigor del Reglamento.</li>
                <li><strong>2 de febrero de 2025:</strong> Obligatoriedad de la Alfabetización (Art. 4). Desde esta fecha, la alfabetización en IA es legalmente exigible a cualquier organización que utilice herramientas algorítmicas o modelos de lenguaje.</li>
                <li><strong>2 de agosto de 2026:</strong> Plena capacidad inspectora y sancionadora. La AESIA adquiere la facultad de inspeccionar activamente de oficio y sancionar a las empresas que carezcan de planes formativos contrastables o evidencias documentales.</li>
                <li><strong>2 de diciembre de 2027:</strong> Sistemas de Alto Riesgo (Anexo III).</li>
            </ul>
            <p><strong>Régimen Económico de Sanciones (Artículo 99):</strong> El incumplimiento del deber de asegurar una alfabetización suficiente e informada del personal se rige bajo un severo esquema de multas coercitivas de hasta 15.000.000 € o el 3% del volumen de negocios global de la empresa durante el ejercicio anterior (la cuantía que sea mayor). Para Pymes y Startups, las sanciones se modularán bajo criterios de proporcionalidad.</p>

            <div className="html2pdf__page-break"></div>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>3. ¿A qué empresas afecta y bajo qué alcance?</h2>
            <p>Existe el error generalizado de asumir que esta ley solo afecta a gigantes tecnológicos o desarrolladores de software de IA. El perímetro de la norma es de carácter universal.</p>
            <p><strong>Criterio de Aplicación: El Rol de la Empresa</strong></p>
            <p>El reglamento distingue principalmente entre dos figuras, y ambas están obligadas a alfabetizar a sus equipos (Art. 4):</p>
            <ol>
                <li><strong>Proveedor (Provider):</strong> Quien desarrolla un sistema de IA o lo introduce en el mercado bajo su propio nombre comercial.</li>
                <li><strong>Responsable del despliegue / Implementador (Deployer):</strong> Cualquier empresa, autónomo u organismo público que utilice un sistema de IA bajo su autoridad en el ejercicio de una actividad profesional.</li>
            </ol>
            <p><em>Ejemplo cotidiano: Si una correduría de seguros, un despacho de abogados o una tienda minorista utiliza ChatGPT corporativo para redactar correos, un bot conversacional en su web para atender clientes, o Copilot para resumir actas, esa empresa se convierte automáticamente en Implementador. Está obligada por ley a formar a sus empleados sobre cómo usar esas herramientas de manera segura e informada.</em></p>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px', marginTop: '30px' }}>4. El Plan Interno de Gobernanza y Control</h2>
            <p>Antes de formar, la empresa debe sentar las bases legales e institucionales para que la alfabetización tenga un propósito claro.</p>

            <h3 style={{ color: '#333' }}>1. El Registro de Sistemas de IA (Inventario Corporativo)</h3>
            <p>La empresa debe auditar y clasificar cada herramienta. Este inventario debe documentar qué IA se usa, quién la provee, qué datos procesa y cuál es su nivel de riesgo según el AI Act.</p>

            <h3 style={{ color: '#333' }}>2. La Política de Uso Aceptable (Normativa Interna)</h3>
            <p>Un documento vinculante firmado por el personal que determine las reglas de juego:</p>
            <ul>
                <li><strong>Lista Blanca:</strong> Herramientas autorizadas por el departamento de IT: <em>{listaBlanca || 'Las definidas por la empresa.'}</em></li>
                <li><strong>Protocolo de Inputs:</strong> Prohibición expresa de introducir datos confidenciales: <em>{listaProhibida || 'Datos sensibles.'}</em></li>
                <li><strong>Derecho de Información Laboral:</strong> Cumplir con el Artículo 64 del Estatuto de los Trabajadores informando a la representación legal de los empleados sobre la implantación de estos sistemas.</li>
            </ul>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px', marginTop: '30px' }}>5. El Plan Formativo (Itinerario por Perfiles)</h2>
            <p>Los organismos subrayan que la formación debe ser proporcional al puesto. El plan debe segmentarse en tres niveles básicos:</p>
            <ul>
                <li><strong>Nivel 1: Concienciación General (Toda la plantilla).</strong> Duración recomendada: 2 a 4 horas. Contenidos: Qué es y qué no es la IA, el sesgo de automatización, seguridad de la información.</li>
                <li><strong>Nivel 2: Operadores e Implementadores Específicos (Finanzas, Ventas, Marketing, RRHH).</strong> Duración recomendada: 10 a 15 horas. Contenidos: Ingeniería de Prompts y Verificación, Propiedad Intelectual, Riesgo sectorial.</li>
                <li><strong>Nivel 3: Comité de Control, Legal e IT (Directivos y Responsables).</strong> Duración recomendada: 15 a 20 horas. Contenidos: Marco Regulatorio del AI Act, Gestión de Incidentes, Evaluación de Proveedores.</li>
            </ul>

            <div className="html2pdf__page-break"></div>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>ANEXO I: Cláusula Legal de Confidencialidad y Uso de IA</h2>
            <p><em>Esta cláusula puede ser incorporada como un Anexo al Contrato de Trabajo o como una Política de Obligado Cumplimiento anexa al Convenio de la Empresa. Está redactada en base a la legislación española (Estatuto de los Trabajadores, LOPDGDD 3/2018 y Reglamento UE 2024/1689).</em></p>

            <div style={{ border: '1px solid #ccc', padding: '20px', backgroundColor: '#f9f9f9', marginTop: '20px' }}>
                <h3 style={{ textAlign: 'center', marginTop: 0 }}>ANEXO AL CONTRATO DE TRABAJO: REGULACIÓN, CONFIDENCIALIDAD Y BUEN USO DE SISTEMAS DE INTELIGENCIA ARTIFICIAL</h3>
                <p>En _____________, a _____ de _________________ de 202_.</p>
                <p><strong>DE UNA PARTE:</strong> D./Dña. _________________________, en nombre y representación de la entidad <strong>{empresa}</strong>, con C.I.F. ____________ (en adelante, la Empresa).</p>
                <p><strong>DE OTRA PARTE:</strong> D./Dña. _________________________, con D.N.I./NIE ____________ (en adelante, el Trabajador).</p>
                <p>Ambas partes se reconocen mutuamente capacidad legal suficiente para suscribir el presente documento de obligaciones complementarias, y al efecto:</p>
                <h4>EXPONEN</h4>
                <p>Que en cumplimiento del Reglamento (UE) 2024/1689 (Reglamento de Inteligencia Artificial), específicamente su Artículo 4 relativo a la alfabetización obligatoria en materia de IA, así como de la Ley Orgánica 3/2018 (LOPDGDD) y el secreto comercial establecido en la Ley 1/2019, la Empresa ha desarrollado un marco normativo interno para garantizar un uso seguro, ético y legal de las herramientas tecnológicas basadas en algoritmos e Inteligencia Artificial (en adelante, Sistemas de IA).</p>
                <p>Por todo ello, las partes acuerdan someterse a las siguientes:</p>
                <h4>CLÁUSULAS</h4>
                <p><strong>PRIMERA. Ámbito de Aplicación y Obligación de Alfabetización.</strong><br />El Trabajador declara haber recibido, o comprometerse a realizar en el tiempo de trabajo facilitado por la empresa, las acciones formativas provistas para alcanzar un nivel suficiente de alfabetización en IA. El Trabajador se obliga a utilizar los Sistemas de IA puestos a su disposición de manera informada y con pleno conocimiento de sus riesgos de acuerdo con los manuales internos proporcionados.</p>
                <p><strong>SEGUNDA. Limitación de Herramientas Autorizadas ("Lista Blanca").</strong><br />El Trabajador se compromete a utilizar única y exclusivamente aquellos Sistemas de IA que hayan sido formalmente autorizados y desplegados por el departamento de sistemas de la Empresa. Queda expresamente prohibido descargar, instalar o introducir credenciales corporativas en aplicaciones, extensiones de navegador o plataformas web de IA que no estén explícitamente validadas en el inventario interno de la organización. Herramientas autorizadas: {listaBlanca || 'Las definidas por la empresa'}.</p>
                <p><strong>TERCERA. Confidencialidad Extrema y Secreto Comercial.</strong><br />Queda estrictamente prohibido introducir, alimentar o entrenar a cualquier Sistema de IA (especialmente aquellos de acceso público o externo) con Datos de Carácter Personal (nombres de clientes, DNI, datos de salud, nóminas, etc.), secretos comerciales de la Empresa, código fuente, estrategias de negocio o información financiera de clientes. Información restringida: {listaProhibida || 'Datos sensibles'}. Cualquier texto o información introducida en un Sistema de IA deberá ser previamente anonimizada o tratada bajo variables abstractas. El incumplimiento de este punto se considerará una vulneración muy grave del deber de buena fe contractual.</p>
                <p><strong>CUARTA. Obligación de Supervisión Humana y Mitigación de Errores.</strong><br />El Trabajador reconoce conocer que los Sistemas de IA operan bajo modelos estadísticos predictivos y pueden cometer errores factuales denominados "alucinaciones" o perpetuar "sesgos". Por tanto, el Trabajador asume la obligación inexcusable de revisar y auditar humanamente todo resultado, texto, código o análisis generado por una IA antes de integrarlo en cualquier flujo de trabajo, envío de correos, o entrega a clientes. La IA es una herramienta de asistencia; la responsabilidad de la veracidad y calidad técnica del trabajo sigue recayendo en el Trabajador.</p>
                <p><strong>QUINTA. Deber de Notificación de Incidentes.</strong><br />En caso de que el Trabajador detecte un fallo grave de seguridad, un comportamiento discriminatorio, un sesgo evidente hacia un colectivo, o una fuga de datos relacionada con un Sistema de IA dentro del entorno de trabajo, tendrá la obligación de comunicarlo de manera inmediata a través de los canales internos habilitados para su registro ante la AESIA si procediera.</p>
                <p><strong>SEXTA. Régimen de Incumplimientos y Sanciones.</strong><br />El incumplimiento voluntario o negligente de las obligaciones recogidas en este documento, en especial la filtración de secretos comerciales por el uso indebido de IA o el desacato a la política de herramientas autorizadas, será sancionado de conformidad con el régimen disciplinario establecido en el Convenio Colectivo aplicable y en el Artículo 54 del Estatuto de los Trabajadores, sin perjuicio de las responsabilidades civiles o penales que de ello se pudiesen derivar.</p>
                <p>Y en prueba de conformidad con cuanto antecede, firman el presente documento por duplicado ejemplar y a un solo efecto, en el lugar y fecha arriba indicados.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <div><strong>Fdo.: La Empresa</strong></div>
                    <div><strong>Fdo.: El Trabajador</strong></div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>ANEXO II: Cuestionario de Evaluación de Alfabetización en IA (Nivel 1)</h2>
            <p><em>Este test sirve como evidencia documental ante la AESIA de que el empleado ha comprendido los conceptos básicos de seguridad, sesgos y alucinaciones.</em></p>

            <div style={{ marginBottom: '20px' }}>
                <p><strong>Nombre del Empleado:</strong> ________________________________________</p>
                <p><strong>Fecha:</strong> ___/___/202_</p>
                <p><strong>Departamento:</strong> ____________________________________</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <strong>1. ¿Qué es una "alucinación" en un modelo de Inteligencia Artificial Generativa (como ChatGPT, Copilot o Claude)?</strong>
                    <div>a) Un error del sistema que hace que el ordenador se apague o se congele.</div>
                    <div>b) Cuando la IA genera información que parece completamente coherente y real, pero que es inventada o tácticamente falsa.</div>
                    <div>c) Un protocolo de seguridad que se activa cuando detecta un virus.</div>
                </div>
                <div>
                    <strong>2. Si una herramienta de IA le proporciona un dato estadístico, una ley o un análisis de mercado para un informe corporativo, ¿qué debe hacer?</strong>
                    <div>a) Copiarlo y pegarlo directamente, ya que las IA procesan millones de datos y no se equivocan.</div>
                    <div>b) Verificar la información y las fuentes de manera manual antes de usarla o enviarla a un cliente.</div>
                    <div>c) Descartarlo por completo, ya que la IA nunca acierta en datos numéricos.</div>
                </div>
                <div>
                    <strong>3. ¿Qué es el "sesgo de automatización"?</strong>
                    <div>a) La velocidad a la que la IA automatiza las tareas de la oficina.</div>
                    <div>b) La tendencia humana a confiar ciegamente en las decisiones o sugerencias de un sistema informático, dejando de lado el propio juicio crítico.</div>
                    <div>c) Un fallo técnico que duplica los procesos en segundo plano.</div>
                </div>
                <div>
                    <strong>4. Está redactando un informe financiero para un cliente importante. ¿Puede introducir los datos económicos reales de este cliente en una herramienta de IA de acceso público/gratuito para que los resuma?</strong>
                    <div>a) Sí, siempre que el cliente no se entere.</div>
                    <div>b) No, bajo ningún concepto. Introducir datos confidenciales o personales en modelos públicos vulnera la ley de protección de datos (RGPD) y el secreto comercial.</div>
                    <div>c) Sí, porque las versiones gratuitas borran el historial cada 24 horas de forma automática.</div>
                </div>
                <div>
                    <strong>5. ¿Qué significa que un sistema de IA tenga un "sesgo"?</strong>
                    <div>a) Que el sistema funciona más lento de lo habitual debido a la conexión de red.</div>
                    <div>b) Que el sistema ofrece resultados sistemáticamente distorsionados o discriminatorios debido a prejuicios presentes en los datos con los que fue entrenado.</div>
                    <div>c) Que la herramienta requiere un pago de licencia obligatorio.</div>
                </div>
                <div>
                    <strong>6. De acuerdo con la Política Interna de la empresa, ¿qué herramientas de IA está autorizado a utilizar en su puesto de trabajo?</strong>
                    <div>a) Cualquier aplicación o extensión web que encuentre en internet y me ayude a ir más rápido.</div>
                    <div>b) Exclusivamente aquellas herramientas que hayan sido auditadas, aprobadas e introducidas formalmente en la "Lista Blanca" por el departamento de IT de la empresa.</div>
                    <div>c) Únicamente herramientas desarrolladas en España.</div>
                </div>
                <div>
                    <strong>7. Si una IA le ayuda a programar un código de software o a redactar un texto creativo para un cliente, ¿quién es el responsable final del contenido si este infringe derechos de autor o contiene errores graves?</strong>
                    <div>a) La empresa desarrolladora de la IA (por ejemplo, OpenAI o Microsoft).</div>
                    <div>b) Nadie, porque los vacíos legales de la IA eximen de responsabilidad.</div>
                    <div>c) Usted (como operador) y la empresa (como implementadora), ya que existe la obligación legal de supervisión humana.</div>
                </div>
                <div>
                    <strong>8. ¿Cuál es el canal correcto si detecta que un sistema de IA de la empresa está arrojando resultados sospechosos, erróneos o potencialmente discriminatorios?</strong>
                    <div>a) Ignorarlo y seguir trabajando de forma manual sin avisar a nadie.</div>
                    <div>b) Notificarlo de inmediato al Responsable del Plan de IA / Departamento de IT para que registre el incidente y tome medidas.</div>
                    <div>c) Publicar una queja en las redes sociales de la herramienta.</div>
                </div>
                <div>
                    <strong>9. En relación con el Reglamento Europeo de IA (AI Act), la alfabetización de los empleados en materia de IA es:</strong>
                    <div>a) Una recomendación opcional que las empresas pueden ignorar si son pequeñas.</div>
                    <div>b) Una obligación legal estricta y exigible para todas las empresas que utilicen sistemas de IA.</div>
                    <div>c) Un curso que solo deben realizar los ingenieros informáticos.</div>
                </div>
                <div>
                    <strong>10. Al redactar un "prompt" (instrucción de texto) en una IA corporativa, ¿cuál es la mejor práctica de seguridad?</strong>
                    <div>a) Darle todos los nombres, DNI y teléfonos de los implicados para que el texto sea lo más preciso posible.</div>
                    <div>b) Utilizar instrucciones claras y descriptivas utilizando variables genéricas (ej: "Cliente X", "Empresa Y"), anonimizando por completo cualquier dato sensible.</div>
                    <div>c) Escribir frases muy cortas de menos de tres palabras para no saturar el servidor.</div>
                </div>
            </div>

            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#eef2f5', borderLeft: '4px solid #10a37f' }}>
                <strong>Soluciones para el Evaluador (Gobernanza Interna):</strong><br />
                1. b | 2. b | 3. b | 4. b | 5. b | 6. b | 7. c | 8. b | 9. b | 10. b
            </div>

            <div className="html2pdf__page-break"></div>

            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>ANEXO III: Jerarquía Normativa (Base de Conocimiento)</h2>
            <p>La plataforma THOTH y el presente dossier se fundamentan en la siguiente estructura jurídica y técnica:</p>

            <h4 style={{ color: '#333', marginBottom: '5px' }}>NIVEL 1. Normativa principal (obligatoria)</h4>
            <ul style={{ marginTop: 0 }}>
                <li>Reglamento (UE) 2024/1689 (AI Act): Art. 3 (definiciones), Art. 4 (alfabetización), Arts. 13 y 14 (transparencia y supervisión humana), Arts. 16-29 (obligaciones), Capítulo XII (sanciones).</li>
                <li>Carta de Derechos Fundamentales de la Unión Europea (dignidad, privacidad, igualdad, no discriminación).</li>
                <li>Tratado de Funcionamiento de la Unión Europea.</li>
            </ul>

            <h4 style={{ color: '#333', marginBottom: '5px' }}>NIVEL 2. Reglamentos europeos relacionados</h4>
            <ul style={{ marginTop: 0 }}>
                <li>Reglamento General de Protección de Datos (RGPD): Artículos 5, 6, 9, 13, 14, 22, 24, 25, 30, 32, 35.</li>
                <li>Directiva NIS2 (Ciberseguridad).</li>
                <li>Data Act & Data Governance Act.</li>
                <li>Digital Services Act (DSA) & Digital Markets Act (DMA).</li>
                <li>ePrivacy & Reglamento eIDAS 2.</li>
                <li>Product Liability Directive (Responsabilidad por daños de IA).</li>
            </ul>

            <h4 style={{ color: '#333', marginBottom: '5px' }}>NIVEL 3. Documentación oficial de la Comisión Europea</h4>
            <ul style={{ marginTop: 0 }}>
                <li>FAQ oficiales del Artículo 4.</li>
                <li>Guidelines on AI System Definition & Prohibited AI Practices.</li>
                <li>AI Office Guidance & AI Pact (webinars, documentos, buenas prácticas).</li>
                <li>Living Repository on AI Literacy.</li>
            </ul>

            <h4 style={{ color: '#333', marginBottom: '5px' }}>NIVEL 4. España</h4>
            <ul style={{ marginTop: 0 }}>
                <li>AESIA (Agencia Española de Supervisión de la Inteligencia Artificial): Preguntas frecuentes, guías, criterios.</li>
                <li>AEPD (Agencia Española de Protección de Datos): Guías sobre IA, decisiones automatizadas, biometría.</li>
                <li>INCIBE & CCN-CERT (Ciberseguridad).</li>
            </ul>

            <h4 style={{ color: '#333', marginBottom: '5px' }}>NIVEL 5. Normas técnicas internacionales</h4>
            <ul style={{ marginTop: 0 }}>
                <li>ISO/IEC 42001 (Sistema de gestión de IA), ISO 23894 (Riesgos), ISO 27001 (Seguridad), ISO 27701 (Privacidad).</li>
                <li>NIST AI Risk Management Framework.</li>
                <li>OECD AI Principles & UNESCO Recommendation on the Ethics of AI.</li>
            </ul>

        </div>
    );
};

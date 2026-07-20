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



            <h2 style={{ color: '#10a37f', borderBottom: '2px solid #10a37f', paddingBottom: '5px' }}>ANEXO I: Jerarquía Normativa (Base de Conocimiento)</h2>
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

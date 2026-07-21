import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts for a premium look
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2', fontWeight: 700 }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontFamily: 'Inter',
        backgroundColor: '#ffffff',
    },
    coverPage: {
        padding: 50,
        fontFamily: 'Inter',
        backgroundColor: '#0f172a', // Dark premium background
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    coverTitle: {
        fontSize: 42,
        fontWeight: 700,
        color: '#10b981', // Emerald green
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    coverSubtitle: {
        fontSize: 24,
        fontWeight: 400,
        color: '#94a3b8',
        marginBottom: 60,
    },
    coverLine: {
        width: 100,
        height: 4,
        backgroundColor: '#10b981',
        marginBottom: 60,
    },
    coverLabel: {
        fontSize: 12,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    coverValue: {
        fontSize: 20,
        fontWeight: 600,
        color: '#ffffff',
        marginBottom: 30,
    },
    header: {
        fontSize: 10,
        color: '#94a3b8',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        fontSize: 10,
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    h1: {
        fontSize: 24,
        fontWeight: 700,
        color: '#0f172a',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#10b981',
        paddingBottom: 8,
    },
    h2: {
        fontSize: 16,
        fontWeight: 600,
        color: '#1e293b',
        marginTop: 20,
        marginBottom: 12,
    },
    h3: {
        fontSize: 12,
        fontWeight: 600,
        color: '#334155',
        marginTop: 15,
        marginBottom: 8,
    },
    text: {
        fontSize: 10,
        color: '#475569',
        lineHeight: 1.6,
        marginBottom: 10,
        textAlign: 'justify',
    },
    bulletPoint: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 10,
    },
    bullet: {
        width: 15,
        fontSize: 10,
        color: '#10b981',
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#475569',
        lineHeight: 1.5,
    },
    highlightBox: {
        backgroundColor: '#f8fafc',
        borderLeftWidth: 4,
        borderLeftColor: '#10b981',
        padding: 15,
        marginTop: 15,
        marginBottom: 15,
    },
    warningBox: {
        backgroundColor: '#fff7ed',
        borderLeftWidth: 4,
        borderLeftColor: '#f97316',
        padding: 15,
        marginTop: 15,
        marginBottom: 15,
    },
    clauseBox: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        padding: 20,
        marginTop: 20,
    },
    signatureBlock: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
    },
    signatureLine: {
        width: 200,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
    },
    signatureText: {
        fontSize: 10,
        fontWeight: 600,
        color: '#0f172a',
    }
});

interface Props {
    nombreEmpresa: string;
    listaBlanca: string;
    listaProhibida: string;
    selectedChapters: string[];
}

export const EscudoDigitalPDFDocument: React.FC<Props> = ({ nombreEmpresa, listaBlanca, listaProhibida, selectedChapters }) => {
    const empresa = nombreEmpresa || 'La Empresa';
    const hoy = new Date().toLocaleDateString('es-ES');

    const Header = () => (
        <View style={styles.header} fixed>
            <Text>ESCUDO DIGITAL - DOSSIER DE CUMPLIMIENTO IA</Text>
            <Text>{empresa}</Text>
        </View>
    );

    const Footer = () => (
        <View style={styles.footer} fixed>
            <Text>Generado por THOTH AI Platform</Text>
            <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
    );

    return (
        <Document>
            {/* PORTADA */}
            <Page size="A4" style={styles.coverPage}>
                <Text style={styles.coverTitle}>ESCUDO DIGITAL</Text>
                <Text style={styles.coverSubtitle}>Dossier Integral de Cumplimiento y Gobernanza IA</Text>

                <View style={styles.coverLine} />

                <Text style={styles.coverLabel}>Entidad Auditada</Text>
                <Text style={styles.coverValue}>{empresa}</Text>

                <Text style={styles.coverLabel}>Fecha de Emisión</Text>
                <Text style={styles.coverValue}>{hoy}</Text>

                <View style={{ position: 'absolute', bottom: 50, left: 50 }}>
                    <Text style={{ fontSize: 10, color: '#475569' }}>Documento Confidencial y de Uso Interno</Text>
                    <Text style={{ fontSize: 10, color: '#475569', marginTop: 5 }}>THOTH AI Compliance Platform</Text>
                </View>
            </Page>

            {/* ÍNDICE */}
            <Page size="A4" style={styles.page}>
                <Header />
                <Text style={styles.h1}>Índice de Contenidos</Text>

                <View style={{ marginTop: 20 }}>
                    {[
                        { id: 'intro', text: '1. Introducción y Objeto del Dossier' },
                        { id: 'marco', text: '2. Marco Jurídico y Contexto Normativo (AI Act & RGPD)' },
                        { id: 'calendario', text: '3. Calendario de Aplicación y Régimen Sancionador' },
                        { id: 'alcance', text: '4. Alcance y Obligaciones de la Empresa (Rol de Implementador)' },
                        { id: 'plan', text: '5. Plan Interno de Gobernanza y Control de IA' },
                        { id: 'formativo', text: '6. Plan Formativo e Itinerario por Perfiles' },
                        { id: 'resumen', text: '7. Resumen del Curso de Cualificación' },
                        { id: 'certificacion', text: '8. Certificados de Cualificación de Empleados' },
                        { id: 'anexo1', text: 'ANEXO I: Cláusula Legal de Confidencialidad y Uso de IA' },
                    ].filter(item => selectedChapters.includes(item.id)).map((item, i) => (
                        <View key={i} style={{ flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', borderBottomStyle: 'dashed', paddingBottom: 5 }}>
                            <Text style={{ fontSize: 12, color: '#334155' }}>{item.text}</Text>
                        </View>
                    ))}
                </View>
                <Footer />
            </Page>

            {/* SECCIÓN 1 Y 2 */}
            {(selectedChapters.includes('intro') || selectedChapters.includes('marco')) && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    {selectedChapters.includes('intro') && (
                        <>
                            <Text style={styles.h1}>1. Introducción y Objeto del Dossier</Text>
                            <Text style={styles.text}>
                                El presente Escudo Digital constituye el documento rector de cumplimiento normativo en materia de Inteligencia Artificial para {empresa}. Su objetivo es dotar a la organización de un marco de gobernanza robusto, auditable y alineado con las exigencias legales europeas y nacionales.
                            </Text>
                            <Text style={styles.text}>
                                La adopción de sistemas de IA en el entorno corporativo introduce riesgos significativos en materia de protección de datos, propiedad intelectual, sesgos algorítmicos y responsabilidad civil. Este dossier actúa como prueba documental proactiva (principio de accountability) ante posibles inspecciones de la Agencia Española de Supervisión de la Inteligencia Artificial (AESIA) o la Agencia Española de Protección de Datos (AEPD).
                            </Text>
                        </>
                    )}

                    {selectedChapters.includes('marco') && (
                        <>
                            <Text style={styles.h1}>2. Marco Jurídico y Contexto Normativo</Text>
                            <Text style={styles.text}>
                                La alfabetización en Inteligencia Artificial ha dejado de ser una recomendación formativa o una estrategia de optimización interna para convertirse en una obligación legal estricta para el tejido empresarial en toda la Unión Europea y, por ende, en España.
                            </Text>

                            <Text style={styles.h2}>La Norma Europea: El Reglamento de IA (AI Act)</Text>
                            <Text style={styles.text}>
                                El Reglamento (UE) 2024/1689 del Parlamento Europeo y del Consejo (conocido de forma global como AI Act), publicado en el Diario Oficial de la UE el 12 de julio de 2024, regula esta materia de forma transversal. La base legal de la alfabetización obligatoria se encuentra estructurada en dos puntos críticos:
                            </Text>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Artículo 3, apartado 56 (Definición):</Text> Define la «alfabetización en materia de IA» como las capacidades, los conocimientos y la comprensión necesarios para desplegar sistemas de IA de manera informada, así como para tomar conciencia de sus oportunidades, riesgos y posibles perjuicios.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Artículo 4 (Obligación de alfabetización en materia de IA):</Text> Establece de forma explícita que los proveedores y los responsables del despliegue (denominados implementadores o empresas usuarias) adoptarán medidas para garantizar, en la mayor medida posible, un nivel suficiente de alfabetización en IA entre su personal y otras personas que utilicen o gestionen dichos sistemas en su nombre.</Text>
                            </View>

                            <View style={styles.highlightBox}>
                                <Text style={styles.h3}>El Marco de Adaptación en España</Text>
                                <Text style={styles.text}>
                                    Al tratarse de un Reglamento Comunitario, es de aplicación directa en España sin necesidad de una transposición previa. No obstante, el ecosistema regulatorio nacional se apoya en la AESIA (Agencia Española de Supervisión de la Inteligencia Artificial), autoridad nacional encargada de velar por el cumplimiento del AI Act con plenas competencias para realizar inspecciones y sancionar.
                                </Text>
                            </View>
                        </>
                    )}
                    <Footer />
                </Page>
            )}

            {/* SECCIÓN 3 Y 4 */}
            {(selectedChapters.includes('calendario') || selectedChapters.includes('alcance')) && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    {selectedChapters.includes('calendario') && (
                        <>
                            <Text style={styles.h1}>3. Calendario de Aplicación y Sanciones</Text>
                            <Text style={styles.text}>
                                El despliegue temporal del AI Act es progresivo, pero los plazos relativos a la alfabetización del personal ya se encuentran plenamente activos.
                            </Text>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>1 de agosto de 2024:</Text> Entrada en vigor del Reglamento.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>2 de febrero de 2025:</Text> Obligatoriedad de la Alfabetización (Art. 4). Desde esta fecha, la alfabetización en IA es legalmente exigible a cualquier organización que utilice herramientas algorítmicas.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>2 de agosto de 2026:</Text> Plena capacidad inspectora y sancionadora de la AESIA.</Text>
                            </View>

                            <View style={styles.warningBox}>
                                <Text style={{ fontSize: 12, fontWeight: 700, color: '#c2410c', marginBottom: 5 }}>Régimen Económico de Sanciones (Artículo 99)</Text>
                                <Text style={{ fontSize: 10, color: '#9a3412', lineHeight: 1.5 }}>
                                    El incumplimiento del deber de asegurar una alfabetización suficiente e informada del personal se rige bajo un severo esquema de multas coercitivas de hasta 15.000.000 € o el 3% del volumen de negocios global de la empresa durante el ejercicio anterior (la cuantía que sea mayor).
                                </Text>
                            </View>
                        </>
                    )}

                    {selectedChapters.includes('alcance') && (
                        <>
                            <Text style={styles.h1}>4. Alcance y Obligaciones de la Empresa</Text>
                            <Text style={styles.text}>
                                El reglamento distingue principalmente entre dos figuras, y ambas están obligadas a alfabetizar a sus equipos (Art. 4):
                            </Text>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>1.</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Proveedor (Provider):</Text> Quien desarrolla un sistema de IA o lo introduce en el mercado.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>2.</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Responsable del despliegue (Deployer):</Text> Cualquier empresa que utilice un sistema de IA bajo su autoridad en el ejercicio de una actividad profesional.</Text>
                            </View>
                        </>
                    )}
                    <Footer />
                </Page>
            )}

            {/* SECCIÓN 5 Y 6 */}
            {(selectedChapters.includes('plan') || selectedChapters.includes('formativo')) && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    {selectedChapters.includes('plan') && (
                        <>
                            <Text style={styles.h1}>5. Plan Interno de Gobernanza y Control</Text>
                            <Text style={styles.text}>
                                Antes de formar, la empresa debe sentar las bases legales e institucionales para que la alfabetización tenga un propósito claro. {empresa} establece el siguiente marco de control:
                            </Text>

                            <Text style={styles.h2}>La Política de Uso Aceptable (Normativa Interna)</Text>
                            <Text style={styles.text}>
                                Un documento vinculante que determina las reglas de juego para todos los empleados:
                            </Text>

                            <View style={styles.highlightBox}>
                                <Text style={styles.h3}>Lista Blanca de Herramientas Autorizadas</Text>
                                <Text style={styles.text}>Solo se permite el uso profesional de: {listaBlanca || 'Las definidas por la empresa.'}</Text>

                                <Text style={styles.h3}>Protocolo de Inputs Prohibidos</Text>
                                <Text style={styles.text}>Prohibición expresa de introducir datos confidenciales en sistemas de IA públicos: {listaProhibida || 'Datos sensibles, personales o secretos comerciales.'}</Text>
                            </View>
                        </>
                    )}

                    {selectedChapters.includes('formativo') && (
                        <>
                            <Text style={styles.h1}>6. Plan Formativo e Itinerario por Perfiles</Text>
                            <Text style={styles.text}>
                                El plan de {empresa} se segmenta en tres niveles básicos:
                            </Text>

                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.h3}>Nivel 1: Concienciación General (Toda la plantilla)</Text>
                                <Text style={styles.text}>Duración: 2 a 4 horas. Contenidos: Qué es y qué no es la IA, sesgo de automatización, seguridad de la información, alucinaciones.</Text>

                                <Text style={styles.h3}>Nivel 2: Operadores e Implementadores (Finanzas, Ventas, RRHH)</Text>
                                <Text style={styles.text}>Duración: 10 a 15 horas. Contenidos: Ingeniería de Prompts, Propiedad Intelectual, Riesgo sectorial, anonimización avanzada.</Text>

                                <Text style={styles.h3}>Nivel 3: Comité de Control, Legal e IT (Directivos)</Text>
                                <Text style={styles.text}>Duración: 15 a 20 horas. Contenidos: Marco Regulatorio del AI Act, Gestión de Incidentes, auditoría algorítmica.</Text>
                            </View>
                        </>
                    )}
                    <Footer />
                </Page>
            )}

            {/* SECCIÓN 7 Y 8 (NUEVAS) */}
            {(selectedChapters.includes('resumen') || selectedChapters.includes('certificacion')) && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    {selectedChapters.includes('resumen') && (
                        <>
                            <Text style={styles.h1}>7. Resumen del Curso de Cualificación</Text>
                            <Text style={styles.text}>
                                El curso de cualificación impartido a los empleados de {empresa} abarca los siguientes módulos clave para asegurar la alfabetización en IA:
                            </Text>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Módulo 1: Fundamentos de la IA.</Text> Conceptos básicos, diferencias entre IA generativa y predictiva, y casos de uso comunes.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Módulo 2: Riesgos y Sesgos.</Text> Identificación de alucinaciones, sesgos algorítmicos y la importancia de la supervisión humana.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Módulo 3: Privacidad y Seguridad.</Text> Manejo de datos sensibles, cumplimiento del RGPD y políticas internas de la empresa.</Text>
                            </View>
                            <View style={styles.bulletPoint}>
                                <Text style={styles.bullet}>•</Text>
                                <Text style={styles.bulletText}><Text style={{ fontWeight: 700 }}>Módulo 4: Casos Prácticos.</Text> Resolución de misiones y simulaciones en el entorno de trabajo diario.</Text>
                            </View>
                        </>
                    )}

                    {selectedChapters.includes('certificacion') && (
                        <View style={{ marginTop: selectedChapters.includes('resumen') ? 30 : 0 }}>
                            <Text style={styles.h1}>8. Certificados de Cualificación</Text>
                            <Text style={styles.text}>
                                La empresa {empresa} certifica que los empleados han superado satisfactoriamente las pruebas de evaluación continua y los casos prácticos requeridos por el plan formativo.
                            </Text>
                            <View style={styles.highlightBox}>
                                <Text style={styles.h3}>Registro de Certificaciones</Text>
                                <Text style={styles.text}>
                                    Los certificados individuales de cada empleado, con sus respectivas calificaciones y fechas de expedición, se encuentran archivados digitalmente en la plataforma THOTH y están a disposición de las autoridades competentes en caso de auditoría.
                                </Text>
                            </View>
                        </View>
                    )}
                    <Footer />
                </Page>
            )}

            {/* ANEXO I: CLÁUSULA */}
            {selectedChapters.includes('anexo1') && (
                <Page size="A4" style={styles.page}>
                    <Header />
                    <Text style={styles.h1}>ANEXO I: Cláusula Legal de Confidencialidad</Text>
                    <Text style={{ fontSize: 9, color: '#64748b', fontStyle: 'italic', marginBottom: 20 }}>
                        Esta cláusula debe ser incorporada como un Anexo al Contrato de Trabajo. Está redactada en base a la legislación española (Estatuto de los Trabajadores, LOPDGDD 3/2018 y Reglamento UE 2024/1689).
                    </Text>

                    <View style={styles.clauseBox}>
                        <Text style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
                            ANEXO AL CONTRATO DE TRABAJO: REGULACIÓN, CONFIDENCIALIDAD Y BUEN USO DE SISTEMAS DE INTELIGENCIA ARTIFICIAL
                        </Text>

                        <Text style={styles.text}>En _____________, a _____ de _________________ de 202_.</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>DE UNA PARTE:</Text> D./Dña. _________________________, en nombre y representación de la entidad {empresa}, con C.I.F. ____________ (en adelante, la Empresa).</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>DE OTRA PARTE:</Text> D./Dña. _________________________, con D.N.I./NIE ____________ (en adelante, el Trabajador).</Text>

                        <Text style={styles.h3}>EXPONEN</Text>
                        <Text style={styles.text}>
                            Que en cumplimiento del Reglamento (UE) 2024/1689 (Reglamento de Inteligencia Artificial), específicamente su Artículo 4 relativo a la alfabetización obligatoria en materia de IA, así como de la Ley Orgánica 3/2018 (LOPDGDD) y el secreto comercial establecido en la Ley 1/2019, la Empresa ha desarrollado un marco normativo interno para garantizar un uso seguro, ético y legal de las herramientas tecnológicas basadas en algoritmos e Inteligencia Artificial (en adelante, Sistemas de IA).
                        </Text>

                        <Text style={styles.h3}>CLÁUSULAS</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>PRIMERA. Ámbito de Aplicación y Obligación de Alfabetización.</Text> El Trabajador declara haber recibido, o comprometerse a realizar en el tiempo de trabajo facilitado por la empresa, las acciones formativas provistas para alcanzar un nivel suficiente de alfabetización en IA.</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>SEGUNDA. Limitación de Herramientas Autorizadas.</Text> Queda expresamente prohibido descargar, instalar o introducir credenciales corporativas en aplicaciones de IA que no estén explícitamente validadas. Herramientas autorizadas: {listaBlanca}.</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>TERCERA. Confidencialidad Extrema.</Text> Queda estrictamente prohibido introducir Datos de Carácter Personal o secretos comerciales en Sistemas de IA. Información restringida: {listaProhibida}.</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>CUARTA. Obligación de Supervisión Humana.</Text> El Trabajador asume la obligación inexcusable de revisar y auditar humanamente todo resultado generado por una IA antes de integrarlo en cualquier flujo de trabajo.</Text>
                        <Text style={styles.text}><Text style={{ fontWeight: 700 }}>QUINTA. Régimen de Sanciones.</Text> El incumplimiento voluntario o negligente de las obligaciones recogidas en este documento será sancionado de conformidad con el régimen disciplinario establecido en el Convenio Colectivo aplicable.</Text>

                        <View style={styles.signatureBlock}>
                            <View>
                                <View style={styles.signatureLine} />
                                <Text style={styles.signatureText}>Fdo.: La Empresa</Text>
                            </View>
                            <View>
                                <View style={styles.signatureLine} />
                                <Text style={styles.signatureText}>Fdo.: El Trabajador</Text>
                            </View>
                        </View>
                    </View>
                    <Footer />
                </Page>
            )}

        </Document>
    );
};

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// ─── DATOS DE LOS NIVELES ─────────────────────────────────────────────────────
const LEVELS = {
    inicial: {
        id: 'inicial', title: 'Nivel Inicial', icon: '🌱', color: 'var(--success)',
        duration: '30-40 min', desc: 'Para quienes empiezan desde cero. Aprende las bases legales y use básico.',
        modules: [
            {
                title: '¿Qué es la IA? Conceptos básicos',
                lawRef: 'AI Act — Considerando 4 y Art. 3',
                icon: '🤖',
                content: `La Inteligencia Artificial (IA) son sistemas informáticos que aprenden de datos para tomar decisiones o generar contenidos.

El Reglamento Europeo de IA (AI Act) define los sistemas de IA en su Art. 3 como: "sistemas que, dado un objetivo, generan resultados como predicciones, recomendaciones, decisiones u otro contenido que influye en entornos reales".

⚠️ Limitaciones clave que debes conocer:
• Alucinaciones: La IA puede generar información falsa con total confianza. Siempre verifica datos, cifras y leyes que te dé una IA antes de usarlos.
• Sesgos: Los resultados pueden estar distorsionados si los datos de entrenamiento eran sesgados.
• No razona: La IA no entiende, solo predice. No tiene sentido común.

✅ Tu obligación (AI Act Art. 4): Como usuario de IA debes tener "un nivel suficiente de alfabetización en materia de IA" para usar estas herramientas de forma segura.`,
                questions: [
                    { q: '¿Qué son las "alucinaciones" en IA?', opts: ['Errores del hardware', 'Información falsa generada con apariencia real', 'Procesos de seguridad automáticos'], correct: 1, exp: 'Las alucinaciones son outputs plausibles pero incorrectos. El AI Act exige que los usuarios conozcan esta limitación.' },
                    { q: '¿Qué exige el Art. 4 del AI Act a los usuarios de IA?', opts: ['Ser programadores expertos', 'Tener un nivel suficiente de alfabetización en IA', 'Obtener una licencia gubernamental'], correct: 1, exp: 'El Art. 4 establece la obligación de formación mínima para todos los que usen sistemas de IA en su trabajo.' },
                    { q: '¿Puede la IA razonar y entender como un humano?', opts: ['Sí, los modelos modernos razonan perfectamente', 'No, predice patrones pero no entiende', 'Solo si se le dan las instrucciones correctas'], correct: 1, exp: 'La IA predice el siguiente token más probable. No tiene comprensión real ni sentido común.' },
                ]
            },
            {
                title: 'Protección de Datos y IA',
                lawRef: 'RGPD — Art. 5, 25 + AI Act — Art. 10',
                icon: '🛡️',
                content: `El RGPD (Reglamento General de Protección de Datos) regula cómo debes tratar los datos personales, incluyendo cuando usas herramientas de IA.

📌 Regla fundamental: NUNCA introduzcas datos personales en IAs públicas (ChatGPT gratuito, Gemini sin contrato, etc.).

Datos personales incluyen: nombres, DNI, direcciones, emails, teléfonos, datos financieros, información de salud, fotos de personas.

✅ Cómo anonimizar correctamente:
• En lugar de "Juan García, DNI 12345678X" → usa "Persona A"
• En lugar de "Empresa ACME S.L." → usa "Empresa X"
• En lugar de cifras reales de clientes → usa rangos ficticios

El RGPD Art. 25 establece la "Privacidad por diseño": debes proteger los datos desde el primer momento, no después.

⚖️ Consecuencias de incumplir: Multas de hasta 20 millones € o el 4% de la facturación global anual.`,
                questions: [
                    { q: '¿Puedes introducir datos reales de clientes en ChatGPT gratuito?', opts: ['Sí, si borras el historial después', 'No, vulnera el RGPD y el secreto profesional', 'Sí, si la empresa lo permite verbalmente'], correct: 1, exp: 'Las IAs públicas no garantizan confidencialidad. El RGPD Art. 5 exige bases legales para cualquier tratamiento de datos.' },
                    { q: '¿Qué significa "privacidad por diseño" según el RGPD Art. 25?', opts: ['Usar contraseñas seguras', 'Proteger los datos desde el inicio del proceso, no después', 'Diseñar aplicaciones bonitas y fáciles de usar'], correct: 1, exp: 'La privacidad por diseño exige integrar la protección de datos desde el principio, no como un añadido posterior.' },
                    { q: '¿Cómo debes referirte a un cliente al usar una IA?', opts: ['Por su nombre completo para mayor precisión', 'Usando variables anónimas como "Cliente X" o "Empresa Y"', 'Solo por su sector empresarial'], correct: 1, exp: 'Anonimizar los datos antes de introducirlos en cualquier IA es una obligación, no solo una buena práctica.' },
                ]
            },
            {
                title: 'Responsabilidad y Uso Correcto',
                lawRef: 'AI Act — Art. 22 (Supervisión Humana)',
                icon: '⚖️',
                content: `¿Quién es responsable cuando la IA comete un error?

Según el AI Act Art. 22, la supervisión humana es obligatoria. Esto significa que TÚ eres responsable de todo lo que haces con IA en tu trabajo.

📋 Reglas básicas de uso responsable:
1. Verifica siempre los outputs de la IA antes de enviarlos o publicarlos
2. Solo usa herramientas aprobadas por tu empresa (Lista Blanca de IT)
3. Reporta incidentes al Responsable de IA inmediatamente
4. No uses IA para decisiones que afecten derechos de personas sin supervisión

🔴 Lo que NUNCA debes hacer:
• Enviar a un cliente un informe generado por IA sin revisarlo
• Usar una IA no autorizada porque "va más rápido"
• Ignorar resultados sospechosos o sesgados de la IA

✅ Tu herramienta: el canal de reporte de incidentes. Si algo falla, repórtalo. El AI Act Art. 73 establece la notificación obligatoria de incidentes graves.`,
                questions: [
                    { q: 'Si la IA genera un informe con errores y lo envías a un cliente sin revisar, ¿quién es responsable?', opts: ['El proveedor de la IA (OpenAI, Google...)', 'Nadie, la IA es la responsable', 'Tú y tu empresa, por incumplir la obligación de supervisión humana'], correct: 2, exp: 'El AI Act Art. 22 es claro: la supervisión humana es obligatoria. Si no revisas el output, asumes la responsabilidad.' },
                    { q: '¿Qué herramientas de IA puedes usar en el trabajo?', opts: ['Cualquiera que encuentres gratuita en internet', 'Solo las aprobadas formalmente por el departamento de IT', 'Las que usan tus compañeros aunque no estén aprobadas'], correct: 1, exp: 'Usar IAs no autorizadas puede violar políticas internas, el RGPD y el AI Act. La Lista Blanca de IT es tu guía.' },
                    { q: '¿Qué haces si detectas que la IA da resultados sospechosos o discriminatorios?', opts: ['Seguir usándola, ya que es un error puntual', 'Reportarlo inmediatamente al Responsable de IA / IT', 'Desinstalarla y no decir nada'], correct: 1, exp: 'El AI Act Art. 73 establece la notificación obligatoria de incidentes. Callar puede ser una infracción.' },
                ]
            },
        ]
    },

    media: {
        id: 'media', title: 'Nivel Medio', icon: '⚡', color: 'var(--warning)',
        duration: '45-60 min', desc: 'Para usuarios con conocimiento básico. Profundiza en el marco regulatorio.',
        modules: [
            {
                title: 'El AI Act Europeo — Marco Completo',
                lawRef: 'Reglamento UE 2024/1689 — AI Act',
                icon: '⚖️',
                content: `El AI Act (Reglamento UE 2024/1689) es la primera ley integral de IA del mundo. Entró en vigor en agosto de 2024 y aplica a todas las empresas que operen en la UE.

📊 Sistema de clasificación por riesgo:
• Riesgo Inaceptable (prohibido): manipulación subliminal, puntuación social, reconocimiento facial en tiempo real en espacios públicos
• Riesgo Alto: IA en RRHH (selección de personal), créditos, educación, infraestructuras críticas  
• Riesgo Limitado: chatbots, generadores de imágenes (deben informar que son IA)
• Riesgo Mínimo: filtros de spam, recomendaciones de contenido

🗓️ Calendario de implantación:
• Feb 2025: Prohibiciones de riesgo inaceptable en vigor
• Ago 2026: Obligaciones para sistemas de alto riesgo
• Total aplicación: agosto 2027

💡 Clave para ti: Si tu empresa usa IA para selección de personal, evaluación del rendimiento o decisiones sobre empleados → es alto riesgo y hay obligaciones específicas.`,
                questions: [
                    { q: '¿Qué tipo de riesgo tiene la IA usada en selección de personal según el AI Act?', opts: ['Riesgo mínimo', 'Riesgo limitado', 'Riesgo alto'], correct: 2, exp: 'El AI Act clasifica los sistemas de IA en RRHH como "alto riesgo" (Anexo III), con obligaciones extra de transparencia y auditoría.' },
                    { q: '¿Qué obligación tienen los chatbots según el AI Act?', opts: ['Decirle al usuario que está hablando con una IA', 'Guardar logs de todas las conversaciones', 'Obtener licencia del gobierno'], correct: 0, exp: 'El AI Act exige transparencia: los usuarios deben saber cuándo interactúan con un sistema de IA, no con un humano.' },
                    { q: '¿Cuándo entran en vigor las obligaciones para sistemas de alto riesgo?', opts: ['Enero 2025', 'Agosto 2026', 'El AI Act no tiene fechas definidas'], correct: 1, exp: 'Agosto de 2026 es la fecha clave para que los sistemas de IA de alto riesgo cumplan con todas las obligaciones del AI Act.' },
                    { q: '¿Está permitida la IA de "puntuación social" (scoring) en la UE?', opts: ['Sí, si se anonimiza', 'No, está completamente prohibida por el AI Act', 'Solo para administraciones públicas'], correct: 1, exp: 'La "puntuación social" de ciudadanos por sistemas de IA está en la categoría de riesgo inaceptable y prohibida desde Feb 2025.' },
                ]
            },
            {
                title: 'Transparencia y Supervisión Humana',
                lawRef: 'AI Act — Arts. 13, 14, 22',
                icon: '👁️',
                content: `Dos principios fundamentales del AI Act son la transparencia y la supervisión humana.

🔍 Transparencia (Art. 13): Los sistemas de IA de alto riesgo deben ser suficientemente transparentes para que los usuarios entiendan cómo funcionan y puedan tomar decisiones informadas.

Esto significa que si usas IA para tomar decisiones sobre personas:
• Debes poder explicar cómo llegaste a esa decisión
• No puedes usar la IA como "caja negra" sin entender sus outputs
• Los afectados tienen derecho a saber que una IA intervino en la decisión

👥 Supervisión Humana (Art. 14): Los sistemas de alto riesgo deben diseñarse para que personas físicas puedan:
• Comprender las capacidades y limitaciones del sistema
• Detectar anomalías, disfunciones y resultados inesperados
• Desactivar el sistema o ignorar su output cuando sea necesario

⚡ Sesgo de automatización: La tendencia a confiar ciegamente en la IA es el mayor riesgo. El AI Act lo reconoce explícitamente. Mantén siempre el juicio crítico.`,
                questions: [
                    { q: '¿Qué es el "sesgo de automatización"?', opts: ['Un bug que hace la IA más lenta', 'Confiar ciegamente en las decisiones de la IA sin ejercer juicio crítico', 'Un tipo de dato que sesga los algoritmos'], correct: 1, exp: 'El sesgo de automatización es uno de los riesgos más reconocidos. El AI Act Art. 14 exige supervisión activa precisamente para contrarrestarlo.' },
                    { q: 'Según el Art. 13, ¿qué deben garantizar los sistemas de IA de alto riesgo?', opts: ['Máxima velocidad de procesamiento', 'Suficiente transparencia para que el usuario entienda los outputs', 'Acceso gratuito para todos los empleados'], correct: 1, exp: 'La transparencia es obligatoria para que el usuario pueda supervisar eficazmente el sistema y tomar decisiones informadas.' },
                    { q: '¿Puede un supervisor usar solo el output de la IA para tomar una decisión sobre un empleado sin revisarlo?', opts: ['Sí, si la IA tiene más del 90% de precisión', 'No, el Art. 14 exige que el humano supervise y valide el resultado', 'Depende del tipo de empresa'], correct: 1, exp: 'La supervisión humana es un derecho del trabajador y una obligación del empleador bajo el AI Act Art. 14.' },
                    { q: '¿Tienen los ciudadanos derecho a saber que una IA intervino en una decisión que les afecta?', opts: ['No, es información confidencial del sistema', 'Sí, el AI Act garantiza este derecho de transparencia', 'Solo si lo solicitan por escrito con 30 días de antelación'], correct: 1, exp: 'El derecho a la explicación es un principio fundamental del AI Act y del RGPD. Los afectados deben saber cuándo y cómo actúa la IA sobre ellos.' },
                ]
            },
            {
                title: 'Cumplimiento Empresarial y Obligaciones',
                lawRef: 'AI Act — Arts. 4, 9, 17, 73',
                icon: '📋',
                content: `¿Qué debe hacer tu empresa para cumplir con el AI Act?

📁 Obligaciones documentales (Art. 17):
• Política interna de uso de IA
• Registro de los sistemas de IA utilizados
• Evaluación de riesgos por sistema
• Registro de incidentes

🎓 Formación obligatoria (Art. 4):
Todas las personas que trabajen con IA deben tener formación adecuada. Esta cualificación que estás realizando cumple con este requisito.

⚡ Gestión de riesgos (Art. 9):
Los sistemas de alto riesgo necesitan un sistema de gestión de riesgos continuo, no solo una evaluación inicial. Incluye monitoreo y actualización periódica.

🚨 Notificación de incidentes (Art. 73):
Los incidentes graves con sistemas de IA de alto riesgo deben notificarse a la autoridad nacional competente (en España: AESIA) en 15 días hábiles.

💡 España y el AI Act:
La AESIA (Agencia Española de Supervisión de Inteligencia Artificial) es el organismo responsable de aplicar el AI Act en España.`,
                questions: [
                    { q: '¿Qué organismo supervisa el cumplimiento del AI Act en España?', opts: ['AEPD (Protección de Datos)', 'AESIA (Agencia Española de Supervisión de IA)', 'Ministerio de Transformación Digital'], correct: 1, exp: 'La AESIA es la autoridad nacional competente para supervisar el AI Act en España, aunque la AEPD mantiene sus competencias en materia de RGPD.' },
                    { q: '¿En cuántos días debe notificarse un incidente grave con IA de alto riesgo?', opts: ['30 días naturales', '15 días hábiles', 'No hay plazo definido'], correct: 1, exp: 'El AI Act Art. 73 establece 15 días hábiles para notificar incidentes graves a la autoridad competente.' },
                    { q: '¿La formación en IA es solo para el departamento de IT?', opts: ['Sí, solo para técnicos', 'No, el Art. 4 obliga a todos los que trabajen con IA', 'Solo para directivos que toman decisiones'], correct: 1, exp: 'El Art. 4 del AI Act es claro: la alfabetización en IA es obligatoria para TODOS los que usen sistemas de IA en su trabajo, independientemente del nivel o departamento.' },
                    { q: '¿Con qué frecuencia debe revisarse la evaluación de riesgos de una IA de alto riesgo?', opts: ['Solo una vez, al implementarla', 'Continuamente, con monitoreo periódico según Art. 9', 'Cada 5 años'], correct: 1, exp: 'El Art. 9 exige un sistema de gestión de riesgos continuo, no puntual. El riesgo puede cambiar con el tiempo y los nuevos usos.' },
                ]
            },
        ]
    },

    express: {
        id: 'express', title: 'Express', icon: '🚀', color: 'var(--primary)',
        duration: '15-20 min', desc: 'Recertificación rápida para quienes ya tienen conocimientos. Test único integral.',
        modules: [
            {
                title: 'Recertificación Express — Revisión Normativa',
                lawRef: 'AI Act 2024/1689 + RGPD + Política Interna',
                icon: '🚀',
                content: `Recertificación Express — Repaso rápido de los puntos críticos.

⚖️ AI Act en resumen:
• Art. 4: Alfabetización obligatoria para todos los usuarios de IA
• Art. 9: Gestión de riesgos continua para sistemas de alto riesgo  
• Art. 13-14: Transparencia y supervisión humana obligatorias
• Art. 73: Notificación de incidentes en 15 días hábiles
• Alto riesgo en RRHH, educación, crédito, infraestructuras críticas

🛡️ RGPD + IA:
• Nunca datos personales en IAs públicas sin DPA firmado
• Anonimizar siempre: "Cliente X", rangos en lugar de cifras exactas
• Privacidad por diseño (Art. 25): proteger desde el inicio

✅ Reglas de oro del uso profesional:
1. Solo IAs aprobadas por IT (Lista Blanca)
2. Verificar siempre los outputs antes de usar
3. Reportar incidentes al Responsable de IA
4. Mantener supervisión humana activa
5. Anonimizar los datos en los prompts
6. Conservar evidencias de uso seguro

🚨 España: AESIA es el regulador nacional del AI Act.`,
                questions: [
                    { q: '¿Qué tipo de riesgo tiene la IA usada en selección de personal?', opts: ['Mínimo', 'Limitado', 'Alto'], correct: 2, exp: 'RRHH está en el Anexo III del AI Act como sistema de alto riesgo.' },
                    { q: 'Plazo para notificar incidentes graves al regulador:', opts: ['30 días', '15 días hábiles', '7 días'], correct: 1, exp: 'Art. 73 AI Act: 15 días hábiles para notificación a la autoridad competente (AESIA en España).' },
                    { q: '¿Puedes usar una IA no aprobada si va más rápido?', opts: ['Sí, la eficiencia prima', 'No, solo IAs de la Lista Blanca de IT', 'Sí si es gratuita'], correct: 1, exp: 'Usar IAs no autorizadas viola la política interna y puede incumplir el RGPD y el AI Act.' },
                    { q: 'Al usar IA, si detectas un resultado discriminatorio debes:', opts: ['Ignorarlo si conviene al proyecto', 'Reportarlo inmediatamente al Responsable de IA', 'Borrar el historial'], correct: 1, exp: 'Art. 73 AI Act: los incidentes deben reportarse. La omisión puede ser sancionada.' },
                    { q: '¿Qué obliga el Art. 4 del AI Act?', opts: ['Solo a empresas grandes', 'Alfabetización en IA para todos los que la usen', 'Contratar un experto en IA por empresa'], correct: 1, exp: 'Art. 4: obligación universal de formación mínima para cualquier persona que use sistemas de IA.' },
                    { q: 'El RGPD Art. 25 (privacidad por diseño) significa:', opts: ['Añadir seguridad al final del proyecto', 'Integrar protección de datos desde el inicio del proceso', 'Usar contraseñas complejas'], correct: 1, exp: 'Privacidad por diseño: la protección de datos debe ser inherente al proceso desde su concepción, no un añadido posterior.' },
                ]
            }
        ]
    }
};

type LevelKey = 'inicial' | 'media' | 'express';
type Phase = 'select' | 'learn' | 'quiz' | 'quiz_result' | 'certificate';

export default function CualificacionPage() {
    const [phase, setPhase] = useState<Phase>('select');
    const [levelKey, setLevelKey] = useState<LevelKey | null>(null);
    const [moduleIdx, setModuleIdx] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [selected, setSelected] = useState<number | null>(null);
    const [showExp, setShowExp] = useState(false);
    const [quizQ, setQuizQ] = useState(0);
    const [moduleResults, setModuleResults] = useState<{ passed: boolean; score: number; total: number }[]>([]);
    const [testDone, setTestDone] = useState(false);

    useEffect(() => {
        setTestDone(localStorage.getItem('thoth_test_previo_done') === 'true');
    }, []);

    const level = levelKey ? LEVELS[levelKey] : null;
    const module = level ? level.modules[moduleIdx] : null;
    const questions = module?.questions || [];

    const handleAnswer = (idx: number) => {
        if (showExp) return;
        setSelected(idx);
        setShowExp(true);
    };

    const handleNextQ = () => {
        if (selected === null) return;
        const newAnswers = { ...quizAnswers, [quizQ]: selected };
        setQuizAnswers(newAnswers);
        setSelected(null);
        setShowExp(false);
        if (quizQ + 1 < questions.length) {
            setQuizQ(quizQ + 1);
        } else {
            const score = questions.filter((q, i) => newAnswers[i] === q.correct).length;
            const passed = score / questions.length >= 0.66;
            const results = [...moduleResults, { passed, score, total: questions.length }];
            setModuleResults(results);
            setPhase('quiz_result');
            if (passed) {
                if (moduleIdx + 1 >= (level?.modules.length || 0)) {
                    // Certificado
                    localStorage.setItem('thoth_qualification_level', levelKey!);
                    saveCertificate(levelKey!, results);
                }
            }
        }
    };

    const saveCertificate = async (lk: string, results: { passed: boolean; score: number; total: number }[]) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: prof } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
            if (!prof) return;
            const totalScore = results.reduce((a, r) => a + r.score, 0);
            const totalQ = results.reduce((a, r) => a + r.total, 0);
            const pct = Math.round((totalScore / totalQ) * 100);
            const hashId = `CERT-${lk.toUpperCase()}-${Date.now()}`;
            await supabase.from('evidences').insert({
                user_id: user.id, company_id: prof.company_id,
                evidence_type: `Certificado Cualificación — ${LEVELS[lk as LevelKey].title}`,
                detail: `Cualificación completada. Puntuación global: ${totalScore}/${totalQ} (${pct}%). Módulos: ${results.length}. Fecha: ${new Date().toLocaleDateString('es-ES')}`,
                hash_id: hashId
            });
        } catch (e) { console.error(e); }
    };

    const startLevel = (lk: LevelKey) => {
        setLevelKey(lk);
        setModuleIdx(0);
        setModuleResults([]);
        setQuizAnswers({});
        setQuizQ(0);
        setSelected(null);
        setShowExp(false);
        setPhase('learn');
    };

    const goNextModule = () => {
        setQuizAnswers({});
        setQuizQ(0);
        setSelected(null);
        setShowExp(false);
        setModuleIdx(moduleIdx + 1);
        setPhase('learn');
    };

    const allPassed = moduleResults.length === (level?.modules.length || 0) && moduleResults.every(r => r.passed);
    const isLastModule = level && moduleIdx + 1 >= level.modules.length;

    return (
        <div style={{ padding: '1rem', maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href="/worker/panel" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.9rem' }}>
                    ← Panel
                </Link>
                {phase !== 'select' && (
                    <button className="btn btn-secondary" style={{ fontSize: '0.9rem' }} onClick={() => setPhase('select')}>
                        Cambiar Nivel
                    </button>
                )}
            </div>

            {/* ===== SELECCIÓN DE NIVEL ===== */}
            {phase === 'select' && (
                <div className="fade-in">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 className="title-gradient" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>Mi Cualificación Oficial 🎓</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Elige el nivel que mejor se adapte a tu experiencia. Cada módulo incluye formación y test de verificación.
                        </p>
                        {!testDone && (
                            <div style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.2rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--warning)' }}>
                                ⚠️ Recomendado: completa primero el <Link href="/worker/autoevaluacion" style={{ color: 'var(--warning)', fontWeight: 600 }}>Test Previo</Link> para saber tu nivel ideal.
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {(Object.values(LEVELS) as typeof LEVELS[LevelKey][]).map((lv) => (
                            <div key={lv.id} className="card" style={{
                                padding: '2rem',
                                border: `1px solid ${lv.color}22`,
                                background: `linear-gradient(135deg, ${lv.color}08 0%, rgba(0,0,0,0.3) 100%)`,
                                display: 'flex', alignItems: 'center', gap: '2rem',
                                cursor: 'pointer', transition: 'transform 0.2s'
                            }}
                                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                                <div style={{ fontSize: '3rem', flexShrink: 0 }}>{lv.icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#fff' }}>{lv.title}</h2>
                                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', background: `${lv.color}22`, color: lv.color, fontWeight: 700 }}>⏱ {lv.duration}</span>
                                    </div>
                                    <p style={{ margin: '0 0 0.75rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{lv.desc}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {lv.modules.map((m, i) => (
                                            <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                                                {m.icon} {m.title.split('—')[0].trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => startLevel(lv.id as LevelKey)}>
                                    Empezar →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== APRENDIZAJE (TEMA) ===== */}
            {phase === 'learn' && module && level && (
                <div className="fade-in">
                    {/* Progress de módulos */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem' }}>
                        {level.modules.map((_, i) => (
                            <div key={i} style={{
                                flex: 1, height: '5px', borderRadius: '3px',
                                background: i < moduleIdx ? level.color : i === moduleIdx ? level.color : 'rgba(255,255,255,0.1)',
                                opacity: i < moduleIdx ? 1 : i === moduleIdx ? 0.8 : 0.2
                            }} />
                        ))}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        MÓDULO {moduleIdx + 1} DE {level.modules.length} · {module.lawRef}
                    </div>

                    <div className="card" style={{ padding: '2.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '2.5rem' }}>{module.icon}</span>
                            <div>
                                <h1 style={{ fontSize: '1.6rem', margin: 0, color: '#fff' }}>{module.title}</h1>
                                <div style={{ fontSize: '0.8rem', color: level.color, marginTop: '0.25rem', fontWeight: 600 }}>{module.lawRef}</div>
                            </div>
                        </div>
                        <div style={{
                            color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem',
                            whiteSpace: 'pre-wrap',
                            background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '1.5rem',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            {module.content}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            📝 Después del contenido, realizarás {module.questions.length} preguntas de verificación.
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.85rem 2rem' }} onClick={() => setPhase('quiz')}>
                            Pasar al Test →
                        </button>
                    </div>
                </div>
            )}

            {/* ===== QUIZ DEL MÓDULO ===== */}
            {phase === 'quiz' && module && level && (
                <div className="fade-in">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            TEST DEL MÓDULO {moduleIdx + 1} — {module.title.toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {questions.map((_, i) => (
                                <div key={i} style={{
                                    flex: 1, height: '5px', borderRadius: '3px',
                                    background: i < quizQ
                                        ? (quizAnswers[i] === questions[i].correct ? 'var(--success)' : 'var(--error)')
                                        : i === quizQ ? level.color : 'rgba(255,255,255,0.1)'
                                }} />
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                            {quizQ + 1} / {questions.length}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: level.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                            {module.lawRef}
                        </div>
                        <h2 style={{ fontSize: '1.35rem', marginBottom: '2rem', color: '#fff', lineHeight: 1.5 }}>
                            {questions[quizQ].q}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {questions[quizQ].opts.map((opt, idx) => {
                                const isCorrect = idx === questions[quizQ].correct;
                                const isSelected = selected === idx;
                                let bg = 'rgba(255,255,255,0.04)';
                                let border = 'rgba(255,255,255,0.1)';
                                let color = 'var(--text-secondary)';
                                if (showExp) {
                                    if (isCorrect) { bg = 'rgba(16,163,127,0.1)'; border = 'var(--success)'; color = '#fff'; }
                                    else if (isSelected) { bg = 'rgba(239,68,68,0.1)'; border = 'var(--error)'; color = '#fff'; }
                                } else if (isSelected) { bg = 'rgba(201,162,39,0.1)'; border = 'var(--primary)'; color = '#fff'; }

                                return (
                                    <button key={idx} onClick={() => handleAnswer(idx)} disabled={showExp} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '1rem',
                                        padding: '1rem 1.25rem', textAlign: 'left', width: '100%',
                                        background: bg, border: `1px solid ${border}`,
                                        borderRadius: '10px', cursor: showExp ? 'default' : 'pointer',
                                        color, transition: 'all 0.15s ease'
                                    }}>
                                        <div style={{
                                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: '0.85rem',
                                            background: showExp && isCorrect ? 'var(--success)' : showExp && isSelected ? 'var(--error)' : isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            color: (showExp && (isCorrect || isSelected)) || isSelected ? '#000' : 'var(--text-muted)'
                                        }}>
                                            {showExp && isCorrect ? '✓' : showExp && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + idx)}
                                        </div>
                                        <span style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{opt}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {showExp && (
                            <div style={{
                                padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem',
                                background: selected === questions[quizQ].correct ? 'rgba(16,163,127,0.08)' : 'rgba(239,68,68,0.08)',
                                border: `1px solid ${selected === questions[quizQ].correct ? 'rgba(16,163,127,0.3)' : 'rgba(239,68,68,0.3)'}`
                            }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem', color: selected === questions[quizQ].correct ? 'var(--success)' : 'var(--error)' }}>
                                    {selected === questions[quizQ].correct ? '✅ Correcto' : '❌ Incorrecto'}
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {questions[quizQ].exp}
                                </p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" style={{ opacity: showExp ? 1 : 0.3, cursor: showExp ? 'pointer' : 'not-allowed' }} onClick={handleNextQ} disabled={!showExp}>
                                {quizQ + 1 < questions.length ? 'Siguiente →' : 'Ver Resultado del Módulo →'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== RESULTADO DEL MÓDULO ===== */}
            {phase === 'quiz_result' && module && level && (
                <div className="fade-in" style={{ textAlign: 'center' }}>
                    {(() => {
                        const last = moduleResults[moduleResults.length - 1];
                        const pct = Math.round((last.score / last.total) * 100);
                        return (
                            <div className="card" style={{ padding: '3rem', maxWidth: '620px', margin: '0 auto' }}>
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{last.passed ? '✅' : '❌'}</div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
                                    {last.passed ? 'Módulo Superado' : 'Módulo no Superado'}
                                </h2>
                                <div style={{ fontSize: '4rem', fontWeight: 900, color: last.passed ? 'var(--success)' : 'var(--error)', margin: '1rem 0' }}>{pct}%</div>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                    {last.score} de {last.total} correctas · Mínimo requerido: 66%
                                </p>

                                {last.passed ? (
                                    isLastModule ? (
                                        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }} onClick={() => setPhase('certificate')}>
                                            🏆 Ver mi Certificado →
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }} onClick={goNextModule}>
                                            Siguiente Módulo ({moduleIdx + 2}/{level.modules.length}) →
                                        </button>
                                    )
                                ) : (
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <button className="btn btn-secondary" onClick={() => setPhase('learn')}>
                                            📖 Repasar contenido
                                        </button>
                                        <button className="btn btn-primary" onClick={() => { setQuizAnswers({}); setQuizQ(0); setSelected(null); setShowExp(false); setModuleResults(moduleResults.slice(0, -1)); setPhase('quiz'); }}>
                                            🔄 Repetir Test
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* ===== CERTIFICADO FINAL ===== */}
            {phase === 'certificate' && level && (
                <div className="fade-in" style={{ textAlign: 'center' }}>
                    <div className="card" style={{
                        padding: '3rem', maxWidth: '700px', margin: '0 auto',
                        background: `linear-gradient(145deg, ${level.color}10 0%, rgba(20,20,20,0.95) 100%)`,
                        border: `2px solid ${level.color}44`
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
                        <div style={{ fontSize: '0.85rem', color: level.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>
                            Certificado Oficial de Competencia
                        </div>
                        <h1 className="title-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            {level.title} Completado
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                            Has completado con éxito todos los módulos de formación requeridos.<br />
                            Cumple con el <strong style={{ color: '#fff' }}>AI Act Art. 4</strong> (Obligación de Alfabetización en IA).
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                            {moduleResults.map((r, i) => (
                                <div key={i} style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: `1px solid ${level.color}22` }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{level.modules[i]?.icon}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{level.modules[i]?.title.slice(0, 25)}...</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: level.color }}>{Math.round((r.score / r.total) * 100)}%</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            ID: CERT-{level.id.toUpperCase()}-{Date.now().toString(36).toUpperCase()} · {new Date().toLocaleDateString('es-ES')}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <Link href="/worker/panel" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                                ← Volver al Panel
                            </Link>
                            <Link href="/worker/progreso" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                                Ver mis Evidencias →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

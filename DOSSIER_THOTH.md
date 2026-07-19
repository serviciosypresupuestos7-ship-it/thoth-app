# DOSSIER TÉCNICO Y FUNCIONAL: THOTH AI PLATFORM
**Plataforma de Gestión de Competencias en IA y Cumplimiento Continuo**

## 1. FILOSOFÍA Y POSICIONAMIENTO CORE

**THOTH no es un LMS (Learning Management System) ni un creador de cursos.** 
THOTH es un sistema activo que mide, mantiene y demuestra la competencia en IA de una organización. No enseñamos únicamente a los empleados; demostramos a la empresa que su conocimiento sigue siendo válido cuando la normativa cambia.

Las empresas no compran cursos; compran **visibilidad, mitigación de riesgos y datos históricos**. THOTH sirve para:
1.  **Medir** el nivel de competencia en IA de cada departamento.
2.  **Entrenar** mediante casos prácticos diarios (micro-engagement).
3.  **Demostrar** ante una inspección que la plantilla conoce y aplica el AI Act, el RGPD y las políticas internas.
4.  **Mantener** el cumplimiento de forma continua mediante un **Motor de Reglas Activo**: Si una ley cambia ➔ THOTH busca a los trabajadores afectados ➔ Les asigna una misión ➔ Si suspenden, avisa a RRHH ➔ Si aprueban, actualiza la competencia.

El verdadero valor de THOTH a largo plazo no es la IA, es **el Dato**. El sistema genera un histórico inmutable que permite al CEO responder: *"¿Estamos mejor que hace seis meses? ¿Qué departamentos fallan más? ¿Cuánto tardamos en adaptarnos a una nueva ley?"*

---

## 2. EL MOTOR DE COMPETENCIAS (CORE FLOW)

El corazón del sistema no son los cursos ni los documentos, sino el flujo que transforma una obligación legal en una capacidad demostrable:

```text
Normativa (AI Act, RGPD)
        │
        ▼
Obligación Legal
        │
        ▼
Política Interna de la Empresa
        │
        ▼
Catálogo de Puestos de Trabajo
        │
        ▼
Competencia Requerida
        │
        ▼
Ruta Formativa
        │
        ▼
Misiones Prácticas (Simulador IA)
        │
        ▼
Evaluación
        │
        ▼
Evidencias Inmutables
        │
        ▼
Certificación de Cumplimiento
```

---

## 3. CONCEPTOS CLAVE DEL ECOSISTEMA

Para entender THOTH, es fundamental definir sus piezas principales:

### 3.1. Competencia
Una competencia representa la capacidad demostrable de un trabajador para utilizar la Inteligencia Artificial de forma segura, responsable y adecuada a su puesto.
Cada competencia está compuesta por:
*   Conocimientos y habilidades.
*   Misiones y simulaciones.
*   Evidencias y evaluaciones.
*   Fecha de próxima revisión.
*Una competencia solo se considera adquirida cuando el trabajador ha demostrado su dominio mediante actividades prácticas y evaluaciones.*
Cada competencia está asociada a uno o varios puestos de trabajo, a obligaciones legales y a las políticas internas definidas por la organización.

### 3.2. Ruta Formativa (Learning Path)
No existe el aprendizaje aislado. Una Ruta Formativa agrupa de forma lógica:
*   Documentos y políticas.
*   Recursos de aprendizaje.
*   Misiones y simulaciones.
*   Evaluaciones.
*   Evidencias generadas.
*(Ejemplo: Administrativo ➔ Introducción IA ➔ Política interna ➔ AI Act ➔ Misión ➔ Evaluación ➔ Competencia obtenida).*

### 3.3. Evidencias
Las evidencias son el alma del producto. Forman el historial de cumplimiento de la empresa ante cualquier auditoría. Cada acción realizada por el trabajador genera una evidencia:
*   Documento leído.
*   Test aprobado.
*   Misión completada.
*   Simulación realizada.
*   Competencia obtenida.
*   Certificado emitido.

### 3.4. Centro de Aprendizaje Inteligente
No es una simple biblioteca de PDFs. Permite transformar automáticamente el conocimiento de la organización en experiencias de aprendizaje. Eso engloba:
*   PDF
*   Word
*   Manuales
*   Procedimientos
*   Políticas
*   FAQ
*   Wiki
*   Documentación interna

Funciones principales:
*   Resumen automático y extracción de conceptos clave.
*   Generación de preguntas y test.
*   Creación de casos prácticos y misiones.
*   Tutor IA 24/7 para resolver dudas sobre el texto.
*   Búsqueda semántica avanzada.

### 3.5. Simulador IA
Entorno seguro donde el trabajador practica con Inteligencia Artificial sin afectar a datos reales de la empresa. El simulador permite:
*   Resolver casos prácticos y analizar documentos.
*   Redactar correos y crear prompts.
*   Detectar riesgos (ej. alucinaciones o fuga de datos).
*   Recibir evaluación automática y explicaciones detalladas.
El simulador evalúa tanto la calidad de la respuesta como el cumplimiento de la normativa y de las políticas internas de la organización.

### 3.6. Motor de Evaluación
El Motor de Evaluación es el núcleo que decide cuándo un trabajador es competente. Este motor responde a preguntas críticas como:
*   ¿Qué puntuación mínima debe obtener?
*   ¿Cuántas misiones debe completar?
*   ¿Cada cuánto tiempo debe renovarse una competencia?
*   ¿Qué ocurre si falla una misión crítica?
*   ¿Cómo afecta una nueva normativa a una competencia existente?

---

## 4. ARQUITECTURA TÉCNICA Y STACK

La plataforma está construida utilizando un stack moderno, escalable y orientado al rendimiento:

### 4.1. Frontend (Interfaz de Usuario)
*   **Framework:** Next.js 14 utilizando el nuevo paradigma App Router (`/src/app`).
*   **Lenguaje:** TypeScript para tipado estático y prevención de errores.
*   **Estilos:** CSS Vanilla (`globals.css`). Sistema de diseño propio basado en variables CSS, priorizando una estética "Premium Dark Mode" con efectos de *glassmorphism*.
*   **Generación de Documentos:** Uso de `jspdf` y `html2canvas` para la renderización y descarga de PDFs (Certificados y Reportes de Auditoría) directamente en el cliente.

### 4.2. Backend y Base de Datos (BaaS)
*   **Infraestructura:** Supabase (PostgreSQL).
*   **Autenticación:** Supabase Auth integrado con Next.js middleware.
*   **Seguridad Multi-tenant:** Implementación estricta de **Row Level Security (RLS)** en PostgreSQL. Garantiza que los usuarios de una empresa (tenant) no puedan acceder a los datos de otra empresa.

### 4.3. Inteligencia Artificial Agóstica
*   **Arquitectura compatible con múltiples proveedores** de modelos de Inteligencia Artificial (OpenAI, Anthropic, Google y otros), evitando ataduras a una tecnología concreta.
*   **Arquitectura RAG (Retrieval-Augmented Generation):** El sistema fragmenta normativas legales y políticas internas, almacenándolas como vectores (`legal_chunks`) utilizando `pgvector` en Supabase.

### 4.4. Despliegue y CI/CD
*   **Hosting:** Vercel.
*   **Entorno:** Despliegue continuo conectado al repositorio.

---

## 5. MANUAL FUNCIONAL POR ROLES (NAVEGACIÓN SIMPLIFICADA)

### 5.1. TRABAJADOR (WORKER)
El objetivo del trabajador es adquirir competencias, superar rutas formativas y obtener certificados.
*   **🏠 Panel:** Dashboard resumen. Muestra el progreso general y accesos directos.
*   **🧭 Ruta Formativa:** El camino guiado para adquirir las competencias necesarias.
*   **🎯 Misiones:** Lista de tareas prácticas asignadas. Acceso al **Simulador IA** para resolver casos sin riesgo.
*   **📖 Formación:** Acceso al **Centro de Aprendizaje Inteligente** y al Tutor IA.
*   **🧠 Competencias:** Mapa de habilidades basado en su puesto. Muestra Nivel, Última evaluación, Estado y Próxima revisión.
*   **📊 Progreso:** Descarga de **Certificados en PDF** como prueba de capacitación.

### 5.2. RECURSOS HUMANOS / COMPLIANCE (HR)
El objetivo de RRHH es asegurar el cumplimiento normativo (AI Act y Políticas Internas) y gestionar riesgos.
*   **🏠 Panel:** Visión global del tenant. Muestra el porcentaje de la plantilla formada y riesgos críticos.
*   **👥 Empleados:** Gestión de la plantilla y asignación de puestos desde el Catálogo.
*   **🎯 Misiones:** Control y seguimiento de las misiones asignadas.
*   **📚 Formación:** Gestión de los documentos y políticas internas.
*   **📋 Evidencias:** El centro neurálgico legal. Permite generar el **Informe de Auditoría (PDF)** con el estado de toda la plantilla para presentar ante una inspección. Incluye el historial de evidencias, certificados emitidos y estado competencial de cada trabajador.
*   **📈 Informes:** Estadísticas detalladas sobre el cumplimiento.

### 5.3. SUPERADMINISTRADOR (ADMIN)
El objetivo del Superadmin es gestionar el SaaS, los clientes, la facturación y el motor de IA.
*   **🏢 Empresas:** Tabla de control de todos los tenants (clientes).
*   **🧩 Marcos Competenciales:** Gestión de Competencias, Puestos, Rutas, Misiones y Plantillas.
*   **⚖️ Normativa:** Biblioteca jurídica global.
*   **🤖 IA:** Configuración de Modelos y gestión de API Keys.
*   **💳 Facturación:** Desglose del consumo de tokens por empresa usuaria.
*   **📊 Estadísticas:** Métricas globales de uso de la plataforma.
*   **⚙️ Configuración:** Ajustes generales.

---

## 6. LA EXPERIENCIA DEL TRABAJADOR (USER JOURNEY)

Para entender cómo funciona THOTH en la práctica, este es el recorrido paso a paso que vive un empleado desde el primer día:

1. **Alta y Asignación Automática:**
   RRHH da de alta al empleado y le asigna un puesto (Ej: *Administrativo*). Automáticamente, THOTH le asigna las competencias, rutas formativas y misiones necesarias para ese rol. El trabajador no tiene que elegir nada.

2. **Primer Acceso:**
   El trabajador entra a su Panel y ve un aviso: *"Tienes una ruta formativa asignada"*. Pulsa el botón **Comenzar formación**.

3. **Fase de Aprendizaje (Teoría):**
   La ruta le guía paso a paso (Ej: *Módulo 1 ➔ Política interna ➔ Resumen IA ➔ Tutor IA ➔ Test*). 
   *Nota: El test final de esta fase NO certifica nada. Es una herramienta de autoevaluación para comprobar que ha entendido la teoría.*

4. **Transición a la Práctica:**
   Una vez superada la teoría, THOTH le indica: *"Ahora demuestra que sabes aplicarlo"*, y le redirige a su primera **Misión**.

5. **El Simulador IA (El Examen Práctico):**
   El trabajador entra al Simulador. Se le plantea un caso real de su día a día (Ej: *Un cliente te envía un contrato defectuoso. Usa la IA para redactar una respuesta empática sin admitir culpa legal*). El trabajador interactúa con el chat de la IA para resolver el problema.

6. **El Motor de Evaluación:**
   Al terminar, el motor analiza la conversación completa. No evalúa si la respuesta es "bonita", sino:
   *   ¿Cumplió el AI Act?
   *   ¿Respetó las políticas internas?
   *   ¿Protegió los datos personales?
   *   ¿Evitó alucinaciones de la IA?

7. **El Veredicto:**
   *   **Si NO es competente:** THOTH le indica qué ha fallado (*"Has introducido un DNI en el prompt"*) y le obliga a repetir la misión o repasar la teoría.
   *   **Si SÍ es competente:** THOTH marca la competencia como superada, genera las evidencias inmutables en el sistema, actualiza la barra de progreso y emite el **Certificado Oficial** descargable.

---

## 7. FLUJO DE TRABAJO TÍPICO (END-TO-END)

1.  **Setup (Admin):** El Superadmin crea una nueva empresa y configura las API Keys en el apartado de IA.
2.  **Onboarding (HR):** RRHH invita a sus empleados y les asigna un puesto del **Catálogo de Puestos** (ej. Comercial), lo que automáticamente les asigna competencias, rutas formativas y riesgos específicos.
3.  **Capacitación (Worker):** El trabajador entra al **Centro de Aprendizaje Inteligente**, donde THOTH transforma automáticamente la documentación de la empresa en una Ruta Formativa personalizada para su puesto de trabajo. Luego, usa el **Simulador IA** para practicar.
4.  **Certificación (Worker):** Al demostrar un estado "Competente", el trabajador descarga su certificado.
5.  **Auditoría (HR):** RRHH entra en Evidencias y genera el PDF de Compliance que demuestra que su empresa cumple con el AI Act y sus normas internas.
6.  **Facturación (Admin):** A final de mes, el Superadmin revisa la Facturación para cobrar a la empresa según el consumo.

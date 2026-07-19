# DOSSIER TÉCNICO Y FUNCIONAL: THOTH AI PLATFORM
**Sistema Operativo de Competencia en Inteligencia Artificial**
*Versión del documento: 2.0 — Julio 2026*

---

## 1. FILOSOFÍA Y POSICIONAMIENTO CORE

**THOTH no es un LMS (Learning Management System) ni un creador de cursos.**
THOTH es un **Sistema Operativo de Competencia en IA**: mide, mantiene y *demuestra* que la organización cumple con la normativa vigente en materia de Inteligencia Artificial. No enseñamos únicamente a empleados; demostramos a la empresa que su conocimiento sigue siendo válido cuando la normativa cambia.

Las empresas no compran cursos; compran **visibilidad, mitigación de riesgos y datos históricos auditables**. THOTH sirve para:

1. **Medir** el nivel de competencia en IA de cada departamento y puesto.
2. **Entrenar** mediante casos prácticos diarios orientados a la práctica real (micro-engagement).
3. **Demostrar** ante una inspección que la plantilla conoce y aplica el AI Act, el RGPD y las políticas internas.
4. **Mantener** el cumplimiento de forma continua mediante un **Motor de Reglas Activo**:
   > Si una ley cambia ➔ THOTH detecta los workers afectados ➔ Les asigna una misión ➔ Si suspenden, avisa a RRHH ➔ Si aprueban, actualiza la competencia.

El verdadero valor de THOTH a largo plazo no es la IA: **es el Dato**. El sistema genera un histórico inmutable que permite al CEO responder: *"¿Estamos mejor que hace seis meses? ¿Qué departamentos fallan más? ¿Cuánto tardamos en adaptarnos a una nueva ley?"*

### 1.1. EL FUNDAMENTO LEGAL Y ARGUMENTO DE VENTA (AI ACT)

El pilar absoluto de la alfabetización en THOTH es el **Reglamento Europeo de Inteligencia Artificial (AI Act)**. Antes de hablarle a un trabajador de prompts o herramientas, debe entender el marco legal que la **AESIA** (Agencia Española de Supervisión de la Inteligencia Artificial) utiliza para vigilar y sancionar.

**La definición legal de "Sistema de IA" (Art. 3, apartado 1 del AI Act):**
> *"Un sistema basado en una máquina diseñado para funcionar con niveles variables de autonomía y que puede presentar adaptabilidad tras el despliegue, y que, de forma explícita o implícita, infiere, a partir de la entrada que recibe, cómo generar salidas tales como predicciones, contenidos, recomendaciones o decisiones que pueden influir en entornos físicos o virtuales."*

**🔍 Masticado en cristiano (Los 3 requisitos clave):**
Para que la ley considere que el software de una empresa contiene una IA (y por tanto obligue a usar THOTH para protegerse), se tienen que cumplir estos tres requisitos:
1. **Autonomía y Adaptabilidad:** El programa no sigue reglas fijas fijadas de antemano por un programador. El sistema aprende, se adapta y toma caminos propios.
2. **Inferencia:** El sistema "deduce" o calcula probabilidades para llegar a una conclusión basándose en el contexto (ej. predecir comportamiento o resumir un texto legal).
3. **Generación de Salidas (Outputs):** El resultado final se traduce en crear contenido (texto, imágenes, código), dar recomendaciones o tomar decisiones automatizadas.

**💡 El Argumento de Venta Demoledor:**
Muchos empresarios piensan: *"Bah, yo solo uso ChatGPT para redactar correos o un software básico de selección, eso no es IA corporativa"*.
El argumento legal con THOTH es: *"Según el artículo 3 de la Ley de IA, si tu software infiere datos y genera contenido de forma autónoma, legalmente estás usando IA corporativa y estás obligado a registrar las evidencias y auditar a tu plantilla"*. Ahí es donde entra THOTH para salvarlos de la multa.

---

## 2. EL MOTOR DE COMPETENCIAS (CORE FLOW)

El corazón del sistema transforma una obligación legal en una capacidad demostrable y auditable:

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
Catálogo de Puestos de Trabajo (con Nivel / Seniority)
        │
        ▼
Marco Competencial Asignado al Puesto
        │
        ▼
Competencias Requeridas (con Peso y Dependencias)
        │
        ▼
Ruta Formativa (guiada o Express)
        │
        ▼
Misiones Prácticas → Simulador IA
        │
        ▼
Evaluación Automática (Motor de Evaluación)
        │
        ▼
Evidencias Inmutables (hash_id único)
        │
        ▼
Certificación de Cumplimiento (PDF descargable)
```

---

## 3. CONCEPTOS CLAVE DEL ECOSISTEMA

### 3.1. Competencia
Capacidad **demostrable** de un trabajador para utilizar la IA de forma segura, responsable y adecuada a su puesto. Cada competencia incluye:
- ID único (p. ej. `C01`), nombre, descripción.
- **Nivel de riesgo** (Alto / Medio / Bajo) que determina la urgencia de su adquisición.
- **Peso porcentual** en la evaluación global del worker.
- **Fuentes normativas** vinculadas (p. ej. `RGPD Art. 5`, `AI Act Art. 10`).
- **Dependencias**: una competencia avanzada requiere superar previamente las competencias base.

*Una competencia solo se considera adquirida cuando el trabajador ha demostrado su dominio mediante actividades prácticas y evaluaciones.*

### 3.2. Marco Competencial
La **combinación específica de competencias requeridas** para un Puesto y un Nivel de Seniority concretos (Junior / Senior / Director). Permite que una empresa de RRHH Junior tenga requisitos distintos a una de RRHH Senior. Configurados por el Superadmin en `/admin/marcos`.

### 3.3. Ruta Formativa (Learning Path)
Agrupa de forma lógica documentos, políticas, recursos, misiones, evaluaciones y evidencias. El worker puede seguirla paso a paso o usar el **Modo Express** (ver §6.2).

*Ejemplo: Administrativo → Política interna → AI Act → Misión → Evaluación → Competencia obtenida.*

### 3.4. Evidencias
El alma del producto; forman el **historial de cumplimiento** presentable ante cualquier auditoría. Cada acción relevante genera una fila en la tabla `evidences` con un `hash_id` único e inmutable:
- Documento leído / política aceptada.
- Test aprobado.
- Misión completada en el Simulador IA.
- Competencia obtenida.
- Certificado emitido (con ID, fecha de emisión y caducidad).

### 3.5. Generador de Temarios
Transforma el conocimiento de la organización —PDFs, Word, Manuales, Procedimientos, Políticas, FAQs— en experiencias de aprendizaje estructuradas mediante IA:
- Resumen automático y extracción de conceptos clave.
- Generación de preguntas y tests.
- Creación de casos prácticos y misiones.
- Tutor IA 24/7 sobre el texto (RAG semántico).
- Búsqueda semántica avanzada sobre la base de conocimiento.

### 3.6. Simulador IA
Entorno seguro donde el worker practica con IA **sin afectar datos reales**. Evalúa tanto la calidad de la respuesta como el **cumplimiento normativo** y las políticas internas.

### 3.7. Motor de Evaluación
Núcleo que decide cuándo un trabajador es **Competente**: puntuación mínima, misiones a completar, periodo de renovación, impacto de nueva normativa en competencias existentes.

### 3.8. Plantillas Inteligentes
Prompts de sistema pre-configurados que el Motor de Reglas usa para **generar misiones dinámicamente** a partir de eventos normativos o de riesgo. Tipos principales:
- **Actualización Normativa**: se activa cuando se detecta un cambio en un chunk legal.
- **Simulación de Amenaza**: evalúa competencias de ciberseguridad (p. ej. phishing IA / deepfake text).

---

## 4. ARQUITECTURA TÉCNICA Y STACK

### 4.1. Frontend
- **Framework:** Next.js 15 — App Router (`/src/app`).
- **Lenguaje:** TypeScript.
- **Estilos:** CSS Vanilla (`globals.css`). Sistema de diseño propio con variables CSS. Estética **Premium Dark Mode** con glassmorphism y micro-animaciones.
- **PDF Generation:** `jspdf` + `html2canvas` para Certificados e Informes de Auditoría generados en el cliente.

### 4.2. Backend y Base de Datos (BaaS)
- **Infraestructura:** Supabase (PostgreSQL).
- **Autenticación:** Supabase Auth + Next.js Middleware.
- **Multi-tenancy:** Row Level Security (RLS) en PostgreSQL. Cada empresa (tenant) es un silo aislado de datos.
- **Vectores:** `pgvector` en Supabase para la tabla `legal_chunks`. Permite búsqueda semántica RAG sobre normativa y políticas internas.

### 4.3. Base de Datos — Tablas Principales (`thoth_v2_schema.sql`)

| Tabla | Descripción |
|---|---|
| `companies` | Tenants. Plan, estado, % consumo IA, `motor_editorial` flag. |
| `profiles` | Usuarios extendidos de `auth.users`. Rol (`worker`, `hr`, `superadmin`), departamento. |
| `competencies` | Catálogo global de competencias (nombre, descripción, categoría). |
| `user_competencies` | Progreso de cada worker en cada competencia (nivel 0-100, estado). |
| `missions` | Catálogo global de misiones. Dificultad, `ai_confidence`, estado de validación. |
| `user_missions` | Asignaciones de misión a worker: estado, score, feedback, fecha de completado. |
| `documents` | Biblioteca de documentos formativos (PDF, Manual, Guía). URL y resumen IA. |
| `user_documents` | Progreso de lectura por usuario (0-100%), estado. |
| `evidences` | **Log inmutable de auditoría.** `hash_id` único e irrepetible por evento. |
| `legal_chunks` | Fragmentos vectorizados de normativa legal para búsqueda semántica RAG. |

> **Nota de inmutabilidad:** `evidences.hash_id` es `UNIQUE NOT NULL` y se genera en el momento del evento. Ningún usuario puede sobreescribirlo, garantizando la integridad del historial ante cualquier auditoría.

### 4.4. Motor de IA — Arquitectura Agnóstica en Dos Capas

- **Capa 1 — Cerebro Documental (Global):** Un único modelo de *embeddings* configurado a nivel de plataforma. Vectoriza **toda** la normativa legal y los documentos de todos los tenants, garantizando que el índice vectorial sea matemáticamente coherente para las auditorías. No es configurable por el cliente.
- **Capa 2 — IA Pensante (Por Tenant):** Configurable por cada empresa. El cliente elige el modelo que procesa misiones y evaluaciones: Claude, Gemini, GPT-4, Mistral u otros con base URL personalizada (BYOK — Bring Your Own Key, plan Enterprise).
- **RAG (Retrieval-Augmented Generation):** fragmenta normativas y políticas en chunks vectorizados (`legal_chunks` + `pgvector`), garantizando respuestas fundamentadas y trazables.

### 4.5. Despliegue
- **Hosting:** Vercel (CI/CD continuo conectado al repositorio).

---

## 5. ESTRUCTURA DE RUTAS DEL SISTEMA

La aplicación detecta el rol automáticamente según la ruta URL activa y adapta la navegación del sidebar. El **"Modo Soporte: Ver Como"** permite alternar entre roles desde el propio sidebar sin cambiar de cuenta (señalizado en amarillo/warning para evitar confusiones operativas).

### 5.1. WORKER (`/worker/`)
| Ruta | Icono | Descripción |
|---|---|---|
| `/worker/panel` | 🏠 | Dashboard personal. Progreso general, misiones pendientes, accesos directos. |
| `/express` | 🧭 | **Ruta Formativa Express.** Flujo guiado multipasos sin interrupciones. |
| `/worker/misiones` | 🎯 | Lista de tareas prácticas asignadas. Acceso al Simulador IA. |
| `/worker/formacion` | 📖 | Centro de Aprendizaje Inteligente + Tutor IA. |
| `/worker/competencias` | 🧠 | Mapa de habilidades del puesto. Nivel, estado, próxima revisión. |
| `/worker/progreso` | 📊 | Descarga de Certificados PDF como prueba de capacitación. |

### 5.2. RECURSOS HUMANOS / COMPLIANCE (`/hr/`)
| Ruta | Icono | Descripción |
|---|---|---|
| `/hr/panel` | 📊 | Visión global del tenant. Competencia global %, riesgo IA, alertas activas, evolución histórica por mes. |
| `/hr/empleados` | 👥 | Gestión de la plantilla y asignación de puestos del Catálogo. |
| `/hr/documentos` | 📁 | Gestor Documental. Subida y gestión de políticas internas. |
| `/hr/certificaciones` | 📜 | Control de certificados: Válidos, A Punto de Vencer, Vencidos. Reasignación de misiones. |
| `/hr/evidencias` | 🛡️ | Centro neurálgico legal. Generación del Informe de Auditoría PDF. |
| `/hr/competencias` | 🧠 | Visión agregada del estado competencial por competencia y por departamento. |
| `/hr/rutas` | — | Gestión de Rutas Formativas asignadas a la plantilla. |
| `/hr/misiones` | — | Control y seguimiento de las misiones asignadas. |
| `/hr/informes` | — | Estadísticas detalladas de cumplimiento. |
| `/hr/actualizaciones` | — | Alertas normativas y workflow de reentrenamiento reactivo. |
| `/hr/politicas` | 📝 | **Generador Guiado de Políticas de IA** — Asistente en 3 pasos para redactar políticas legales a medida. |
| `/hr/configuracion` | — | Ajustes del tenant de la empresa. |

### 5.3. SUPERADMINISTRADOR (`/admin/`)
| Ruta | Icono | Descripción |
|---|---|---|
| `/admin/empresas` | 🏢 | Tabla de control de todos los tenants (clientes SaaS). |
| `/admin/knowledge-studio` | 🧠 | Motor de ingesta y vectorización de documentos. |
| `/admin/marcos` | 🧩 | **Marcos Competenciales** (ver §5.3.1). |
| `/admin/normativa` | ⚖️ | Biblioteca jurídica global. Gestión de chunks legales (AI Act, RGPD, etc.). |
| `/admin/modelos` | 🤖 | Configuración de Modelos de IA y gestión de API Keys. |
| `/admin/planes` | 💳 | Facturación. Desglose de consumo de tokens por empresa. |
| `/admin/informes` | 📊 | Métricas globales de uso de la plataforma. |
| `/admin/infraestructura` | ⚡ | **Estado del Sistema.** Monitorización de costes IA, BD (Supabase) y Vercel. |
| `/admin/configuracion` | ⚙️ | Personalización de Marca Blanca y Datos Fiscales del emisor SaaS. |
| `/admin/usuarios` | — | Gestión de usuarios de la plataforma. |
| `/admin/validacion` | — | Validación y control de calidad de misiones. |

#### 5.3.1. Marcos Competenciales — Sub-secciones
El módulo `/admin/marcos` se divide en tres pestañas:
1. **Diccionario de Competencias:** CRUD de cada competencia con ID, descripción, riesgo (Alto/Medio/Bajo), peso %, fuentes normativas y dependencias entre competencias.
2. **Marcos por Puesto y Nivel:** Tabla que mapea cada combinación Puesto + Seniority con un Marco Competencial y el listado de competencias requeridas.
3. **Plantillas Inteligentes:** Editor de prompts base que el Motor de Reglas usa para generar misiones dinámicas (p. ej. `Plantilla de Actualización Normativa`, `Plantilla de Simulación de Phishing IA`).

---

## 6. LA EXPERIENCIA DEL TRABAJADOR (USER JOURNEY)

### 6.1. Modo Guiado (estándar)
1. **Alta y Asignación Automática:** RRHH da de alta al empleado, le asigna puesto y seniority. THOTH asigna automáticamente el Marco Competencial, Rutas Formativas y Misiones. El trabajador no elige nada.
2. **Primer Acceso:** El worker ve en su Panel: *"Tienes una ruta formativa asignada"*. Pulsa **Comenzar formación**.
3. **Fase de Aprendizaje (Teoría):** Ruta guiada paso a paso. El test de esta fase es de autoevaluación; **no certifica nada**.
4. **Transición a la Práctica:** Superada la teoría, THOTH indica: *"Ahora demuestra que sabes aplicarlo"* y redirige a la primera **Misión** en el Simulador.
5. **Simulador IA:** Se plantea un caso real del puesto. El worker interactúa con el chat IA para resolverlo.
6. **Motor de Evaluación:** Analiza la conversación completa: ¿Cumplió el AI Act? ¿Respetó las políticas internas? ¿Protegió datos personales? ¿Evitó alucinaciones?
7. **Veredicto:**
   - **No competente:** THOTH indica qué falló (ej. *"Has introducido un DNI en el prompt"*) y obliga a repetir o repasar.
   - **Competente:** Marca la competencia como superada, genera las evidencias inmutables y emite el **Certificado Oficial** descargable.

### 6.2. Modo Express (`/express`)
Para situaciones de urgencia normativa. Condensa toda la Ruta Formativa en una experiencia continua y sin interrupciones:
1. **Intro:** Presentación del caso y tiempo estimado (~45 min).
2. **Lectura:** Fragmento de política relevante resumido por IA.
3. **Caso Práctico:** El worker responde al escenario directamente.
4. **Evaluación automática:** El Motor analiza la respuesta en tiempo real.
5. **Éxito / Repetición:** Si supera el umbral, el certificado queda disponible inmediatamente.

---

## 7. FLUJO DE TRABAJO TÍPICO (END-TO-END)

1. **Setup (Admin):** El Superadmin registra una nueva empresa, configura API Keys y define los Marcos Competenciales para los puestos del cliente.
2. **Onboarding (HR):** RRHH invita a empleados y les asigna puesto + nivel. THOTH asigna automáticamente competencias, rutas y misiones.
3. **Capacitación (Worker):** El trabajador accede al Generador de Temarios, completa la Ruta Formativa y practica en el Simulador IA.
4. **Certificación (Worker):** Al demostrar estado *Competente*, descarga su certificado con ID, datos, competencia superada y fechas de emisión/caducidad.
5. **Auditoría (HR):** RRHH accede a **Evidencias Legales** y genera el PDF de Compliance para presentar ante una inspección.
6. **Alerta Normativa (Motor de Reglas):** Al detectar una actualización en un chunk legal, el sistema activa una Plantilla Inteligente, asigna nuevas misiones a los workers afectados y notifica a RRHH.
7. **Facturación (Admin):** El Superadmin revisa el módulo de Facturación para cobrar a cada empresa según consumo de tokens y workers activos.

---

## 8. CARACTERÍSTICAS DIFERENCIALES

### 8.1. Modo Soporte "Ver Como"
Disponible en el sidebar para usuarios de soporte. Alterna entre las tres vistas de rol (WRK / HR / ADM) sin cambiar de cuenta. Señalizado visualmente en amarillo/warning para evitar confusiones operativas.

### 8.2. Caducidad de Competencias y Renovación
Las competencias llevan **Fecha de Caducidad**. El módulo de Certificaciones de HR muestra en tiempo real: Válido ✅ / A Punto de Vencer ⚠️ / Vencido ❌. Ante un certificado vencido, RRHH puede disparar directamente la reasignación de la misión correspondiente.

### 8.3. Historial de Evolución Competencial
El Panel HR incluye un gráfico de barras mes a mes. Demuestra el impacto de eventos normativos y la capacidad de recuperación de la organización (ej. *"La caída en Mayo refleja la entrada en vigor del AI Act. El sistema reentrenó a la plantilla en 3 semanas"*).

### 8.4. White Label (Marca Blanca)
El Superadmin personaliza la plataforma para cada cliente: nombre, logotipo, color principal y secundario (`/admin/configuracion`). Permite a distribuidores ofrecer THOTH bajo su propia marca.

### 8.5. Dependencias entre Competencias
El Diccionario soporta un grafo de dependencias. Una competencia avanzada solo se desbloquea cuando el worker ha superado las competencias base que la requieren, garantizando una adquisición progresiva y ordenada del conocimiento.

---

## 9. MODELO DE NEGOCIO (SaaS B2B)

**Propuesta de valor:** Las empresas no compran cursos; compran **tranquilidad jurídica y visibilidad**. Mitigación de riesgo legal, trazabilidad de formación y eficiencia operativa en compliance.

### 9.1. Planes de Precios

| Plan | Precio | Capacidad | Características |
|---|---|---|---|
| **Acreditado 🆔** | 29 €/mes | 1 usuario | Para autónomos y consultores. IA incluida, certificados y evidencias. |
| **Control Equipo 👥** | 99 €/mes (base) | Hasta 15 workers | Panel HR, Asistente Redactor Legal, Generador de Temarios básico. (+12 €/mes por empleado extra). |
| **Escudo Digital 📄** | 149 € (Pago único) | Solo documentación | Asistente Redactor Legal, Dossier PDF. Sin mantenimiento mensual ni acceso a la plataforma. |
| **Corporativo 👑** | A medida | Workers ilimitados | Generador de Temarios avanzado, SSO, BYOK, soporte prioritario. |

### 9.2. Feature Flags — Motor Editorial
En la tabla de empresas del Admin existe el interruptor **Motor Editorial** (por defecto `OFF`). Solo se activa para clientes que necesiten construir sus propias matrices de conocimiento a medida (typically plan Enterprise). Permite controlar qué clientes tienen capacidad de crear bases de conocimiento propietarias vs. usar únicamente los marcos globales de THOTH.

### 9.3. Facturación Automatizada
Gestionada desde `/admin/planes`. El consumo de tokens de IA se registra por tenant (`ai_consumption_percentage` en `companies`). Las facturas PDF se generan automáticamente usando los datos fiscales del Superadmin configurados en `/admin/configuracion` (Razón Social, CIF, Dirección fiscal, IBAN).

---

## 10. MÓDULO: GENERADOR GUIADO DE POLÍTICAS DE IA (`/hr/politicas`)

> **Filosofía:** En lugar de pedir a la empresa que suba un documento que probablemente no tiene, THOTH le hace tres preguntas y redacta el texto legal por ella. El resultado se inyecta automáticamente en el Generador de Temarios para que los trabajadores reciban formación sobre su propia política real.

### El Problema que Resuelve
La mayoría de PYMEs no tienen una Política de Uso de IA. Contratar un abogado para redactarla cuesta entre 500€ y 2.000€. Sin política documentada, no hay compliance. Sin compliance, THOTH no puede generar evidencias auditables. **Este módulo rompe ese bloqueo inicial** en menos de 10 minutos.

### Paso 1 — Configurador Visual (Inputs Rápidos)
Una interfaz de checkboxes agrupada en tres bloques:

**Bloque A: Lista Blanca de Herramientas**
La empresa selecciona con un click las herramientas de IA que tiene autorizadas oficialmente:
`[x] ChatGPT` `[x] Microsoft Copilot` `[x] Canva IA` `[ ] Gemini` `[ ] GitHub Copilot` `[ ] Perplexity` `[+ Añadir herramienta personalizada]`
→ *Output: genera automáticamente la "Lista Blanca Oficial" de la empresa.*

**Bloque B: Protocolo de Inputs Prohibidos**
La empresa marca qué categorías de datos está prohibido introducir en herramientas de IA:
`[x] Datos personales de clientes (DNI, email, teléfono)` `[x] Código fuente propietario` `[x] Información financiera confidencial` `[ ] Datos de empleados` `[ ] Contratos en vigor`
→ *Output: redacta el "Protocolo de Datos Prohibidos" específico.*

**Bloque C: Contexto Legal de la Empresa**
`[ ] ¿Usáis IA en procesos que afectan a empleados (selección, evaluación de rendimiento)?`
`[ ] ¿Hay representantes de los trabajadores (RLT / sindicato)?`
→ *Si marcan RLT: el sistema añade la cláusula informativa obligatoria exigida por el Art. 64 del Estatuto de los Trabajadores.*

### Paso 2 — Generación Legal con IA ⚡
Al pulsar **"Generar Política de IA"**, el motor RAG de THOTH combina las respuestas del Paso 1 con los artículos relevantes del AI Act y el RGPD para redactar en segundos **dos documentos legales listos para usar**:

1. **Política de Uso Aceptable de IA** — Documento para publicar en la intranet o enviar por email a toda la plantilla. Incluye: objetivo, herramientas autorizadas, usos prohibidos, sanciones y fecha de vigor.
2. **Cláusula de Confidencialidad y Uso de IA** — Texto jurídico listo para que RRHH lo adjunte a los contratos de trabajo de nuevos empleados o como anexo de los contratos existentes.

> **Integración automática con Generador de Temarios:** Ambos documentos se inyectan directamente en el Centro de Aprendizaje Inteligente del tenant. THOTH los resume automáticamente y los convierte en el material base de las Rutas Formativas de los trabajadores. El empleado aprende sobre *su propia política real*, no sobre un texto genérico.

### Paso 3 — Dossier Final de Cumplimiento (PDF) 🖨️
Una vez que los trabajadores han completado sus misiones y evaluaciones sobre la política generada, el botón **"Emitir Dossier de Compliance"** imprime un PDF único que contiene:
- La Política de Uso Aceptable firmada y versionada.
- La Lista Blanca de herramientas autorizadas.
- El listado de empleados con estado *Competente* respecto a esa política.
- Las evidencias inmutables generadas durante el proceso.

Este documento es **la respuesta legal completa** que una empresa puede presentar ante una inspección de la AEPD o la autoridad de supervisión del AI Act.

### Ruta en la App
`/hr/politicas` — Accesible desde el sidebar de RRHH con icono 📝.

---

*Documento interno de referencia técnica y funcional — ANTIGRAVITY / THOTH AI Platform — Julio 2026.*

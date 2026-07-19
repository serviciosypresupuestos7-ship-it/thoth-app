# MANUAL DE USO: THOTH AI PLATFORM

**Posicionamiento Core:** THOTH no es un LMS (Learning Management System) ni un creador de cursos. THOTH es una **Plataforma de Gestión de Competencias en IA y Cumplimiento Continuo**. Su objetivo no es que la gente "estudie", sino medir, entrenar, demostrar y mantener actualizada la capacidad de la empresa para usar la IA de forma legal y segura, mitigando riesgos corporativos.

Este manual describe el funcionamiento de la plataforma desde los tres roles principales: **Superadministrador**, **Recursos Humanos / Compliance (Cliente)** y **Trabajador (Usuario Final)**.

---

## 1. ROL: SUPERADMINISTRADOR (Dueño de THOTH)

El Superadministrador tiene el control total sobre la plataforma, la infraestructura de IA y la gestión de clientes.

### 1.1. Gestión de Empresas y Facturación
*   **Ruta:** `Admin > Empresas` / `Admin > Facturación`
*   **Uso:** Aquí das de alta a los nuevos clientes. El modelo de negocio se basa en el valor aportado (mitigación de riesgos por usuario) y no en tokens.
*   **Planes:**
    *   **Individual (29€/mes):** Para profesionales independientes.
    *   **Empresa (99€/mes):** Hasta 15 trabajadores incluidos.
    *   **Enterprise (A medida):** Trabajadores ilimitados, SSO, BYOK (Bring Your Own Key).
*   **Feature Flags (Interruptores):** En la tabla de empresas, verás la columna **"Motor Editorial"**. Por defecto está en `OFF`. Solo se activa para clientes que necesiten crear sus propias matrices de conocimiento a medida.

### 1.2. Arquitectura Agnóstica de IA (Capa 1 y Capa 2)
*   **Capa 1 (Cerebro Documental):** Configurado a nivel global. Utiliza un único modelo de embeddings para vectorizar TODAS las leyes y documentos, garantizando que el índice vectorial sea matemáticamente coherente para las auditorías.
*   **Capa 2 (IA Pensante):** Configurable por cada empresa. El cliente elige si quiere que las misiones y evaluaciones se procesen con Claude, Gemini, GPT o Mistral.

---

## 2. ROL: RECURSOS HUMANOS / COMPLIANCE (Cliente)

Este es el panel de control de la empresa. Aquí no se compran cursos, se compra **tranquilidad jurídica y visibilidad**.

### 2.1. Dashboard de Competencias y Matriz de Riesgos
*   **Ruta:** `HR > Panel`
*   **Uso:** La vista principal de Compliance. Muestra en tiempo real el estado de la empresa:
    *   **Competencia IA por Departamento:** Marketing (82%), RRHH (96%), Compras (54%), Dirección (91%).
    *   **Matriz de Riesgos:** Identifica qué departamentos tienen un "Riesgo Alto" de cometer infracciones (ej. uso de IA no autorizada con datos sensibles) por falta de competencia demostrada.

### 2.2. Seguimiento Continuo y Auto-Actualización
*   **El Flujo de Valor:** THOTH no forma una vez y se olvida. Si Europa cambia un artículo del AI Act o del RGPD:
    1. THOTH actualiza su base jurídica.
    2. El sistema detecta automáticamente qué trabajadores están afectados por ese cambio según su rol.
    3. Se les asigna una "Misión de Actualización" inmediata.
    4. Al completarla, el nivel de cumplimiento de la empresa vuelve al 100%.

### 2.3. Gestor Documental y Knowledge Studio
*   **Ruta:** `HR > Gestor Documental` / `Knowledge Studio`
*   **Uso:** RRHH sube sus políticas internas. El Knowledge Studio no es para "hacer cursillos", sino para estructurar el conocimiento legal en módulos versionados e inmutables. Estos módulos son la *fuente de la verdad* de la que beben las misiones diarias de los trabajadores.

---

## 3. ROL: TRABAJADOR (Usuario Final)

El trabajador no entra a THOTH a "estudiar un curso". Entra a mantener su "Licencia de Vuelo" en IA.

### 3.1. Dinámica Diaria (Micro-Engagement)
*   **Ruta:** `Worker > Panel`
*   **Uso:** La interfaz es dinámica y orientada a la acción. Al entrar, el trabajador ve:
    *   *✓ 1 Misión nueva asignada (Caso práctico).*
    *   *✓ 1 Simulación pendiente.*
    *   *✓ 1 Recordatorio de política interna.*
*   **Ejemplo de Misión:** *"Eres de RRHH. Un candidato pide que no uses IA para filtrar su CV. ¿Qué haces según el Art. 5 del RGPD y la política interna?"*
*   El trabajador responde, y el Tutor IA evalúa su respuesta basándose estrictamente en el índice vectorial, actualizando su nivel de competencia en tiempo real en el Dashboard de RRHH.

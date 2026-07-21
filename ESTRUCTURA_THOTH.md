# Estructura Arquitectónica de THOTH (Sistema Operativo de Competencias IA)

## 1. Vista Trabajador (El Pasillo de Cualificación)
El panel del trabajador (`/worker`) está diseñado para formar sin saturar, dividiendo el aprendizaje en 4 fases clave:

- **🎯 Fase Cero (Test de Nivel / Radar)**: Autoevaluación inicial obligatoria (10 preguntas generadas por IA) para determinar el nivel base del empleado y asignarle la ruta adecuada (Inicial o Express).
- **📖 Nivel Inicial (Alfabetización Base)**: Onboarding para perfiles sin conocimientos. Módulos de lectura cortos (extraídos del curso maestro) sobre conceptos básicos (Qué es IA, RGPD, riesgos) seguidos de validación. Hito: *Certificado de Alfabetización Básica*.
- **� Nivel Medio / Express (Cualificación por Rol)**: Formación 100% práctica y específica para su puesto (Administración, RRHH, Comercial). Uso del **Simulador IA** con misiones reales (ej. redactar un email sin violar privacidad). Hito: *Certificado de Competencia Específica*.
- **� Formación Continua (Radar de Actualizaciones)**: Micro-píldoras de 3 minutos que saltan automáticamente cuando hay cambios en la ley (AI Act) o en las políticas de la empresa, manteniendo el cumplimiento vivo.
- **� Biblioteca a la Carta**: Acceso a los módulos del curso maestro que aplican a su rol, con opción de descargar su propio manual en PDF.

## 2. Vista Recursos Humanos (Gestión y Cumplimiento Estándar)
El panel de RRHH (`/hr`) es el motor de control para la empresa cliente. Genera la documentación legal necesaria para cubrirse las espaldas:

- **📝 Generador de Reglamento Interno**: Herramienta IA que redacta las políticas de uso de IA adaptadas al sector de la empresa, cumpliendo la "Regla de Oro".
- **✍️ Gestor de Firmas y Documentos**: Generación automática de PDFs de "Acuse de Recibo y Conformidad" listos para imprimir. El trabajador firma que ha recibido la capacitación y acepta el reglamento interno.
- **� Dossier de Capacitación (Reporte Estándar)**: Documento ejecutivo que demuestra que la plantilla ha sido formada, adjuntando los temarios impartidos y el registro de firmas.
- **� Gestión de Plantilla**: Asignación quirúrgica de módulos según el departamento del empleado.

## 3. 🛡️ ESCUDO DIGITAL (Producto Premium / Venta Separada)
Ruta independiente (`/escudo-digital`). Es el producto de alto valor (Upsell) diseñado para blindar a la empresa ante inspecciones de la AEPD o la AESIA.

- **� Dossier Auditable Premium**: Un paquete documental de alta fidelidad generado en PDF que consolida:
  - Políticas internas de IA.
  - Trazabilidad de que todo el contenido impartido cumple la *Regla de Oro* (fidelidad legal 100%).
  - Certificados individuales de competencia de cada trabajador.
  - Evidencias de formación continua (micro-píldoras).
- **� Gestor de Evidencias Externas**: Permite subir certificados ISO u otras normativas para incluirlas en el dossier final.
- **⚖️ Sello de Garantía Legal**: Demuestra proactividad y cumplimiento estricto de la normativa europea.

## 4. Vista Superadministrador de THOTH (Administración Global)
El panel de control maestro (`/admin`) para gestionar el SaaS:

- **⚖️ Auditoría de Cursos (Regla de Oro)**: Herramienta local/web donde la IA audita cursos masivos (ej. 400 páginas), los corrige bloque a bloque para asegurar 100% de fidelidad legal y los sube a la base de datos (`courses` -> `course_modules` -> `module_contents`).
- **✅ Centro de Validación (Human-in-the-loop)**: Revisión humana de las misiones y preguntas generadas por la IA antes de publicarlas a los clientes.
- **🏢 Gestión de Empresas (Tenants)**: Control de clientes, planes de facturación, consumo de tokens IA y activación del módulo premium "Escudo Digital".
- **� Motor Editorial**: Gestión centralizada de la base de datos legal (Leyes, Normas) que alimenta la Regla de Oro de toda la plataforma.

const fs = require('fs');

// Update review page
let reviewContent = fs.readFileSync('src/app/(dashboard)/review/page.tsx', 'utf8');
reviewContent = reviewContent.replace('El trabajador no debe aceptar ciegamente las respuestas de la IA. Debe verificar la información antes de tomar decisiones.', 'Obligación de establecer medidas de control humano sobre los sistemas de IA de alto riesgo para evitar decisiones automatizadas sin supervisión.');
reviewContent = reviewContent.replace('Redactar un correo a un cliente con plazos de entrega', 'Uso de IA para redactar contratos o comunicaciones vinculantes.');
reviewContent = reviewContent.replace('La IA inventa plazos de entrega incorrectos y se envía información falsa al cliente.', 'Aceptación automática de resultados generados por IA que puedan contener errores jurídicos o plazos incorrectos.');
reviewContent = reviewContent.replace('La empresa debe capacitar a sus empleados para que usen la IA de forma segura, ética y eficiente.', 'Obligación de capacitar al personal en el uso seguro, ético y eficiente de los sistemas de inteligencia artificial.');
reviewContent = reviewContent.replace('Diseñar el plan de formación anual de la plantilla', 'Diseño e implementación de planes de formación corporativa.');
reviewContent = reviewContent.replace('Los empleados usan herramientas de IA sin conocer sus limitaciones, exponiendo datos confidenciales.', 'Uso indebido de herramientas de IA por desconocimiento de sus limitaciones, exponiendo datos confidenciales o vulnerando el RGPD.');
reviewContent = reviewContent.replace('Supervisa y aprueba el conocimiento extraído por la IA.', 'Toda propuesta es revisada por un experto antes de incorporarse al conocimiento validado del sistema.');
reviewContent = reviewContent.replace('Propuesta de Entrenamiento (IA)', 'THOTH ha identificado los siguientes elementos jurídicos');
reviewContent = reviewContent.replace('Explicación en Lenguaje Sencillo', 'Interpretación jurídica');
reviewContent = reviewContent.replace('Tarea Laboral Cotidiana', 'Aplicación práctica');
reviewContent = reviewContent.replace('Riesgo Práctico', 'Riesgos jurídicos');
fs.writeFileSync('src/app/(dashboard)/review/page.tsx', reviewContent);

// Update search page
let searchContent = fs.readFileSync('src/app/(dashboard)/search/page.tsx', 'utf8');
searchContent = searchContent.replace(
    /setAnswer\([\s\S]*?\);/,
    `setAnswer(
        "**Normativa aplicable**\\n" +
        "- AI Act (Art. 4, Art. 14)\\n\\n" +
        "**Obligaciones detectadas**\\n" +
        "- Es obligatorio que los sistemas de IA de alto riesgo sean supervisados por personas físicas para prevenir riesgos legales.\\n" +
        "- Los responsables del despliegue deben garantizar un nivel suficiente de alfabetización en IA de su personal.\\n\\n" +
        "**Riesgos jurídicos**\\n" +
        "- Aceptación automática de resultados generados por IA que puedan contener errores jurídicos o plazos incorrectos.\\n\\n" +
        "**Recomendaciones**\\n" +
        "- No enviar contratos generados por IA directamente. Establecer un proceso de revisión humana obligatoria.\\n\\n" +
        "**THOTH ha detectado además:**\\n" +
        "- Existe una guía publicada por la Comisión Europea sobre la supervisión humana en sistemas de IA de alto riesgo.\\n\\n" +
        "*Durante el análisis se han identificado 2 obligaciones, 1 riesgo jurídico, 2 fuentes oficiales aplicables y 1 guía complementaria relevante.*"
    );`
);
searchContent = searchContent.replace('Relevancia: {Math.round(result.similarity * 100)}%', '{result.similarity > 0.85 ? "Fuente principal" : "Fuente complementaria"}');
fs.writeFileSync('src/app/(dashboard)/search/page.tsx', searchContent);

console.log('Files updated successfully!');

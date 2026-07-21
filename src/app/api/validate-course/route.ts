import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { courseContent } = await request.json();

        if (!courseContent) {
            return NextResponse.json({ error: 'Falta el contenido del curso' }, { status: 400 });
        }

        const prompt = `
Por favor, audita el siguiente contenido de un curso de formación para trabajadores.
Debes aplicar la 'Regla de Oro': el contenido debe ser 100% fiel a la normativa legal (como la Ley de IA, RGPD, etc.).
Identifica cualquier afirmación que sea legalmente inexacta, ambigua o que contradiga las normativas.

Contenido del curso:
---
${courseContent.substring(0, 15000)}
---
`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres un auditor legal experto en Inteligencia Artificial y cumplimiento normativo. Tu objetivo es aplicar la 'Regla de Oro': todo contenido de formación debe ser estrictamente fiel a las leyes, normas y reglamentos vigentes. Responde únicamente en formato JSON válido." },
                { role: "user", content: prompt }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "course_validation",
                    schema: {
                        type: "object",
                        properties: {
                            cumple_regla_de_oro: { type: "boolean" },
                            puntuacion_fidelidad: { type: "number" },
                            infracciones_detectadas: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        texto_problematico: { type: "string" },
                                        motivo: { type: "string" },
                                        sugerencia_correccion: { type: "string" }
                                    },
                                    required: ["texto_problematico", "motivo", "sugerencia_correccion"],
                                    additionalProperties: false
                                }
                            },
                            conclusion: { type: "string" }
                        },
                        required: ["cumple_regla_de_oro", "puntuacion_fidelidad", "infracciones_detectadas", "conclusion"],
                        additionalProperties: false
                    },
                    strict: true
                }
            }
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Error validando curso:', error);
        return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
    }
}

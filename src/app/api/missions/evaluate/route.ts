import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import rateLimit from '@/utils/rate-limit';

export const maxDuration = 10; // Fuerza a que la petición muera a los 10 segundos

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request: Request) {
    try {
        // Rate Limiting (5 requests per minute per IP)
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        try {
            await limiter.check(5, ip);
        } catch {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { mission_id, employee_response } = await request.json();
        if (!mission_id || !employee_response) {
            return NextResponse.json({ error: 'mission_id and employee_response are required' }, { status: 400 });
        }

        // Fetch mission details
        const { data: mission, error: missionError } = await supabase
            .from('missions')
            .select('*')
            .eq('id', mission_id)
            .single();

        if (missionError || !mission) {
            return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
        }

        // Fetch tenant settings for AI keys
        const { data: settings } = await supabase
            .from('tenant_settings')
            .select('openai_api_key, anthropic_api_key, groq_api_key, gemini_api_key, preferred_model')
            .eq('tenant_id', user.id)
            .single();

        const openaiKey = process.env.OPENAI_API_KEY || settings?.openai_api_key || '';
        const anthropicKey = settings?.anthropic_api_key || '';
        const groqKey = settings?.groq_api_key || '';
        const geminiKey = settings?.gemini_api_key || '';
        const preferredModel = settings?.preferred_model || 'gpt-4o-mini';

        // 1. Find relevant legal chunks for evaluation
        // In a real app, we'd use embeddings to find the most relevant chunks for the employee's response
        // For now, we'll fetch a few chunks from the ai_literacy domain
        const { data: chunks, error: chunksError } = await supabase
            .from('legal_chunks')
            .select('id, title, section, text')
            .eq('domain_id', 'ai_literacy')
            .limit(5);

        const contextText = (chunks || []).map(c => `Documento: ${c.title}\nSección: ${c.section}\nTexto: ${c.text}`).join('\n\n');

        const prompt = `Eres un evaluador experto en cumplimiento normativo (AI Act, RGPD) y alfabetización en IA.
Tu objetivo es evaluar la respuesta de un empleado a una "Misión" práctica.

Misión:
Título: ${mission.title}
Descripción: ${mission.description}

Respuesta del empleado:
"${employee_response}"

Contexto Legal Oficial (Úsalo estrictamente para evaluar, NO te inventes normas):
${contextText}

Evalúa la respuesta del empleado. ¿Ha cumplido con la normativa? ¿Ha cometido algún error de privacidad o seguridad?
Responde ÚNICAMENTE en formato JSON con las siguientes claves:
- "ai_correction": Feedback constructivo para el empleado, citando la norma infringida o cumplida.
- "score": Un número del 0 al 100 indicando la calidad de la respuesta.
- "passed": Booleano (true o false) indicando si el empleado ha superado la misión.
- "evidence_used": Array de strings con los títulos de los documentos legales usados para la corrección.`;

        let evaluationData: any;

        if (!openaiKey && !anthropicKey && !groqKey && !geminiKey) {
            // Mock mode
            evaluationData = {
                ai_correction: `[Mock] Tu respuesta ha sido evaluada. Recuerda siempre no compartir datos personales con la IA.`,
                score: 85,
                passed: true,
                evidence_used: ['RGPD (Mock)']
            };
        } else {
            try {
                if (preferredModel.startsWith('claude-')) {
                    const res = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                            'x-api-key': anthropicKey,
                            'anthropic-version': '2023-06-01',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            model: preferredModel,
                            max_tokens: 1024,
                            system: 'Responde únicamente en formato JSON válido.',
                            messages: [{ role: 'user', content: prompt }]
                        })
                    });
                    const data = await res.json();
                    if (data.error) throw new Error(data.error.message);
                    evaluationData = JSON.parse(data.content[0].text);
                } else {
                    let apiUrl = 'https://api.openai.com/v1/chat/completions';
                    let apiKey = openaiKey;

                    if (preferredModel.startsWith('llama') || preferredModel.startsWith('mixtral')) {
                        apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
                        apiKey = groqKey;
                    } else if (preferredModel.startsWith('gemini')) {
                        apiUrl = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
                        apiKey = geminiKey;
                    }

                    const res = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: preferredModel,
                            max_tokens: 300, // Límite estricto para evitar sobrecostes
                            messages: [
                                { role: 'system', content: 'Responde únicamente en formato JSON válido.' },
                                { role: 'user', content: prompt },
                            ],
                            response_format: { type: 'json_object' },
                        }),
                    });
                    const data = await res.json();
                    if (data.error) throw new Error(data.error.message);
                    evaluationData = JSON.parse(data.choices[0].message.content);
                }
            } catch (err) {
                console.error('Error calling AI:', err);
                return NextResponse.json({ error: 'Failed to evaluate mission with AI' }, { status: 500 });
            }
        }

        // Save result to database
        const { data: insertedResult, error: insertError } = await supabase
            .from('mission_results')
            .insert([{
                tenant_id: user.id, // Assuming tenant_id is user.id for now
                employee_id: user.id, // Assuming the user is the employee
                mission_id: mission_id,
                employee_response: employee_response,
                ai_correction: evaluationData.ai_correction,
                score: evaluationData.score,
                passed: evaluationData.passed,
                evidence_used: evaluationData.evidence_used
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({ result: insertedResult });

    } catch (error: any) {
        console.error('API evaluate mission error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

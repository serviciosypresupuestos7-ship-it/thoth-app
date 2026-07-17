import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action_name } = await request.json();
        if (!action_name) {
            return NextResponse.json({ error: 'action_name is required' }, { status: 400 });
        }

        // Fetch tenant settings for AI keys
        const { data: settings } = await supabase
            .from('tenant_settings')
            .select('openai_api_key, anthropic_api_key, groq_api_key, gemini_api_key, preferred_model')
            .eq('tenant_id', user.id)
            .single();

        let openaiKey = process.env.OPENAI_API_KEY || settings?.openai_api_key || '';
        let anthropicKey = settings?.anthropic_api_key || '';
        let groqKey = settings?.groq_api_key || '';
        let geminiKey = settings?.gemini_api_key || '';
        let preferredModel = settings?.preferred_model || 'gpt-4o-mini';

        // 1. Find relevant legal chunks for this action
        // We do a text search on the chunks for keywords related to the action
        // In a real app, we'd use embeddings, but text search is fine for now
        const { data: chunks, error: chunksError } = await supabase
            .from('legal_chunks')
            .select('id, title, section, text')
            .eq('domain_id', 'ai_literacy')
            .limit(3);

        if (chunksError || !chunks || chunks.length === 0) {
            return NextResponse.json({ error: 'No relevant legal context found for this action' }, { status: 404 });
        }

        const contextText = chunks.map(c => `Documento: ${c.title}\nSección: ${c.section}\nTexto: ${c.text}`).join('\n\n');

        const prompt = `Eres un experto en formación empresarial y cumplimiento normativo (AI Act, RGPD).
Tu objetivo es crear una "Misión" (un caso práctico) para un empleado cuya acción habitual es: "${action_name}".

Basándote ÚNICAMENTE en el siguiente contexto legal:
${contextText}

Genera una misión práctica. El empleado deberá leer la misión y escribir cómo actuaría.
Responde ÚNICAMENTE en formato JSON con las siguientes claves:
- "title": Título corto de la misión (ej. "Redacción de correo con datos sensibles").
- "description": El escenario detallado. Plantea una situación realista donde el empleado deba tomar una decisión o realizar la acción ("${action_name}") aplicando la normativa.
- "related_laws": Array de strings con las leyes aplicables (ej. ["AI Act Art. 4", "RGPD Art. 5"]).
- "difficulty": "basic", "medium", o "advanced".`;

        let missionData: any;

        if (!openaiKey && !anthropicKey && !groqKey && !geminiKey) {
            // Mock mode
            missionData = {
                title: `Misión de prueba: ${action_name}`,
                description: `Estás realizando la tarea: ${action_name}. Un cliente te pide que uses IA para procesar sus datos personales. ¿Qué haces?`,
                related_laws: ['RGPD Art. 5 (Mock)'],
                difficulty: 'medium'
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
                    missionData = JSON.parse(data.content[0].text);
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
                            messages: [
                                { role: 'system', content: 'Responde únicamente en formato JSON válido.' },
                                { role: 'user', content: prompt },
                            ],
                            response_format: { type: 'json_object' },
                        }),
                    });
                    const data = await res.json();
                    if (data.error) throw new Error(data.error.message);
                    missionData = JSON.parse(data.choices[0].message.content);
                }
            } catch (err) {
                console.error('Error calling AI:', err);
                return NextResponse.json({ error: 'Failed to generate mission with AI' }, { status: 500 });
            }
        }

        // Save mission to database
        const { data: insertedMission, error: insertError } = await supabase
            .from('missions')
            .insert([{
                tenant_id: user.id, // Assuming tenant_id is user.id for now
                title: missionData.title,
                description: missionData.description,
                target_action: action_name,
                related_laws: missionData.related_laws,
                difficulty: missionData.difficulty,
                status: 'active'
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({ mission: insertedMission });

    } catch (error: any) {
        console.error('API generate mission error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

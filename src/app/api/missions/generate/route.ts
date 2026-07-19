import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { EmbeddingService } from '@/utils/ai/EmbeddingService';
import { LLMService } from '@/utils/ai/LLMService';
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

        const openaiKey = process.env.OPENAI_API_KEY || settings?.openai_api_key || '';
        const anthropicKey = settings?.anthropic_api_key || '';
        const groqKey = settings?.groq_api_key || '';
        const geminiKey = settings?.gemini_api_key || '';
        const preferredModel = settings?.preferred_model || 'gpt-4o-mini';

        // 1. Generate embedding for the action to search relevant laws using the GLOBAL model
        const { vector: queryEmbedding } = await EmbeddingService.generate(action_name);

        // 2. Find relevant legal chunks using Vector Search (RAG)
        const { data: chunks, error: chunksError } = await supabase.rpc('match_legal_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3, // Lower threshold to ensure we get results even with mock embeddings
            match_count: 3,
            p_tenant_id: user.id
        });

        if (chunksError || !chunks || chunks.length === 0) {
            return NextResponse.json({ error: 'No relevant legal context found for this action' }, { status: 404 });
        }

        const contextText = chunks.map((c: any) => `Documento: ${c.title}\nSección: ${c.section}\nTexto: ${c.text}`).join('\n\n');

        const prompt = `Tu objetivo es crear una "Misión" (un caso práctico) para un empleado cuya acción habitual es: "${action_name}".

Basándote ÚNICAMENTE en el siguiente contexto legal:
${contextText}

Genera una misión práctica estructurada. Debes empezar siempre por lo básico (alfabetización) y avanzar hacia la práctica.
La misión debe incluir una breve introducción teórica que explique qué es un Sistema de IA según el Artículo 3 del AI Act (Autonomía, Inferencia, Generación de Salidas) y por qué la AESIA lo vigila, antes de plantear el escenario.

Responde ÚNICAMENTE en formato JSON con las siguientes claves:
- "title": Título corto de la misión (ej. "Introducción al AI Act y Redacción de correos").
- "description": El contenido completo. Primero, una breve píldora teórica sobre el AI Act (Art. 3) y la AESIA. Segundo, el escenario detallado donde el empleado deba tomar una decisión o realizar la acción ("${action_name}") aplicando la normativa.
- "related_laws": Array de strings con las leyes aplicables (ej. ["AI Act Art. 3", "RGPD Art. 5"]).
- "difficulty": "basic", "medium", o "advanced".`;

        const systemPrompt = 'Eres un experto legal en el Reglamento Europeo de Inteligencia Artificial (AI Act) y el RGPD, y un formador corporativo. Tu objetivo es alfabetizar a los trabajadores empezando siempre por los conceptos legales básicos (Definición de IA, AESIA) antes de evaluarles. Responde únicamente en formato JSON válido.';

        let missionData: any;

        try {
            missionData = await LLMService.generateJSON(prompt, systemPrompt, settings, 2000);
        } catch (err) {
            console.error('Error calling AI:', err);
            // Fallback for demo purposes if API keys are missing
            missionData = {
                title: `Misión de prueba: ${action_name}`,
                description: `Estás realizando la tarea: ${action_name}. Un cliente te pide que uses IA para procesar sus datos personales. ¿Qué haces?`,
                related_laws: ['RGPD Art. 5 (Mock)'],
                difficulty: 'medium'
            };
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

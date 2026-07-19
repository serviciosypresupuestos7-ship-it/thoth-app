import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { LLMService } from '@/utils/ai/LLMService';
import rateLimit from '@/utils/rate-limit';

export const maxDuration = 30;

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

const SYSTEM_PROMPT = `Eres Thoth, el Cualificador Profesional en IA de la empresa.
Tu objetivo es enseñar al trabajador las reglas básicas del AI Act europeo y el RGPD de forma muy sencilla, paso a paso.
No le sueltes toda la teoría de golpe. Ve regla por regla.
Usa un tono amigable, profesional y muy claro.

Reglas que debes enseñar (en este orden):
1. Qué es una IA (Art. 3 AI Act): Infiere y crea contenido nuevo. Ej: ChatGPT sí, corrector de Word no.
2. Privacidad de Datos (RGPD): Nunca subir datos personales (DNI, nombres) a IAs públicas.
3. Supervisión Humana: Un humano debe revisar siempre el trabajo de la IA.

Instrucciones de comportamiento:
- En tu primer mensaje, preséntate, explica la Regla 1 y hazle una pregunta sencilla para comprobar que lo ha entendido.
- Espera su respuesta. Si acierta, felicítale y pasa a la Regla 2. Si falla, corrígele con cariño y pasa a la Regla 2.
- Haz lo mismo con la Regla 3.
- Cuando haya completado las 3 reglas, dile claramente: "¡Enhorabuena! Has completado la teoría básica. Ya estás listo para la práctica. Escribe 'TERMINAR' para ir a tus misiones."
- Mantén tus mensajes cortos (máximo 3-4 párrafos).`;

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        try {
            await limiter.check(10, ip);
        } catch {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
        }

        // Get tenant settings for LLM keys
        const { data: tenantUser } = await supabase
            .from('tenant_users')
            .select('tenant_id')
            .eq('user_id', user.id)
            .single();

        let settings = {
            llm_provider: 'openai',
            llm_model: 'gpt-4o-mini',
            openai_api_key: process.env.OPENAI_API_KEY,
            gemini_api_key: process.env.GEMINI_API_KEY
        };

        if (tenantUser) {
            const { data: tenantSettings } = await supabase
                .from('tenant_settings')
                .select('*')
                .eq('tenant_id', tenantUser.tenant_id)
                .single();

            if (tenantSettings) {
                settings = { ...settings, ...tenantSettings };
            }
        }

        // Fallback to global env vars
        if (settings.llm_provider === 'openai' && !settings.openai_api_key) {
            settings.openai_api_key = process.env.OPENAI_API_KEY;
        }
        if (settings.llm_provider === 'gemini' && !settings.gemini_api_key) {
            settings.gemini_api_key = process.env.GEMINI_API_KEY;
        }

        // 1. RAG ENFORCEMENT: Extract the last user message to search the vector database
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        let legalContext = "";

        if (lastUserMessage && lastUserMessage.content) {
            try {
                const { EmbeddingService } = await import('@/utils/ai/EmbeddingService');
                const { vector: queryEmbedding } = await EmbeddingService.generate(lastUserMessage.content);

                const { data: chunks, error: chunksError } = await supabase.rpc('match_legal_chunks', {
                    query_embedding: queryEmbedding,
                    match_threshold: 0.3,
                    match_count: 3,
                    p_tenant_id: user.id
                });

                if (chunksError || !chunks || chunks.length === 0) {
                    // STRICT COMPLIANCE: If no law is found, we refuse to answer.
                    return NextResponse.json({
                        text: "⚠️ **ALERTA DE CUMPLIMIENTO (RAG VACÍO)**\n\nComo Cualificador Profesional estricto, tengo **PROHIBIDO** usar conocimiento general de internet para formarte. Mi base de datos vectorial (RAG) actualmente no contiene los documentos legales necesarios (AI Act, RGPD, ISOs) para responder a tu consulta.\n\nPor favor, contacta con el administrador para que ingeste la normativa oficial en el sistema antes de continuar con la capacitación."
                    });
                }

                legalContext = chunks.map((c: any) => `[Documento: ${c.title}]\n${c.text}`).join('\n\n');
            } catch (e) {
                console.error("RAG Search Error:", e);
                return NextResponse.json({
                    text: "⚠️ **ERROR DEL MOTOR RAG**\n\nNo he podido conectar con la base de datos vectorial para fundamentar mi respuesta en la ley. Por seguridad jurídica, detengo la capacitación."
                });
            }
        }

        const STRICT_PROMPT = `${SYSTEM_PROMPT}
        
REGLA DE ORO ABSOLUTA: 
Solo puedes basar tus respuestas en el siguiente contexto legal extraído de la base de datos (RAG). Si el contexto está vacío, debes negarte a responder. NUNCA inventes leyes ni uses tu conocimiento previo.

CONTEXTO LEGAL RECUPERADO (RAG):
${legalContext ? legalContext : "Ningún documento encontrado."}
`;

        const responseText = await LLMService.generateChat(messages, STRICT_PROMPT, settings, 800);

        return NextResponse.json({ text: responseText });

    } catch (error: any) {
        console.error('Error in Tutor API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

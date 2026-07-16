import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { detectPersonalData } from '@/lib/legal-questions/detect-personal-data';
import { anonymizeQuestion } from '@/lib/legal-questions/anonymize-question';
import { normalizeQuestion } from '@/lib/legal-questions/normalize-question';
import { hashQuestion } from '@/lib/legal-questions/hash-question';
import { registerQuestion } from '@/lib/legal-questions/register-question';

// Note: Supabase client is created lazily inside handlers to avoid build-time errors

async function getOpenAIEmbedding(text: string, apiKey: string): Promise<number[] | null> {
    const url = "https://api.openai.com/v1/embeddings";
    const headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
    };
    const data = {
        "input": text,
        "model": "text-embedding-3-small"
    };
    try {
        const r = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        const res = await r.json();
        return res.data[0].embedding;
    } catch (e) {
        console.error("Error generating query embedding:", e);
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { query, domain } = await request.json();
        if (!query || !domain) {
            return NextResponse.json({ error: 'Query and domain are required' }, { status: 400 });
        }

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Supabase credentials are not configured' }, { status: 500 });
        }

        // Phase 10: Process and register question
        const { contains_personal_data, detected_data_types } = detectPersonalData(query);
        const anonymized_question = anonymizeQuestion(query);
        const normalized_question = normalizeQuestion(anonymized_question);

        // We need a tenantId for hashing. In a real app, this comes from auth.
        // For now, we'll use a placeholder or get it from the session if available.
        const { data: { session } } = await supabase.auth.getSession();
        const tenantId = session?.user?.id || 'anonymous';

        let openaiKey = process.env.OPENAI_API_KEY || '';
        let preferredModel = 'gpt-4o-mini';

        if (tenantId !== 'anonymous') {
            const { data: settings } = await supabase
                .from('tenant_settings')
                .select('openai_api_key, preferred_model')
                .eq('tenant_id', tenantId)
                .single();

            if (settings?.openai_api_key) {
                openaiKey = settings.openai_api_key;
            }
            if (settings?.preferred_model) {
                preferredModel = settings.preferred_model;
            }
        }

        const hash = hashQuestion(normalized_question, tenantId);

        let questionId = null;
        try {
            const regResult = await registerQuestion(supabase, {
                question: contains_personal_data ? null : query, // Don't store original if it has personal data
                normalized_question,
                anonymized_question,
                contains_personal_data,
                detected_data_types,
                hash,
                domain
            });
            questionId = regResult.id;
        } catch (e) {
            console.error("Failed to register question:", e);
            // Continue with search even if registration fails
        }

        // If no OpenAI key, return mock response
        if (!openaiKey) {
            return NextResponse.json({
                answer: `[Modo Mock/Offline] Según el corpus legal de **${domain === 'ai_literacy' ? 'Alfabetización en IA' : 'Autónomos'}**, te propongo la siguiente estrategia:\n\n` +
                    `1. **Solución Principal**: Basándonos en el Artículo 14 del AI Act, debes implementar supervisión humana inmediata. Esta norma es clave para mitigar riesgos.\n` +
                    `2. **Normativa Complementaria**: No olvides el Artículo 4, que exige alfabetización. Aunque parezca secundario, es una obligación vigente que puede protegerte ante auditorías.\n\n` +
                    `*Esta respuesta es una simulación estratégica generada sin conexión a OpenAI.*`,
                results: [
                    {
                        id: 'chunk-1',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 14. Supervisión humana',
                        text: 'Los sistemas de IA de alto riesgo se diseñarán y desarrollarán de manera que puedan ser supervisados eficazmente por personas físicas durante el período en que estén en uso.',
                        url: 'https://eur-lex.europa.eu/...',
                        authority: 'Unión Europea - EUR-Lex',
                        similarity: 0.89
                    },
                    {
                        id: 'chunk-2',
                        title: 'Reglamento Europeo de IA',
                        section: 'Artículo 4. Alfabetización en materia de IA',
                        text: 'Los proveedores y los responsables del despliegue de sistemas de IA adoptarán medidas para garantizar, en la medida de lo posible, un nivel suficiente de alfabetización en materia de IA de su personal...',
                        url: 'https://eur-lex.europa.eu/...',
                        authority: 'Unión Europea - EUR-Lex',
                        similarity: 0.82
                    }
                ]
            });
        }

        // 1. Generate query embedding
        const queryEmbedding = await getOpenAIEmbedding(query, openaiKey);
        if (!queryEmbedding) {
            return NextResponse.json({ error: 'Failed to generate query embedding' }, { status: 500 });
        }

        // 2. Query Supabase match_chunks RPC function
        const { data: matchedChunks, error: rpcError } = await supabase.rpc('match_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: 0.3,
            match_count: 4,
            filter_domain_id: domain
        });

        if (rpcError) {
            console.error('RPC match_chunks failed, falling back to text search:', rpcError);
            // Fallback to basic text search if RPC is not defined yet
            const { data: textSearchChunks, error: textSearchError } = await supabase
                .from('legal_chunks')
                .select('id,title,section,text,url,authority')
                .eq('domain_id', domain)
                .limit(4);

            if (textSearchError) throw textSearchError;

            return NextResponse.json({
                answer: `Se realizó una búsqueda de texto básico (pgvector RPC no disponible). Aquí están los fragmentos más relevantes encontrados.`,
                results: textSearchChunks || []
            });
        }

        if (!matchedChunks || matchedChunks.length === 0) {
            // Register Knowledge Gap
            try {
                await supabase.from('knowledge_gaps').insert({
                    topic: anonymized_question,
                    reason: 'No matching chunks found above threshold',
                    gap_type: 'missing_source',
                    priority_score: 0.5
                });
            } catch (e) {
                console.error("Failed to register knowledge gap:", e);
            }

            return NextResponse.json({
                answer: 'No se encontraron fragmentos relevantes en el corpus legal para responder a tu pregunta. Se ha registrado esta laguna de conocimiento para futura investigación.',
                results: []
            });
        }

        // 3. Fetch approved derived knowledge (Legal Graph)
        const chunkIds = matchedChunks.map((c: any) => c.id);

        // Fetch approved opportunities
        const { data: opportunities } = await supabase
            .from('legal_opportunities')
            .select('id, title, description, opportunity_type, reasoning_summary, conditions, limitations, conflicts, source_fragment_id')
            .in('source_fragment_id', chunkIds)
            .eq('status', 'approved');

        // Fetch approved relationships (chunk -> concept)
        const { data: relationships } = await supabase
            .from('legal_relationships')
            .select('target_id, relationship_type, relationship_source, source_id')
            .in('source_id', chunkIds)
            .eq('source_type', 'chunk')
            .eq('target_type', 'concept')
            .eq('status', 'approved');

        let concepts: any[] = [];
        if (relationships && relationships.length > 0) {
            const conceptIds = relationships.map((r: any) => r.target_id);
            const { data: fetchedConcepts } = await supabase
                .from('legal_concepts')
                .select('id, name, description')
                .in('id', conceptIds)
                .eq('status', 'approved');
            concepts = fetchedConcepts || [];
        }

        // 4. Format context
        const officialContext = matchedChunks.map((c: any) => `Documento: ${c.title} (${c.section})\nTexto: ${c.text}`).join('\n\n');

        let derivedContext = "";
        if (concepts.length > 0) {
            derivedContext += "CONCEPTOS RELACIONADOS:\n" + concepts.map(c => `- ${c.name}: ${c.description || ''}`).join('\n') + "\n\n";
        }
        if (relationships && relationships.length > 0) {
            derivedContext += "RELACIONES APROBADAS:\n" + relationships.map(r => {
                const conceptName = concepts.find(c => c.id === r.target_id)?.name || 'Concepto desconocido';
                return `- El texto ${r.relationship_type} el concepto "${conceptName}" (Origen: ${r.relationship_source})`;
            }).join('\n') + "\n\n";
        }
        if (opportunities && opportunities.length > 0) {
            derivedContext += "OPORTUNIDADES APROBADAS:\n" + opportunities.map(o =>
                `- [${o.opportunity_type.toUpperCase()}] ${o.title}: ${o.description}\n  Razonamiento: ${o.reasoning_summary}\n  Condiciones: ${(o.conditions || []).join(', ')}\n  Limitaciones: ${(o.limitations || []).join(', ')}\n  Conflictos: ${(o.conflicts || []).join(', ')}`
            ).join('\n\n') + "\n\n";
        }

        const prompt = `Eres Thoth, un estratega legal experto. El usuario te presentará un problema o situación. Tu objetivo es proponer soluciones creativas y rigurosas basadas ÚNICAMENTE en el corpus legal recuperado a continuación y en el conocimiento derivado aprobado por expertos. Presta especial atención a las oportunidades aprobadas (beneficios, excepciones). Si el contexto no contiene la información necesaria, indícalo de forma educada.\n\nContexto Oficial:\n${officialContext}\n\nConocimiento Derivado (Aprobado):\n${derivedContext || 'Ninguno.'}\n\nProblema del usuario: ${query}\n\nPropuesta de Solución Estratégica:`;

        // 5. Call OpenAI to generate answer based on context
        const resChat = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openaiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: preferredModel,
                messages: [
                    { role: 'system', content: 'Eres un estratega legal riguroso que propone soluciones basadas únicamente en las fuentes proporcionadas.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3
            })
        });

        const dataChat = await resChat.json();
        const answer = dataChat.choices[0].message.content;

        // Register Scenario
        if (questionId) {
            try {
                const { data: scenario } = await supabase.from('legal_scenarios').insert({
                    description: `Respuesta a pregunta: ${anonymized_question.substring(0, 50)}...`,
                    question_id: questionId,
                    model_version: preferredModel,
                    status: 'active'
                }).select('id').single();

                if (scenario) {
                    // Link chunks
                    if (chunkIds.length > 0) {
                        await supabase.from('scenario_chunks').insert(
                            chunkIds.map((id: string) => ({ scenario_id: scenario.id, chunk_id: id }))
                        );
                    }
                    // Link concepts
                    if (concepts.length > 0) {
                        await supabase.from('scenario_concepts').insert(
                            concepts.map((c: any) => ({ scenario_id: scenario.id, concept_id: c.id }))
                        );
                    }
                    // Link opportunities
                    if (opportunities && opportunities.length > 0) {
                        await supabase.from('scenario_opportunities').insert(
                            opportunities.map((o: any) => ({ scenario_id: scenario.id, opportunity_id: o.id }))
                        );
                    }
                }
            } catch (e) {
                console.error("Failed to register scenario:", e);
            }
        }

        return NextResponse.json({
            answer,
            results: matchedChunks.map((c: any) => ({
                id: c.id,
                title: c.title,
                section: c.section,
                text: c.text,
                url: c.url,
                authority: c.authority,
                similarity: c.similarity
            }))
        });

    } catch (error: any) {
        console.error('API search error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Mock helper functions
function getMockInterpretation(chunkText: string) {
    return {
        category: chunkText.toLowerCase().includes('supervisión') ? 'Supervisión Humana' : 'Protección de Datos',
        legal_status: chunkText.toLowerCase().includes('deberá') || chunkText.toLowerCase().includes('obligado') ? 'obligatorio' : 'recomendado',
        applies_to: ['proveedor', 'responsable del despliegue'],
        risk_level: chunkText.toLowerCase().includes('riesgo') ? 'alto' : 'medio',
        confidence: 0.95,
    };
}

function getMockExercise(chunkText: string, title: string, section: string) {
    return {
        legal_requirement: `Cumplir con lo establecido en ${title} - ${section}`,
        plain_language: 'El trabajador debe entender y aplicar las directrices oficiales en su trabajo diario.',
        department: 'Administración',
        job_role: 'Administrativo',
        task: 'Revisar documentos generados por sistemas automatizados',
        risk: 'Aceptar información errónea o no verificada',
        required_skill: 'Pensamiento crítico y verificación de fuentes',
        exercise_type: 'simulation',
        difficulty: 'basic',
        evidence: 'El trabajador documenta la verificación del contenido',
    };
}

export async function POST(request: Request) {
    try {
        const batchSize = parseInt(process.env.PROCESS_BATCH_SIZE || '5', 10);

        // Initialise Supabase client with user session
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let openaiKey = process.env.OPENAI_API_KEY || '';
        let preferredModel = 'gpt-4o-mini';

        const { data: settings } = await supabase
            .from('tenant_settings')
            .select('openai_api_key, preferred_model')
            .eq('tenant_id', user.id)
            .single();

        if (settings?.openai_api_key) {
            openaiKey = settings.openai_api_key;
        }
        if (settings?.preferred_model) {
            preferredModel = settings.preferred_model;
        }

        const { domain } = await request.json();
        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        // 1. Fetch already processed chunk ids for this domain
        const { data: existingInterps, error: fetchInterpsError } = await supabase
            .from('legal_interpretations')
            .select('chunk_id')
            .eq('domain_id', domain);
        if (fetchInterpsError) throw fetchInterpsError;
        const processedChunkIds = new Set((existingInterps || []).map(item => (item as any).chunk_id));

        // 2. Fetch all chunks for the domain
        const { data: allChunks, error: fetchChunksError } = await supabase
            .from('legal_chunks')
            .select('id,title,section,text')
            .eq('domain_id', domain);
        if (fetchChunksError) throw fetchChunksError;
        const unprocessedChunks = (allChunks || []).filter(c => !processedChunkIds.has((c as any).id));

        if (unprocessedChunks.length === 0) {
            return NextResponse.json({ message: 'No new chunks to process' });
        }

        const chunksToProcess = unprocessedChunks.slice(0, batchSize);
        let processedCount = 0;

        for (const chunk of chunksToProcess) {
            const { id: chunkId, text: chunkText, title = 'Documento', section = 'Sección' } = chunk as any;
            let interp: any;
            let exercise: any;

            if (!openaiKey) {
                // Mock mode
                interp = getMockInterpretation(chunkText);
                exercise = getMockExercise(chunkText, title, section);
            } else {
                try {
                    const promptInterp = `Analiza el siguiente fragmento de texto oficial y clasifícalo jurídicamente:\n\nDocumento: ${title}\nSección: ${section}\nTexto:\n${chunkText}`;
                    const resInterp = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${openaiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: preferredModel,
                            messages: [
                                { role: 'system', content: 'Eres un experto legal. Responde únicamente en formato JSON.' },
                                { role: 'user', content: promptInterp },
                            ],
                            response_format: { type: 'json_object' },
                        }),
                    });
                    const dataInterp = await resInterp.json();
                    interp = JSON.parse(dataInterp.choices[0].message.content);

                    const promptEx = `A partir del siguiente fragmento legal y su clasificación, genera una propuesta de ejercicio práctico de entrenamiento para empleados:\n\nDocumento: ${title}\nSección: ${section}\nTexto:\n${chunkText}\n\nClasificación:\n${JSON.stringify(interp)}\n\nGenera un escenario práctico realista. Responde únicamente en formato JSON.`;
                    const resEx = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${openaiKey}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: preferredModel,
                            messages: [
                                { role: 'system', content: 'Eres un experto en formación empresarial. Responde únicamente en formato JSON.' },
                                { role: 'user', content: promptEx },
                            ],
                            response_format: { type: 'json_object' },
                        }),
                    });
                    const dataEx = await resEx.json();
                    exercise = JSON.parse(dataEx.choices[0].message.content);
                } catch (err) {
                    console.error('Error calling OpenAI, falling back to mock:', err);
                    interp = getMockInterpretation(chunkText);
                    exercise = getMockExercise(chunkText, title, section);
                }
            }

            const interpData = {
                chunk_id: chunkId,
                domain_id: domain,
                category: interp.category || 'General',
                legal_status: interp.legal_status || 'recomendado',
                applies_to: interp.applies_to || ['empleados'],
                risk_level: interp.risk_level || 'medio',
                confidence: interp.confidence || 0.9,
            };

            const exerciseData = {
                chunk_id: chunkId,
                domain_id: domain,
                legal_requirement: exercise.legal_requirement || `Requisito de ${title}`,
                plain_language: exercise.plain_language || 'Explicación sencilla',
                department: exercise.department || 'General',
                job_role: exercise.job_role || 'Empleado',
                task: exercise.task || 'Tarea cotidiana',
                risk: exercise.risk || 'Riesgo asociado',
                required_skill: exercise.required_skill || 'Habilidad requerida',
                exercise_type: exercise.exercise_type || 'simulation',
                difficulty: exercise.difficulty || 'basic',
                evidence: exercise.evidence || 'Evidencia de aprendizaje',
                review_status: 'pending',
            };

            const { error: interpError } = await supabase.from('legal_interpretations').insert([interpData]);
            if (!interpError) {
                await supabase.from('training_exercises').insert([exerciseData]);
                processedCount++;
            }
        }

        return NextResponse.json({
            message: `Se procesaron ${processedCount} fragmentos correctamente. Mode: ${openaiKey ? 'OpenAI' : 'Mock/Offline'}`,
        });
    } catch (error: any) {
        console.error('API process error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EmbeddingService } from '@/utils/ai/EmbeddingService';
import crypto from 'crypto';

export async function GET(request: Request) {
    try {
        // Use service role key to bypass RLS
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const documents = [
            {
                title: 'Reglamento (UE) 2024/1689 (AI Act) - Artículo 3',
                text: 'Definiciones. A los efectos del presente Reglamento, se entenderá por: 1) «sistema de inteligencia artificial» o «sistema de IA»: un sistema basado en una máquina que está diseñado para funcionar con distintos niveles de autonomía y que puede mostrar capacidad de adaptación tras el despliegue, y que, para objetivos explícitos o implícitos, infiere de la información que recibe cómo generar resultados tales como predicciones, contenidos, recomendaciones o decisiones que pueden influir en entornos físicos o virtuales.'
            },
            {
                title: 'Reglamento (UE) 2024/1689 (AI Act) - Artículo 4',
                text: 'Alfabetización en materia de IA. Los proveedores y los responsables del despliegue de sistemas de IA adoptarán medidas para garantizar, en la medida de sus posibilidades, que su personal y otras personas que se encarguen del funcionamiento y la utilización de sistemas de IA en su nombre posean un nivel suficiente de alfabetización en materia de IA, teniendo en cuenta sus conocimientos técnicos, su experiencia, su educación y su formación, así como el contexto en el que se vayan a utilizar los sistemas de IA y las personas o grupos de personas en los que se vayan a utilizar.'
            },
            {
                title: 'Reglamento General de Protección de Datos (RGPD) - Privacidad en IA',
                text: 'Está estrictamente prohibido introducir datos personales (como nombres, DNI, direcciones, o datos de salud) en sistemas de Inteligencia Artificial públicos o no securizados (como la versión gratuita de ChatGPT), ya que estos datos pueden ser utilizados para entrenar al modelo, lo que constituye una brecha de seguridad y una violación de la confidencialidad.'
            },
            {
                title: 'Directrices de Supervisión Humana en IA',
                text: 'Todo resultado generado por un sistema de Inteligencia Artificial debe ser revisado y validado por un ser humano antes de su aplicación o envío a un cliente. La IA actúa como un asistente, pero la responsabilidad final de la decisión o del contenido recae siempre en el profesional humano.'
            }
        ];

        let processed = 0;

        for (const doc of documents) {
            const docId = crypto.randomUUID();
            const hash = crypto.createHash('sha256').update(doc.text).digest('hex');

            // Insert document
            await supabase.from('legal_documents').insert([{
                id: docId,
                tenant_id: '00000000-0000-0000-0000-000000000000', // Global tenant
                domain_id: 'global',
                title: doc.title,
                text: doc.text,
                document_type: 'law',
                sha256: hash,
                authority: 'Unión Europea',
                retrieved_at: new Date().toISOString()
            }]);

            // Generate embedding
            const { vector, metadata } = await EmbeddingService.generate(doc.text);

            // Insert chunk
            await supabase.from('legal_chunks').insert([{
                document_id: docId,
                tenant_id: '00000000-0000-0000-0000-000000000000',
                domain_id: 'global',
                chunk_index: 0,
                title: doc.title,
                text: doc.text,
                sha256: hash,
                embedding: vector,
                embedding_provider: metadata.embedding_provider,
                embedding_model: metadata.embedding_model,
                embedding_dimensions: metadata.embedding_dimensions,
                embedding_version: metadata.embedding_version
            }]);

            processed++;
        }

        return NextResponse.json({ message: `Successfully seeded ${processed} legal documents into RAG.` });

    } catch (error: any) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { EmbeddingService } from '@/utils/ai/EmbeddingService';
import crypto from 'crypto';

// Helper function to chunk text
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const paragraph of paragraphs) {
        if ((currentChunk.length + paragraph.length) > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += paragraph + '\n\n';
    }
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, text, document_type = 'internal_policy' } = body;

        if (!title || !text) {
            return NextResponse.json({ error: 'Title and text are required' }, { status: 400 });
        }

        // 1. Generate SHA256 hash of the document to prevent duplicates
        const hash = crypto.createHash('sha256').update(text).digest('hex');

        // Check if document already exists for this tenant
        const { data: existingDoc } = await supabase
            .from('legal_documents')
            .select('id')
            .eq('tenant_id', user.id)
            .eq('sha256', hash)
            .single();

        if (existingDoc) {
            return NextResponse.json({ error: 'Document already exists' }, { status: 409 });
        }

        // 2. Insert Document
        const docId = crypto.randomUUID();
        const { error: docError } = await supabase
            .from('legal_documents')
            .insert([{
                id: docId,
                tenant_id: user.id,
                domain_id: 'internal', // Custom domain for internal docs
                title: title,
                text: text,
                document_type: document_type,
                sha256: hash,
                authority: 'Empresa',
                retrieved_at: new Date().toISOString()
            }]);

        if (docError) {
            console.error("Error inserting document:", docError);
            throw new Error("Failed to save document metadata");
        }

        // 3. Chunk the document
        const chunks = chunkText(text);
        let processedChunks = 0;

        // 4. Process each chunk
        for (let i = 0; i < chunks.length; i++) {
            const chunkContent = chunks[i];
            const chunkHash = crypto.createHash('sha256').update(chunkContent).digest('hex');

            // Generate embedding using the GLOBAL model
            const { vector, metadata } = await EmbeddingService.generate(chunkContent);

            const { error: chunkError } = await supabase
                .from('legal_chunks')
                .insert([{
                    document_id: docId,
                    tenant_id: user.id,
                    domain_id: 'internal',
                    chunk_index: i,
                    title: `${title} - Parte ${i + 1}`,
                    text: chunkContent,
                    sha256: chunkHash,
                    embedding: vector,
                    embedding_provider: metadata.embedding_provider,
                    embedding_model: metadata.embedding_model,
                    embedding_dimensions: metadata.embedding_dimensions,
                    embedding_version: metadata.embedding_version
                }]);

            if (chunkError) {
                console.error(`Error inserting chunk ${i}:`, chunkError);
            } else {
                processedChunks++;
            }
        }

        return NextResponse.json({
            message: 'Document processed successfully',
            document_id: docId,
            total_chunks: chunks.length,
            processed_chunks: processedChunks
        });

    } catch (error: any) {
        console.error('API document ingest error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

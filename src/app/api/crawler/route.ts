import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import { EmbeddingService } from '@/utils/ai/EmbeddingService';
import crypto from 'crypto';

export const maxDuration = 300; // 5 minutes max duration for Vercel

const OFFICIAL_SOURCES = [
    // 1. Normativa vinculante
    {
        id: 'ai-act',
        title: 'Reglamento (UE) 2024/1689 (AI Act)',
        level: '1. Normativa vinculante',
        url: 'https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=OJ:L_202401689',
        type: 'html'
    },
    {
        id: 'rgpd',
        title: 'Reglamento (UE) 2016/679 (RGPD)',
        level: '1. Normativa vinculante',
        url: 'https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32016R0679',
        type: 'html'
    },
    {
        id: 'lopdgdd',
        title: 'Ley Orgánica 3/2018 (LOPDGDD)',
        level: '1. Normativa vinculante',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673&p=20230509&tn=1',
        type: 'html'
    },
    {
        id: 'estatuto-trabajadores',
        title: 'Estatuto de los Trabajadores (Art. 64.4.d)',
        level: '1. Normativa vinculante',
        url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430',
        type: 'html'
    },

    // 2. Directrices oficiales no vinculantes
    {
        id: 'faq-art4',
        title: 'FAQ Oficiales del Artículo 4 (Comisión Europea)',
        level: '2. Directrices oficiales no vinculantes',
        url: 'https://digital-strategy.ec.europa.eu/es/policies/ai-act-faq', // Placeholder URL for crawler
        type: 'html'
    },
    {
        id: 'aesia-estatuto',
        title: 'Estatuto AESIA',
        level: '1. Normativa vinculante',
        url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-19911',
        type: 'html'
    }
];

async function scrapeHtml(url: string): Promise<string> {
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Thoth-Legal-Crawler/1.0' }
        });
        const $ = cheerio.load(response.data);
        $('script, style, nav, header, footer, img, svg').remove();
        return $('body').text().replace(/\s+/g, ' ').trim();
    } catch (error: any) {
        console.error(`[Scraper Error] Fallo al descargar ${url}:`, error.message);
        return '';
    }
}

function chunkText(text: string, maxChunkSize: number = 2000): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split(/(?<=\.)\s+/);

    for (const sentence of sentences) {
        if ((currentChunk.length + sentence.length) > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = '';
        }
        currentChunk += sentence + ' ';
    }
    if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());
    return chunks;
}

export async function GET(request: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
        const supabase = createClient(supabaseUrl, supabaseKey);

        let results = [];

        for (const source of OFFICIAL_SOURCES) {
            const text = await scrapeHtml(source.url);
            if (!text) {
                results.push(`⚠️ Fallo al descargar: ${source.title}`);
                continue;
            }

            // Limit text to first 20000 chars for the demo to avoid Vercel timeouts
            const limitedText = text.substring(0, 20000);
            const chunks = chunkText(limitedText);

            const docId = crypto.randomUUID();
            const hash = crypto.createHash('sha256').update(limitedText).digest('hex');

            await supabase.from('legal_documents').insert([{
                id: docId,
                tenant_id: '00000000-0000-0000-0000-000000000000',
                domain_id: 'global',
                title: source.title,
                text: limitedText.substring(0, 5000),
                document_type: 'law',
                sha256: hash,
                authority: 'Oficial',
                retrieved_at: new Date().toISOString()
            }]);

            let processed = 0;
            for (let i = 0; i < chunks.length; i++) {
                const chunkContent = chunks[i];
                const chunkHash = crypto.createHash('sha256').update(chunkContent).digest('hex');
                const { vector, metadata } = await EmbeddingService.generate(chunkContent);

                await supabase.from('legal_chunks').insert([{
                    document_id: docId,
                    tenant_id: '00000000-0000-0000-0000-000000000000',
                    domain_id: 'global',
                    chunk_index: i,
                    title: `${source.title} - Parte ${i + 1}`,
                    text: chunkContent,
                    sha256: chunkHash,
                    embedding: vector,
                    embedding_provider: metadata.embedding_provider,
                    embedding_model: metadata.embedding_model,
                    embedding_dimensions: metadata.embedding_dimensions,
                    embedding_version: metadata.embedding_version
                }]);
                processed++;
            }
            results.push(`✅ ${source.title}: ${processed} fragmentos indexados.`);
        }

        return NextResponse.json({ status: 'Crawler finalizado', results });

    } catch (error: any) {
        console.error('Crawler error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

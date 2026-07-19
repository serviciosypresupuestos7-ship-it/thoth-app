import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { EmbeddingService } from '../src/utils/ai/EmbeddingService';

dotenv.config({ path: '.env.local' });

// ==========================================
// CONFIGURACIÓN DE FUENTES OFICIALES (CRAWLER)
// ==========================================
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
    {
        id: 'aesia-estatuto',
        title: 'Estatuto AESIA',
        level: '1. Normativa vinculante',
        url: 'https://www.boe.es/buscar/doc.php?id=BOE-A-2023-19911',
        type: 'html'
    },
    // 2. Directrices oficiales no vinculantes
    {
        id: 'faq-art4',
        title: 'FAQ Oficiales del Artículo 4 (Comisión Europea)',
        level: '2. Directrices oficiales no vinculantes',
        url: 'https://digital-strategy.ec.europa.eu/es/policies/ai-act-faq',
        type: 'html'
    }
];

async function scrapeHtml(url: string): Promise<string> {
    try {
        console.log(`[Scraper] Descargando fuente oficial: ${url}`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Thoth-Legal-Crawler/1.0 (Compliance System)'
            }
        });
        const $ = cheerio.load(response.data);

        // Limpiar HTML (eliminar scripts, estilos, navs)
        $('script, style, nav, header, footer, img, svg').remove();

        // Extraer texto puro
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        return text;
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
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

async function main() {
    console.log("==================================================");
    console.log("THOTH LEGAL CRAWLER - INGESTA LOCAL A SUPABASE");
    console.log("==================================================");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('[SENSITIVE]') || supabaseKey.includes('[SENSITIVE]')) {
        console.error("❌ ERROR CRÍTICO: Faltan credenciales reales de Supabase en .env.local");
        console.error("Por favor, edita el archivo .env.local y pon tus claves reales (NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY).");
        process.exit(1);
    }

    if (!openAiKey || openAiKey.includes('[SENSITIVE]')) {
        console.error("❌ ERROR CRÍTICO: Falta la clave de OpenAI en .env.local para generar los vectores.");
        console.error("Por favor, edita el archivo .env.local y pon tu OPENAI_API_KEY real.");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    for (const source of OFFICIAL_SOURCES) {
        console.log(`\nProcesando: ${source.title} (${source.level})`);

        const text = await scrapeHtml(source.url);
        if (!text) {
            console.log(`⚠️ Saltando ${source.title} por error de descarga.`);
            continue;
        }

        // Limit to 20000 chars to avoid massive API costs during testing
        const limitedText = text.substring(0, 20000);
        console.log(`✅ Texto extraído: ${limitedText.substring(0, 100)}... (${limitedText.length} caracteres)`);

        const chunks = chunkText(limitedText);
        console.log(`🔪 Documento dividido en ${chunks.length} fragmentos (chunks).`);

        const docId = crypto.randomUUID();
        const hash = crypto.createHash('sha256').update(limitedText).digest('hex');

        console.log(`💾 Guardando metadatos en Supabase...`);
        await supabase.from('legal_documents').insert([{
            id: docId,
            tenant_id: '00000000-0000-0000-0000-000000000000',
            domain_id: 'global',
            title: source.title,
            text: limitedText.substring(0, 5000), // Save a preview
            document_type: 'law',
            sha256: hash,
            authority: 'Oficial',
            retrieved_at: new Date().toISOString()
        }]);

        console.log(`🧠 Vectorizando e insertando ${chunks.length} chunks en el RAG...`);
        let processed = 0;
        for (let i = 0; i < chunks.length; i++) {
            const chunkContent = chunks[i];
            const chunkHash = crypto.createHash('sha256').update(chunkContent).digest('hex');

            try {
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
                if (processed % 5 === 0) console.log(`   ... ${processed}/${chunks.length} chunks guardados.`);
            } catch (err: any) {
                console.error(`   ❌ Error vectorizando chunk ${i}:`, err.message);
            }
        }
        console.log(`✅ ${source.title} indexado correctamente en el RAG.`);
    }

    console.log("\n==================================================");
    console.log("PROCESO DE INGESTA AUTOMÁTICA COMPLETADO");
    console.log("==================================================");
}

main();

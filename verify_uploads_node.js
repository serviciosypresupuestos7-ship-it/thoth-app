const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://vgrhircrjgbdouihjvqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    try {
        const { count: docsCount, error: docsError } = await supabase
            .from('legal_documents')
            .select('*', { count: 'exact', head: true });

        if (docsError) throw docsError;

        const { count: chunksCount, error: chunksError } = await supabase
            .from('legal_chunks')
            .select('*', { count: 'exact', head: true });

        if (chunksError) throw chunksError;

        console.log(`--- ESTADO DE LA BASE DE DATOS ---`);
        console.log(`Total Documentos Legales: ${docsCount}`);
        console.log(`Total Chunks (Fragmentos): ${chunksCount}`);

        const { data: docs, error: fetchError } = await supabase
            .from('legal_documents')
            .select('title');

        if (fetchError) throw fetchError;

        console.log(`\nDocumentos subidos (${docs.length}):`);
        docs.forEach(d => console.log(`- ${d.title}`));

    } catch (err) {
        console.error('Error querying Supabase:', err.message);
    }
}

checkCounts();

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

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

        console.log(`--- UPLOAD VERIFICATION ---`);
        console.log(`Total Legal Documents: ${docsCount}`);
        console.log(`Total Legal Chunks: ${chunksCount}`);

        // Let's also fetch the titles of the documents to show the user
        const { data: docs, error: fetchError } = await supabase
            .from('legal_documents')
            .select('title')
            .limit(5);

        if (fetchError) throw fetchError;

        console.log(`\nSample of uploaded documents:`);
        docs.forEach(d => console.log(`- ${d.title}`));

    } catch (err) {
        console.error('Error querying Supabase:', err.message);
    }
}

checkCounts();

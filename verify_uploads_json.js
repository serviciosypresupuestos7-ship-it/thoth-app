const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = "https://vgrhircrjgbdouihjvqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
    try {
        const { count: docsCount, error: docsError } = await supabase
            .from('legal_documents')
            .select('*', { count: 'exact', head: true });

        const { count: chunksCount, error: chunksError } = await supabase
            .from('legal_chunks')
            .select('*', { count: 'exact', head: true });

        const { data: docs } = await supabase
            .from('legal_documents')
            .select('title');

        const result = {
            docsCount,
            chunksCount,
            titles: docs.map(d => d.title)
        };

        fs.writeFileSync('verify_out.json', JSON.stringify(result, null, 2), 'utf8');
        console.log('Done writing JSON');
    } catch (err) {
        console.error(err);
    }
}

checkCounts();

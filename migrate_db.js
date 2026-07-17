const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

async function checkTrigger() {
    console.log('Checking if trigger exists...');

    // Check trigger existence via information_schema
    const { data, error } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name, event_object_table')
        .eq('trigger_name', 'trg_invalidate_knowledge')
        .limit(1);

    if (error) {
        // Try pg_trigger which is usually accessible
        const { data: d2, error: e2 } = await supabase.rpc('exec_sql', {
            sql: "SELECT 1"
        });
        console.log('info_schema error:', error.message);
        console.log('\nThe trigger needs to be created manually.');
        console.log('Go to: https://supabase.com/dashboard/project/vgrhircrjgbdouihjvqy/sql/new');
        console.log('\nPaste and run:');
        console.log(`
CREATE OR REPLACE FUNCTION invalidate_dependent_knowledge()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.sha256 IS DISTINCT FROM NEW.sha256) THEN
        UPDATE legal_opportunities SET status = 'needs_review'
        WHERE source_fragment_id = NEW.id AND status = 'approved';
        UPDATE legal_relationships SET status = 'needs_review'
        WHERE ((source_id = NEW.id AND source_type = 'chunk')
           OR (target_id = NEW.id AND target_type = 'chunk'))
        AND status = 'approved';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invalidate_knowledge ON legal_chunks;
CREATE TRIGGER trg_invalidate_knowledge
AFTER UPDATE ON legal_chunks FOR EACH ROW
EXECUTE FUNCTION invalidate_dependent_knowledge();
        `);
        return;
    }

    if (data && data.length > 0) {
        console.log('✅ Trigger trg_invalidate_knowledge already exists!');
    } else {
        console.log('❌ Trigger does not exist yet — manual SQL run needed.');
    }
}

checkTrigger().catch(e => console.error('Fatal:', e.message));

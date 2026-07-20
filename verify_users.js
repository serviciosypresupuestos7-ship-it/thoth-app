const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = "https://vgrhircrjgbdouihjvqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    try {
        const { count: profilesCount, error: profilesError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { count: tenantsCount, error: tenantsError } = await supabase
            .from('tenants')
            .select('*', { count: 'exact', head: true });

        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, role, tenant_id')
            .limit(5);

        const result = {
            profilesCount: profilesError ? profilesError.message : profilesCount,
            tenantsCount: tenantsError ? tenantsError.message : tenantsCount,
            sampleProfiles: profiles || []
        };

        fs.writeFileSync('verify_users.json', JSON.stringify(result, null, 2), 'utf8');
        console.log('Done writing users JSON');
    } catch (err) {
        console.error(err);
    }
}

checkUsers();

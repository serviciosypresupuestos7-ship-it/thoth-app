const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = "https://vgrhircrjgbdouihjvqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
    const { data: tenants, error: tErr } = await supabase.from('tenants').select('*');

    const result = {
        profiles: profiles || pErr,
        tenants: tenants || tErr
    };

    fs.writeFileSync('verify_users_full.json', JSON.stringify(result, null, 2), 'utf8');
}

checkUsers();

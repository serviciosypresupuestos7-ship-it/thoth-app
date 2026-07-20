const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = "https://vgrhircrjgbdouihjvqy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmhpcmNyamdiZG91aWhqdnF5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE5OTY2OCwiZXhwIjoyMDk5Nzc1NjY4fQ.yTZwaktGHNQIXsUCrll0z8LM9UOXZHsS2p8XRBpdl_A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    const result = {
        users: users ? users.map(u => ({ id: u.id, email: u.email })) : [],
        error
    };

    fs.writeFileSync('verify_auth_users.json', JSON.stringify(result, null, 2), 'utf8');
}

checkAuthUsers();

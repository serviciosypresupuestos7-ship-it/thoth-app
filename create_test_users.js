const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrl = envFile.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim();
const supabaseKey = envFile.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    // 1. Create Worker
    const { data: workerData, error: workerError } = await supabase.auth.admin.createUser({
        email: 'oficinistaporhoras@gmail.com',
        password: '2027',
        email_confirm: true,
        user_metadata: { full_name: 'Trabajador Prueba' }
    });
    if (workerError) {
        console.log('Error creating worker:', workerError.message);
    } else {
        console.log('Worker created:', workerData.user.id);
        // The trigger should create the profile with role 'worker'.
    }

    // 2. Create HR
    const { data: hrData, error: hrError } = await supabase.auth.admin.createUser({
        email: 'admin@secretariadinamica.com',
        password: '2028',
        email_confirm: true,
        user_metadata: { full_name: 'RRHH Prueba' }
    });
    if (hrError) {
        console.log('Error creating HR:', hrError.message);
    } else {
        console.log('HR created:', hrData.user.id);
        // Update profile to 'hr'
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'hr' })
            .eq('id', hrData.user.id);
        if (updateError) console.log('Error updating HR role:', updateError.message);
        else console.log('HR role updated to hr');
    }
}
run();

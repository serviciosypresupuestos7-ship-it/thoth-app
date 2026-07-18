const { Client } = require('pg');
async function test() {
    const url = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34espa%C3%B1a@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';
    const client = new Client({ connectionString: url });
    await client.connect();
    
    // Get user id
    const res = await client.query("SELECT id FROM auth.users LIMIT 1");
    if (res.rows.length === 0) return;
    const userId = res.rows[0].id;

    // Insert missions
    const m1 = await client.query("INSERT INTO public.missions (title, description, target_action, difficulty, status) VALUES ('Escribir correo a cliente enfadado', 'Redactar un correo...', 'Redactar correos', 'Alta', 'active') RETURNING id");
    const m2 = await client.query("INSERT INTO public.missions (title, description, target_action, difficulty, status) VALUES ('Resumir contrato de confidencialidad', 'Resumir...', 'Resumir documentos', 'Media', 'active') RETURNING id");
    
    // Assign to user
    await client.query("INSERT INTO public.user_missions (user_id, mission_id, status) VALUES (, , 'pending')", [userId, m1.rows[0].id]);
    await client.query("INSERT INTO public.user_missions (user_id, mission_id, status) VALUES (, , 'completed')", [userId, m2.rows[0].id]);
    
    console.log('Missions created and assigned');
    await client.end();
}
test();

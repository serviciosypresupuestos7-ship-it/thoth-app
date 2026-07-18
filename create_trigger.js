const { Client } = require('pg');
async function run() {
  const url = 'postgresql://postgres.vgrhircrjgbdouihjvqy:leyes34espa%C3%B1a@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: url });
  await client.connect();
  await client.query(`
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger AS $$
        BEGIN
          INSERT INTO public.profiles (id, full_name, role)
          VALUES (new.id, new.raw_user_meta_data->>'full_name', 'worker');
          RETURN new;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
  console.log('Trigger created');
  await client.end();
}
run();

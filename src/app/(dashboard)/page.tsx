import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile to get the role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'worker';

  if (role === 'superadmin') {
    redirect('/admin/empresas');
  } else if (role === 'hr') {
    redirect('/hr/panel');
  } else {
    redirect('/worker/panel');
  }
}

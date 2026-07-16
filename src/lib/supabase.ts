import { createClient } from '@supabase/supabase-js';

// Use placeholder values during build time to avoid "supabaseUrl is required" error.
// Real values are injected at runtime via environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

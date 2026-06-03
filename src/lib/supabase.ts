import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = 
  Boolean(supabaseUrl && supabaseAnonKey) &&
  supabaseUrl !== 'https://YOUR_PROJECT.supabase.co' &&
  supabaseAnonKey !== 'YOUR_ANON_KEY';

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default supabase;

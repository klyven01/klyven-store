import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If Supabase env vars aren't set, `supabase` is null and the rest of the
// app falls back to browser localStorage (see lib/orders.js). This means
// the site works immediately with zero setup, and upgrades to a real
// database the moment you add the two env vars. See README -> "How orders
// reach me" for setup instructions.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);

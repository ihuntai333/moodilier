import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

const placeholderUrl = "https://placeholder.supabase.co";
const placeholderKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

export const hasSupabaseConfig = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseServiceKey &&
    !supabaseUrl.includes("placeholder")
);

// Client public — pentru front-end (proiecte, setări publice)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabaseAnonKey || placeholderKey
);

// Client admin — pentru API routes (bypass RLS, full access)
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabaseServiceKey || placeholderKey,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

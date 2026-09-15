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

function toUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

/** Bypass Next Data Cache; retry once — Vercel→Supabase drops the first packet sometimes. */
async function noStoreFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = toUrl(input);
  const opts: RequestInit = { ...init, cache: "no-store" };
  try {
    return await fetch(url, opts);
  } catch (err) {
    const cause =
      err instanceof Error && "cause" in err
        ? (err as Error & { cause?: unknown }).cause
        : err;
    console.warn("Supabase fetch retry:", cause);
    return fetch(url, opts);
  }
}

const clientOpts = {
  auth: { autoRefreshToken: false, persistSession: false },
  global: { fetch: noStoreFetch },
} as const;

// Client public — pentru front-end (proiecte, setări publice)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabaseAnonKey || placeholderKey,
  clientOpts
);

// Client admin — pentru API routes (bypass RLS, full access)
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || placeholderUrl,
  supabaseServiceKey || placeholderKey,
  clientOpts
);

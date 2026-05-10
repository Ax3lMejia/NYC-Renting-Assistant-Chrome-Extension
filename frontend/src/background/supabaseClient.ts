import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const SESSION_KEY = 'NYC_RA_SUPABASE_SESSION';

let _client: SupabaseClient | null = null;

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (!_client) {
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  // restore session on every call — service workers are killed and revived by MV3
  const result = await chrome.storage.local.get(SESSION_KEY);
  const stored = result[SESSION_KEY] as { access_token: string; refresh_token: string } | undefined;

  if (stored?.access_token && stored?.refresh_token) {
    const { error: sessionError } = await _client.auth.setSession({
      access_token: stored.access_token,
      refresh_token: stored.refresh_token,
    });
    if (sessionError) {
      console.warn('[Supabase] Failed to restore session:', sessionError.message);
    }
  }

  return _client;
}

export async function storeSession(session: Session | null): Promise<void> {
  if (session) {
    await chrome.storage.local.set({
      [SESSION_KEY]: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      },
    });
  } else {
    await chrome.storage.local.remove(SESSION_KEY);
  }
}

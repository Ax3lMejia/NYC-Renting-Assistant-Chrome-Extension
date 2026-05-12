import { getSupabaseClient, storeSession } from './supabaseClient';
import { AuthResponse, User } from '../types/api';

function toUser(supabaseUser: any): User | null {
  if (!supabaseUser) return null;
  return { id: supabaseUser.id, email: supabaseUser.email ?? null };
}

export class AuthHandler {
  static async signInEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { status: 'error', message: error.message };
      await storeSession(data.session);
      return { status: 'success', user: toUser(data.user) };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Sign in failed' };
    }
  }

  static async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { status: 'error', message: error.message };
      await storeSession(data.session);
      return { status: 'success', user: toUser(data.user) };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Sign up failed' };
    }
  }

  static async signInGoogle(): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const redirectUrl = chrome.identity.getRedirectURL();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl, skipBrowserRedirect: true },
      });

      if (error || !data.url) {
        return { status: 'error', message: error?.message || 'Failed to get OAuth URL' };
      }

      const callbackUrl = await new Promise<string>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
          { url: data.url!, interactive: true },
          (url) => {
            if (chrome.runtime.lastError || !url) {
              reject(new Error(chrome.runtime.lastError?.message || 'Sign-in cancelled'));
            } else {
              resolve(url);
            }
          }
        );
      });

      const parsedUrl = new URL(callbackUrl);
      const params = parsedUrl.searchParams;
      const hash = new URLSearchParams(parsedUrl.hash.slice(1));

      // PKCE flow: Supabase returns a code in query params
      const code = params.get('code') ?? hash.get('code');
      if (code) {
        const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
        if (sessionError) return { status: 'error', message: sessionError.message };
        await storeSession(sessionData.session);
        return { status: 'success', user: toUser(sessionData.user) };
      }

      // Implicit flow: Supabase returns tokens directly in the hash
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');
      if (accessToken && refreshToken) {
        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) return { status: 'error', message: sessionError.message };
        await storeSession(sessionData.session);
        return { status: 'success', user: toUser(sessionData.user) };
      }

      return { status: 'error', message: 'No auth code in OAuth response' };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Google sign-in failed' };
    }
  }

  static async signOut(): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signOut();
      if (error) return { status: 'error', message: error.message };
      await storeSession(null);
      return { status: 'success', user: null };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Sign out failed' };
    }
  }

  static async getAuthState(): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return { status: 'error', message: error.message };
      return { status: 'success', user: toUser(user) };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Failed to get auth state' };
    }
  }

  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { status: 'error', message: error.message };
      return { status: 'success', user: null };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Password reset failed' };
    }
  }

  static async deleteAccount(): Promise<AuthResponse> {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.rpc('delete_user');
      if (error) return { status: 'error', message: error.message };
      await storeSession(null);
      return { status: 'success', user: null };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Account deletion failed' };
    }
  }
}

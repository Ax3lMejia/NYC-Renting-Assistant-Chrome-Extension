import { useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '../types/api';

const SESSION_KEY = 'NYC_RA_SUPABASE_SESSION';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chrome?.runtime?.sendMessage) {
      setIsLoading(false);
      return;
    }

    chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, (response: AuthResponse) => {
      if (chrome.runtime.lastError) {
        setIsLoading(false);
        return;
      }
      setUser(response.user ?? null);
      setIsLoading(false);
    });

    const storageListener = (changes: Record<string, chrome.storage.StorageChange>) => {
      if (SESSION_KEY in changes) {
        chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, (response: AuthResponse) => {
          if (!chrome.runtime.lastError) {
            setUser(response.user ?? null);
          }
        });
      }
    };

    if (chrome?.storage?.local) {
      chrome.storage.local.onChanged.addListener(storageListener);
      return () => chrome.storage.local.onChanged.removeListener(storageListener);
    }
  }, []);

  const signInEmail = useCallback(async (email: string, password: string): Promise<string | null> => {
    setError(null);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'SIGN_IN_EMAIL', email, password }, (response: AuthResponse) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message ?? 'Connection error';
          setError(msg);
          resolve(msg);
          return;
        }
        if (response.status === 'error') {
          setError(response.message ?? 'Sign in failed');
          resolve(response.message ?? 'Sign in failed');
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<string | null> => {
    setError(null);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'SIGN_UP_EMAIL', email, password }, (response: AuthResponse) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message ?? 'Connection error';
          setError(msg);
          resolve(msg);
          return;
        }
        if (response.status === 'error') {
          setError(response.message ?? 'Sign up failed');
          resolve(response.message ?? 'Sign up failed');
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const signInGoogle = useCallback(async (): Promise<string | null> => {
    setError(null);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'SIGN_IN_GOOGLE' }, (response: AuthResponse) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message ?? 'Connection error';
          setError(msg);
          resolve(msg);
          return;
        }
        if (response.status === 'error') {
          setError(response.message ?? 'Google sign-in failed');
          resolve(response.message ?? 'Google sign-in failed');
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const signOut = useCallback((): void => {
    chrome?.runtime?.sendMessage({ type: 'SIGN_OUT' });
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<string | null> => {
    setError(null);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'RESET_PASSWORD', email }, (response: AuthResponse) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message ?? 'Connection error';
          setError(msg);
          resolve(msg);
          return;
        }
        if (response.status === 'error') {
          setError(response.message ?? 'Password reset failed');
          resolve(response.message ?? 'Password reset failed');
        } else {
          resolve(null);
        }
      });
    });
  }, []);

  const deleteAccount = useCallback(async (): Promise<string | null> => {
    setError(null);
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type: 'DELETE_ACCOUNT' }, (response: AuthResponse) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message ?? 'Connection error';
          setError(msg);
          resolve(msg);
          return;
        }
        if (response.status === 'error') {
          setError(response.message ?? 'Account deletion failed');
          resolve(response.message ?? 'Account deletion failed');
        } else {
          setUser(null);
          resolve(null);
        }
      });
    });
  }, []);

  return { user, isLoading, error, signInEmail, signUp, signInGoogle, signOut, resetPassword, deleteAccount };
}

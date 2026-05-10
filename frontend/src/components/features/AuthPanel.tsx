import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface AuthPanelProps {
  onSuccess?: () => void;
  compact?: boolean;
}

const GoogleIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid rgba(20,17,13,0.20)',
  fontSize: 13,
  color: '#14110D',
  background: '#F4EDDD',
  marginBottom: 8,
  outline: 'none',
  fontFamily: 'Geist, system-ui, sans-serif',
};

const btnPrimary: React.CSSProperties = {
  width: '100%',
  padding: '9px 0',
  borderRadius: 8,
  background: '#14110D',
  color: '#F4EDDD',
  border: 'none',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Geist, system-ui, sans-serif',
  marginBottom: 8,
};

const btnGoogle: React.CSSProperties = {
  width: '100%',
  padding: '9px 0',
  borderRadius: 8,
  background: '#FFFFFF',
  color: '#14110D',
  border: '1px solid rgba(20,17,13,0.20)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Geist, system-ui, sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
};

export const AuthPanel: React.FC<AuthPanelProps> = ({ onSuccess, compact = false }) => {
  const { signInEmail, signUp, signInGoogle, error } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    const err = mode === 'signin'
      ? await signInEmail(email, password)
      : await signUp(email, password);
    setIsSubmitting(false);
    if (!err) onSuccess?.();
    else setLocalError(err);
  };

  const handleGoogle = async () => {
    setLocalError(null);
    setIsSubmitting(true);
    const err = await signInGoogle();
    setIsSubmitting(false);
    if (!err) onSuccess?.();
    else setLocalError(err);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: '1px solid rgba(20,17,13,0.10)',
      padding: compact ? '12px 14px' : '20px',
    }}>
      {!compact && (
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontSize: 20, fontStyle: 'italic', color: '#14110D',
          }}>
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </div>
          <div style={{ fontSize: 11, color: '#3A3530', marginTop: 4 }}>
            Save listings and track promising apartments
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ ...inputStyle, marginBottom: 10 }}
        />

        {(localError || error) && (
          <div style={{ fontSize: 11, color: '#E84A1F', marginBottom: 8, lineHeight: 1.3 }}>
            {localError || error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ ...btnPrimary, opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
        >
          {isSubmitting ? 'Loading…' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(20,17,13,0.12)' }} />
        <span style={{ fontSize: 10, color: '#8a8377', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.1em' }}>OR</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(20,17,13,0.12)' }} />
      </div>

      <button
        onClick={handleGoogle}
        disabled={isSubmitting}
        style={{ ...btnGoogle, opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setLocalError(null); }}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, color: '#8a8377',
            fontFamily: 'Geist, system-ui, sans-serif',
          }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { color, eyebrow, h1, body, buttonPrimary, container, space, font } from '../styles/tokens';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, access_code: accessCode } },
      });
      setLoading(false);
      if (error) return setError(error.message);
      setCheckEmail(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate('/portal');
  }

  if (checkEmail) {
    return (
      <div style={{ padding: `${space.xxl} 0` }}>
        <div style={{ ...container, maxWidth: '480px' }}>
          <div style={eyebrow}><span>Check your email</span></div>
          <h1 style={{ ...h1, fontSize: '32px' }}>Confirm your account</h1>
          <p style={{ ...body, marginTop: space.sm }}>
            We sent a confirmation link to <strong style={{ color: color.white }}>{email}</strong>.
            Click it, then come back and sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: `${space.xxl} 0` }}>
      <div style={{ ...container, maxWidth: '420px' }}>
        <div style={eyebrow}><span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span></div>
        <h1 style={{ ...h1, fontSize: '32px', marginBottom: space.lg }}>
          {mode === 'signin' ? 'Welcome back.' : 'Join GlobalLYNK.'}
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          {mode === 'signup' && (
            <>
              <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
              <input type="text" placeholder="Access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required style={inputStyle} />
            </>
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />

          {mode === 'signup' && (
            <p style={{ fontFamily: font.body, fontSize: '12px', color: color.mutedDim }}>
              Access codes are given out to accepted cohort applicants and instructors — reach out if you don't have one.
            </p>
          )}

          {error && <p style={{ fontFamily: font.mono, fontSize: '12px', color: '#E05252' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...buttonPrimary, justifyContent: 'center', marginTop: space.xs }}>
            {loading ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          style={{ background: 'none', border: 'none', color: color.cyan, fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', cursor: 'pointer', marginTop: space.md, padding: 0 }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: '10px',
  padding: '14px 16px',
  outline: 'none',
};
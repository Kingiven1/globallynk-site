import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, body, buttonPrimary, card, radius, container, space, font } from '../styles/tokens';

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
      <div style={{ position: 'relative', padding: `${space.xxl} 0`, overflow: 'hidden' }}>
        <GradientOrb seed={91} size={380} style={{ position: 'absolute', top: '-100px', left: '-80px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '480px' }}>
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
    <div style={{ position: 'relative', padding: `${space.xxl} 0`, overflow: 'hidden' }}>
      <GradientOrb seed={91} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '440px' }}>
        <div style={eyebrow}><span>{mode === 'signin' ? 'Sign in' : 'Create account'}</span></div>
        <h1 style={{ ...h1, fontSize: '34px', marginBottom: space.lg }}>
          {mode === 'signin' ? 'Welcome back.' : 'Join GlobalLYNK.'}
        </h1>

        <form onSubmit={handleSubmit} style={{ ...card, padding: space.xl, display: 'flex', flexDirection: 'column', gap: space.sm }}>
          {mode === 'signup' && (
            <>
              <input className="lynk-input" type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
              <input className="lynk-input" type="text" placeholder="Access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required style={inputStyle} />
            </>
          )}
          <input className="lynk-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input className="lynk-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />

          {mode === 'signup' && (
            <p style={{ fontFamily: font.body, fontSize: '13px', color: color.mutedDim }}>
              Access codes are given to accepted cohort applicants and instructors — reach out if you don't have one.
            </p>
          )}

          {error && <p style={{ fontFamily: font.body, fontSize: '13px', color: '#E05252' }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ ...buttonPrimary, justifyContent: 'center', marginTop: space.xs }}>
            {loading ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          style={{
            background: 'none',
            border: 'none',
            color: color.cyan,
            fontFamily: font.body,
            fontSize: '14px',
            cursor: 'pointer',
            marginTop: space.md,
            padding: 0,
          }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>

      <style>{`
        .lynk-input:focus {
          border-color: ${color.cyan} !important;
          box-shadow: 0 0 0 3px ${color.cyanFaint};
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bg,
  border: `1px solid ${color.line}`,
  borderRadius: radius.md,
  padding: '14px 16px',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};
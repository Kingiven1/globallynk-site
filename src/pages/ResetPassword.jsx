import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, body, buttonPrimary, card, radius, container, space, font } from '../styles/tokens';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token out of the URL and fires
    // PASSWORD_RECOVERY once the session from that link is established.
    // If the link is old/expired/already used, no session ever shows up.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setReady(true);
      }
    });

    // Cover the case where the event already fired before this component
    // mounted (e.g. fast redirect) — check for an existing session too.
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });

    const timeout = setTimeout(() => {
      setReady((current) => {
        if (!current) setLinkInvalid(true);
        return current;
      });
    }, 4000);

    return () => {
      listener?.subscription?.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError("Passwords don't match.");
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return setError(error.message);
    setSuccess(true);
    setTimeout(() => navigate('/portal'), 1800);
  }

  if (linkInvalid && !ready) {
    return (
      <div style={{ position: 'relative', padding: `${space.xxl} 0`, overflow: 'hidden' }}>
        <GradientOrb seed={91} size={380} style={{ position: 'absolute', top: '-100px', left: '-80px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <div style={eyebrow}><span>Link expired</span></div>
          <h1 style={{ ...h1, fontSize: '32px' }}>This reset link isn't valid anymore</h1>
          <p style={{ ...body, marginTop: space.sm }}>
            Password reset links expire after a while, and only work once. Request a new one from the login page.
          </p>
          <Link
            to="/login"
            style={{ ...buttonPrimary, display: 'inline-flex', marginTop: space.lg }}
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ position: 'relative', padding: `${space.xxl} 0`, overflow: 'hidden' }}>
        <GradientOrb seed={91} size={380} style={{ position: 'absolute', top: '-100px', left: '-80px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '480px' }}>
          <div style={eyebrow}><span>Password updated</span></div>
          <h1 style={{ ...h1, fontSize: '32px' }}>You're all set.</h1>
          <p style={{ ...body, marginTop: space.sm }}>Taking you to your portal…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', padding: `${space.xxl} 0`, overflow: 'hidden' }}>
      <GradientOrb seed={91} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1, maxWidth: '440px' }}>
        <div style={eyebrow}><span>Reset password</span></div>
        <h1 style={{ ...h1, fontSize: '34px', marginBottom: space.lg }}>Set a new password.</h1>

        <form onSubmit={handleSubmit} style={{ ...card, padding: space.xl, display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <input
            className="lynk-input"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />
          <input
            className="lynk-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && <p style={{ fontFamily: font.body, fontSize: '13px', color: '#E05252' }}>{error}</p>}

          <button type="submit" disabled={loading || !ready} style={{ ...buttonPrimary, justifyContent: 'center', marginTop: space.xs }}>
            {!ready ? 'Verifying link…' : loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
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
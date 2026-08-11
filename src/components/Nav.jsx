import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { color, font, container } from '../styles/tokens';
import logo from '../assets/images/Global-Lynk_Base-Logomark-White@4x.png';

const BASE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/cohort', label: 'Cohort' },
  { to: '/journey', label: 'Our Journey' },
  { to: '/alumni', label: 'DJs' },
  { to: '/contact', label: 'Contact' },
  { to: '/donate', label: 'Donate' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate('/');
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(13,13,13,0.88)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${color.line}`,
      }}
    >
      <div
        style={{
          ...container,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="GlobalLYNK" style={{ height: '32px', width: 'auto' }} />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '26px' }} className="lynk-nav-desktop">
          {BASE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: font.mono,
                fontSize: '13px',
                letterSpacing: '0.01em',
                textDecoration: 'none',
                color: location.pathname === link.to ? color.cyan : color.muted,
                paddingBottom: '4px',
                borderBottom:
                  location.pathname === link.to
                    ? `1px solid ${color.cyan}`
                    : '1px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link
                to="/portal"
                style={{
                  fontFamily: font.mono,
                  fontSize: '13px',
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  color: location.pathname === '/portal' ? color.cyan : color.muted,
                  paddingBottom: '4px',
                  borderBottom: location.pathname === '/portal' ? `1px solid ${color.cyan}` : '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                Portal
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: font.mono,
                  fontSize: '12px',
                  letterSpacing: '0.01em',
                  color: color.mutedDim,
                  background: 'none',
                  border: `1px solid ${color.line}`,
                  borderRadius: '999px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                fontFamily: font.mono,
                fontSize: '13px',
                letterSpacing: '0.01em',
                textDecoration: 'none',
                color: location.pathname === '/login' ? color.cyan : color.muted,
                paddingBottom: '4px',
                borderBottom: location.pathname === '/login' ? `1px solid ${color.cyan}` : '1px solid transparent',
                whiteSpace: 'nowrap',
              }}
            >
              Sign In
            </Link>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lynk-nav-toggle"
          style={{
            display: 'none',
            background: 'transparent',
            border: `1px solid ${color.line}`,
            color: color.white,
            padding: '8px 12px',
            fontFamily: font.mono,
            fontSize: '12px',
            letterSpacing: '0.01em',
            cursor: 'pointer',
          }}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div
          style={{
            borderTop: `1px solid ${color.line}`,
            padding: '16px 32px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {BASE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: font.mono,
                fontSize: '14px',
                letterSpacing: '0.01em',
                textDecoration: 'none',
                color: location.pathname === link.to ? color.cyan : color.white,
              }}
            >
              {link.label}
            </Link>
          ))}

          {session ? (
            <>
              <Link
                to="/portal"
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: font.mono,
                  fontSize: '14px',
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  color: location.pathname === '/portal' ? color.cyan : color.white,
                }}
              >
                Portal
              </Link>
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: font.mono,
                  fontSize: '14px',
                  letterSpacing: '0.01em',
                  color: color.white,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              style={{
                fontFamily: font.mono,
                fontSize: '14px',
                letterSpacing: '0.01em',
                textDecoration: 'none',
                color: location.pathname === '/login' ? color.cyan : color.white,
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .lynk-nav-desktop { display: none !important; }
          .lynk-nav-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { color, font, container } from '../styles/tokens';
import logo from '../assets/images/Global-Lynk_Base-Logomark-White@4x.png';

const LINKS = [
  { to: '/events', label: 'Events' },
  { to: '/cohort', label: 'Cohort' },
  { to: '/journey', label: 'Our Journey' },
  { to: '/alumni', label: 'DJs' },
  { to: '/donate', label: 'Donate' },
  { to: '/login', label: 'Sign In' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
      <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="GlobalLYNK" style={{ height: '32px', width: 'auto' }} />
        </Link>

        <nav style={{ display: 'flex', gap: '36px' }} className="lynk-nav-desktop">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontFamily: font.mono,
                fontSize: '13px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: location.pathname === link.to ? color.cyan : color.muted,
                paddingBottom: '4px',
                borderBottom: location.pathname === link.to ? `1px solid ${color.cyan}` : '1px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
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
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${color.line}`, padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: font.mono,
                fontSize: '14px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: location.pathname === link.to ? color.cyan : color.white,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 780px) {
          .lynk-nav-desktop { display: none !important; }
          .lynk-nav-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
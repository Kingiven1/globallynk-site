import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { color, font, container } from '../styles/tokens';
import logo from '../assets/images/Global-Lynk_Base-Logomark-White@4x.png';

// ──────────────────────────────────────────────────────────────────────────
// EDITABLE NAVIGATION
// Everything in the top bar comes from this block. To add, move or remove a
// link, change it here; nothing below needs to be touched.
// ──────────────────────────────────────────────────────────────────────────

const NAV = [
  { to: '/', label: 'Home' },
  {
    label: 'Learn',
    items: [
      { to: '/events', label: 'Workshops & events' },
      { to: '/cohort', label: 'Cohort' },
    ],
  },
  {
    label: 'Culture Exchange',
    items: [
      { to: '/culture-exchange', label: 'Tables Turned' },
      { to: '/culture-exchange/vote', label: 'Watch & vote' },
    ],
  },
  {
    label: 'Art Basel',
    items: [
      { to: '/mix-lab', label: 'The Mix Lab' },
      { to: '/mix-lab/partner-application', label: 'Become a Community Partner' },
    ],
  },
  {
    label: 'About',
    items: [
      { to: '/journey', label: 'Our Journey' },
      { to: '/alumni', label: 'DJs' },
      { to: '/book-dj', label: 'Book a DJ' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  { to: '/donate', label: 'Donate' },
];

// The one highlighted button in the bar. Point it at whatever matters most right now
// (voting today; later the Mix Lab or a workshop).
const FEATURED = { to: '/culture-exchange/vote', label: 'Vote now' };

const ADMIN_ITEMS = [
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/votes', label: 'Votes' },
  { to: '/admin/partners', label: 'Partners' },
];

export default function Nav() {
  const [open, setOpen] = useState(false); // mobile menu
  const [openGroup, setOpenGroup] = useState(null); // which desktop dropdown is open
  const barRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const isAdmin = profile?.role === 'admin';

  // Close menus whenever the page changes
  useEffect(() => {
    setOpenGroup(null);
    setOpen(false);
  }, [location.pathname]);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    function onDown(e) {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenGroup(null);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenGroup(null);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    navigate('/');
  }

  const groupActive = (items) => items.some((i) => location.pathname === i.to);

  const topStyle = (active) => ({
    fontFamily: font.mono,
    fontSize: '14px',
    letterSpacing: '-0.005em',
    textDecoration: 'none',
    color: active ? color.cyan : color.muted,
    paddingBottom: '4px',
    borderBottom: active ? `1px solid ${color.cyan}` : '1px solid transparent',
    whiteSpace: 'nowrap',
    background: 'none',
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    cursor: 'pointer',
    padding: '0 0 4px',
  });

  const featuredStyle = {
    fontFamily: font.body,
    fontSize: '13px',
    fontWeight: 500,
    letterSpacing: '0',
    textDecoration: 'none',
    color: '#fff',
    background: color.cyan,
    borderRadius: '999px',
    padding: '9px 18px',
    whiteSpace: 'nowrap',
  };

  const mobileLink = (path) => ({
    fontFamily: font.mono,
    fontSize: '14px',
    letterSpacing: '0.01em',
    textDecoration: 'none',
    color: location.pathname === path ? color.cyan : color.white,
  });

  const mobileHeading = {
    fontFamily: font.mono,
    fontSize: '11px',
    letterSpacing: '0.06em',
    color: color.mutedDim,
    textTransform: 'uppercase',
    marginBottom: '-6px',
  };

  // Called as a function (not used as <Component/>) so the menu isn't remounted on every state change.
  function renderDropdown(group) {
    const isOpen = openGroup === group.label;
    return (
      <div
        key={group.label}
        style={{ position: 'relative' }}
        onMouseEnter={() => setOpenGroup(group.label)}
        onMouseLeave={() => setOpenGroup((g) => (g === group.label ? null : g))}
      >
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          onClick={() => setOpenGroup(isOpen ? null : group.label)}
          style={topStyle(groupActive(group.items))}
        >
          {group.label} <span aria-hidden="true" style={{ fontSize: '10px' }}>▾</span>
        </button>
        {isOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: '-14px',
              paddingTop: '10px', // invisible bridge so the menu stays open while the mouse travels to it
              zIndex: 60,
            }}
          >
            <div
              style={{
                minWidth: '210px',
                background: color.bg,
                border: `1px solid ${color.line}`,
                borderRadius: '14px',
                padding: '8px',
                boxShadow: '0 14px 36px rgba(0,0,0,0.12)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {group.items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  className="lynk-dd-item"
                  style={{
                    fontFamily: font.mono,
                    fontSize: '13px',
                    textDecoration: 'none',
                    color: location.pathname === item.to ? color.cyan : color.white,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <header
      ref={barRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(245,245,247,0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: `1px solid ${color.line}`,
      }}
    >
      <div
        style={{
          ...container,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Link to="/" aria-label="GlobalLYNK home" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="GlobalLYNK" style={{ height: '32px', width: 'auto', filter: 'brightness(0)' }} />
        </Link>

        <nav aria-label="Main" style={{ display: 'flex', alignItems: 'center', gap: '26px' }} className="lynk-nav-desktop">
          {NAV.map((entry) =>
            entry.items ? (
              renderDropdown(entry)
            ) : (
              <Link key={entry.to} to={entry.to} style={topStyle(location.pathname === entry.to)}>
                {entry.label}
              </Link>
            )
          )}

          {FEATURED && (
            <Link to={FEATURED.to} style={featuredStyle}>
              {FEATURED.label}
            </Link>
          )}

          {session ? (
            <>
              <Link to="/portal" style={topStyle(location.pathname === '/portal')}>
                Portal
              </Link>
              {isAdmin && renderDropdown({ label: 'Admin', items: ADMIN_ITEMS })}
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
            <Link to="/login" style={topStyle(location.pathname === '/login')}>
              Sign In
            </Link>
          )}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lynk-nav-toggle"
          aria-expanded={open}
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
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
          }}
        >
          {FEATURED && (
            <Link to={FEATURED.to} onClick={() => setOpen(false)} style={{ ...featuredStyle, textAlign: 'center' }}>
              {FEATURED.label}
            </Link>
          )}

          {NAV.map((entry) =>
            entry.items ? (
              <div key={entry.label} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={mobileHeading}>{entry.label}</div>
                {entry.items.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{ ...mobileLink(item.to), paddingLeft: '10px' }}>
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={entry.to} to={entry.to} onClick={() => setOpen(false)} style={mobileLink(entry.to)}>
                {entry.label}
              </Link>
            )
          )}

          {session ? (
            <>
              <Link to="/portal" onClick={() => setOpen(false)} style={mobileLink('/portal')}>
                Portal
              </Link>
              {isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={mobileHeading}>Admin</div>
                  {ADMIN_ITEMS.map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)} style={{ ...mobileLink(item.to), paddingLeft: '10px' }}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
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
            <Link to="/login" onClick={() => setOpen(false)} style={mobileLink('/login')}>
              Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        .lynk-dd-item:hover, .lynk-dd-item:focus-visible { background: rgba(8,124,145,0.09); }
        @media (max-width: 900px) {
          .lynk-nav-desktop { display: none !important; }
          .lynk-nav-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
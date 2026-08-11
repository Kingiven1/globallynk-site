import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MailingListSignup from './MailingListSignup';
import { color, radius, space } from '../styles/tokens';

const EXCLUDED_PATHS = ['/login', '/portal'];

// Shows once per browser session (not once per page — sessionStorage
// persists across navigation until the tab closes), a few seconds after
// landing, so it doesn't ambush people the instant the page loads.
// Skipped entirely on login/portal — signing in isn't the moment to
// also ask someone to join a mailing list.
export default function MailingListPopup() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const isExcluded = EXCLUDED_PATHS.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    if (isExcluded) {
      setVisible(false);
      return;
    }

    const alreadyShown = sessionStorage.getItem('lynk-mailing-popup-shown');
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem('lynk-mailing-popup-shown', 'true');
    }, 4000);

    return () => clearTimeout(timer);
  }, [isExcluded]);

  if (!visible || isExcluded) return null;

  function close() {
    setVisible(false);
  }

  return (
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: space.md,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: color.bgRaised,
          border: `1px solid ${color.line}`,
          borderRadius: radius.lg,
          padding: space.xl,
          maxWidth: '440px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
        }}
      >
        <button
          onClick={close}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'transparent',
            border: 'none',
            color: color.mutedDim,
            fontSize: '20px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <MailingListSignup />
      </div>
    </div>
  );
}
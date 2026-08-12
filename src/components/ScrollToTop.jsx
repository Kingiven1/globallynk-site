import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation by default.
// Two things fight us here: (1) the browser's own scroll restoration,
// which tries to remember scroll position per history entry and can
// override anything we do, and (2) content that loads in after the
// route change and shifts the page. This turns off the browser's
// restoration entirely and forces scroll-to-top on every navigation,
// using useLayoutEffect so it happens before the browser paints.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
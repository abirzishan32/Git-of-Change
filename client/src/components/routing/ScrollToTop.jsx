import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Starts each page at the top, or at the element named in the URL hash. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

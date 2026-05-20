// hooks/useBackNavigation.ts
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useBackNavigation(defaultRoute = '/dashboard/patient/search') {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef<string | null>(null);

  // Track previous path on every route change
  useEffect(() => {
    return () => {
      previousPathRef.current = location.pathname;
    };
  }, [location.pathname]);

  const goBack = () => {
    const referrer = document.referrer;
    const currentDomain = window.location.hostname;

    // Case 1: Referrer exists and is from same domain
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.hostname === currentDomain) {
          navigate(-1);
          return;
        }
      } catch (e) {
        // Invalid referrer URL, fall through
      }
    }

    // Case 2: No referrer, but we have a stored previous path (internal SPA navigation)
    if (previousPathRef.current && previousPathRef.current !== location.pathname) {
      navigate(-1);
      return;
    }

    // Case 3: Fallback to a safe internal route
    navigate(defaultRoute);
  };

  return { goBack, hasHistory: !!previousPathRef.current };
}
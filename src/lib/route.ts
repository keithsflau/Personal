import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'unit'; unitId: string }
  | { name: 'play'; activityId: string }
  | { name: 'daily' }
  | { name: 'check' };

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'check') return { name: 'check' };
  if (parts[0] === 'daily') return { name: 'daily' };
  if (parts[0] === 'unit' && parts[1]) return { name: 'unit', unitId: decodeURIComponent(parts[1]) };
  if (parts[0] === 'play' && parts[1]) return { name: 'play', activityId: decodeURIComponent(parts[1]) };
  return { name: 'home' };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

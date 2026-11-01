export type ActivityScore = {
  best: number;
  plays: number;
  last: number;
};

export type Store = {
  activities: Record<string, ActivityScore>;
  checks: Record<string, boolean>;
};

const KEY = 'play-english-v1';

const empty = (): Store => ({ activities: {}, checks: {} });

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const data = JSON.parse(raw) as Partial<Store>;
    if (!data || typeof data !== 'object' || !data.activities || !data.checks) return empty();
    return { activities: data.activities, checks: data.checks };
  } catch {
    return empty();
  }
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignore private-mode quota errors */
  }
}

export function recordScore(id: string, pct: number): Store {
  const store = loadStore();
  const prev = store.activities[id];
  store.activities[id] = {
    best: prev ? Math.max(prev.best, pct) : pct,
    plays: (prev?.plays ?? 0) + 1,
    last: pct,
  };
  saveStore(store);
  return store;
}

export function toggleCheck(id: string): Store {
  const store = loadStore();
  store.checks[id] = !store.checks[id];
  saveStore(store);
  return store;
}

export function starsFor(best: number | undefined): number {
  if (best === undefined) return 0;
  if (best >= 100) return 3;
  if (best >= 80) return 2;
  if (best >= 60) return 1;
  return 0;
}

export function clearStore(): Store {
  const store = empty();
  saveStore(store);
  return store;
}

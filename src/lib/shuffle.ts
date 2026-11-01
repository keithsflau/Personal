export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const arr = [...items];
  let h = hashSeed(seed);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const j = h % (i + 1);
    const swap = arr[i];
    arr[i] = arr[j] as T;
    arr[j] = swap as T;
  }
  return arr;
}

export function shufflePrompt<T>(items: readonly T[], seed: string): T[] {
  const next = seededShuffle(items, seed);
  const same = next.every((item, index) => item === items[index]);
  if (same && next.length > 1) return [...next.slice(1), next[0] as T];
  return next;
}

export function norm(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.。!！?？,，]/g, '');
}

export function answersMatch(input: string, answer: string, accept: string[] = []): boolean {
  const got = norm(input);
  return [answer, ...accept].some((item) => norm(item) === got);
}

export function hkDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function hkDateLabel(date = new Date()): string {
  return new Intl.DateTimeFormat('zh-HK', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

import type {
  BuildStep,
  ChartData,
  ClozeBlank,
  ClozeStep,
  InfoStep,
  MatchStep,
  McqStep,
  OrderStep,
  SearchStep,
  SortStep,
  TfStep,
} from '../lib/types';

export const info = (title: string, body: string, example?: string): InfoStep => ({
  type: 'info',
  title,
  body,
  ...(example ? { example } : {}),
});

export const mcq = (
  prompt: string,
  options: string[],
  answer: number,
  why: string,
  extra?: Partial<Pick<McqStep, 'hint' | 'chart' | 'standalone'>>,
): McqStep => ({
  type: 'mcq',
  prompt,
  options,
  answer,
  why,
  ...extra,
});

export const sort = (
  prompt: string,
  buckets: string[],
  items: { text: string; bucket: number }[],
  why: string,
  hint?: string,
): SortStep => ({ type: 'sort', prompt, buckets, items, why, ...(hint ? { hint } : {}) });

export const match = (
  prompt: string,
  pairs: { left: string; right: string }[],
  why: string,
): MatchStep => ({ type: 'match', prompt, pairs, why });

export const order = (prompt: string, items: string[], why: string, hint?: string): OrderStep => ({
  type: 'order',
  prompt,
  items,
  why,
  ...(hint ? { hint } : {}),
});

export const build = (
  prompt: string,
  tiles: string[],
  answer: string[],
  why: string,
  hint?: string,
): BuildStep => ({ type: 'build', prompt, tiles, answer, why, ...(hint ? { hint } : {}) });

export const cloze = (
  prompt: string,
  parts: Array<string | ClozeBlank>,
  why: string,
  extra?: { bank?: string[]; hint?: string },
): ClozeStep => ({
  type: 'cloze',
  prompt,
  parts,
  why,
  ...(extra?.bank ? { bank: extra.bank } : {}),
  ...(extra?.hint ? { hint: extra.hint } : {}),
});

export const blank = (answer: string, accept?: string[]): ClozeBlank => ({
  answer,
  ...(accept ? { accept } : {}),
});

export const tf = (
  prompt: string,
  statements: { text: string; answer: boolean; why: string }[],
  why: string,
): TfStep => ({ type: 'tf', prompt, statements, why });

export const search = (prompt: string, words: string[], grid: string[], why: string): SearchStep => ({
  type: 'search',
  prompt,
  words,
  grid,
  why,
});

export const chart = (
  title: string,
  y: string,
  bars: { label: string; value: number }[],
  showValues = true,
): ChartData => ({ title, y, bars, showValues });

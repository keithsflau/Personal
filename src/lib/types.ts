export type Tone = 'orange' | 'teal' | 'violet' | 'rose' | 'gold';

export type ChartData = {
  title: string;
  y: string;
  bars: { label: string; value: number }[];
  showValues?: boolean;
};

export type InfoStep = {
  type: 'info';
  title: string;
  body: string;
  example?: string;
};

export type McqStep = {
  type: 'mcq';
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  hint?: string;
  chart?: ChartData;
  standalone?: boolean;
};

export type SortStep = {
  type: 'sort';
  prompt: string;
  buckets: string[];
  items: { text: string; bucket: number }[];
  why: string;
  hint?: string;
};

export type MatchStep = {
  type: 'match';
  prompt: string;
  pairs: { left: string; right: string }[];
  why: string;
};

export type OrderStep = {
  type: 'order';
  prompt: string;
  items: string[];
  why: string;
  hint?: string;
};

export type BuildStep = {
  type: 'build';
  prompt: string;
  tiles: string[];
  answer: string[];
  why: string;
  hint?: string;
};

export type ClozeBlank = { answer: string; accept?: string[] };

export type ClozeStep = {
  type: 'cloze';
  prompt: string;
  parts: Array<string | ClozeBlank>;
  bank?: string[];
  why: string;
  hint?: string;
};

export type TfStep = {
  type: 'tf';
  prompt: string;
  statements: { text: string; answer: boolean; why: string }[];
  why: string;
};

export type SearchStep = {
  type: 'search';
  prompt: string;
  words: string[];
  grid: string[];
  why: string;
};

export type Step =
  | InfoStep
  | McqStep
  | SortStep
  | MatchStep
  | OrderStep
  | BuildStep
  | ClozeStep
  | TfStep
  | SearchStep;

export type Passage = {
  kicker: string;
  title: string;
  paragraphs: string[];
};

export type Activity = {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  minutes: number;
  steps: Step[];
  passage?: Passage;
};

export type Unit = {
  id: string;
  no: number;
  title: string;
  titleZh: string;
  blurb: string;
  tone: Tone;
  skills: string[];
};

export type Detail = {
  prompt: string;
  answer: string;
  why: string;
};

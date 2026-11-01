import { activities, standalonePool } from '../data';
import { units } from '../data/units';
import type { Activity, ClozeBlank, Step } from './types';

function fail(message: string): never {
  throw new Error(`Content: ${message}`);
}

function countOf(list: string[], value: string): number {
  return list.filter((item) => item === value).length;
}

function gridHas(grid: string[], word: string): boolean {
  const target = word.toUpperCase();
  const cols = grid[0]?.length ?? 0;
  const lines = [...grid];
  for (let col = 0; col < cols; col += 1) {
    let vertical = '';
    for (const row of grid) vertical += row[col] ?? '';
    lines.push(vertical);
  }
  return lines.some((line) => line.includes(target) || [...line].reverse().join('').includes(target));
}

function checkStep(activity: Activity, step: Step, index: number): void {
  const where = `${activity.id}#${index}`;
  if (step.type === 'info') {
    if (!step.title.trim() || !step.body.trim()) fail(`${where} empty info`);
    return;
  }
  if (!step.why.trim()) fail(`${where} missing why`);
  if (step.type === 'mcq') {
    if (step.options.length < 2) fail(`${where} needs options`);
    if (new Set(step.options).size !== step.options.length) fail(`${where} duplicate options`);
    if (!Number.isInteger(step.answer) || step.answer < 0 || step.answer >= step.options.length) {
      fail(`${where} bad answer index`);
    }
    if (step.chart && step.chart.bars.length < 2) fail(`${where} chart`);
    return;
  }
  if (step.type === 'sort') {
    if (step.buckets.length < 2) fail(`${where} buckets`);
    const texts = step.items.map((item) => item.text);
    if (new Set(texts).size !== texts.length) fail(`${where} duplicate sort items`);
    for (const item of step.items) {
      if (item.bucket < 0 || item.bucket >= step.buckets.length) fail(`${where} bad bucket`);
    }
    return;
  }
  if (step.type === 'match') {
    if (step.pairs.length < 2) fail(`${where} pairs`);
    const left = step.pairs.map((pair) => pair.left);
    const right = step.pairs.map((pair) => pair.right);
    if (new Set(left).size !== left.length || new Set(right).size !== right.length) fail(`${where} duplicate pairs`);
    return;
  }
  if (step.type === 'order') {
    if (step.items.length < 2 || new Set(step.items).size !== step.items.length) fail(`${where} order`);
    return;
  }
  if (step.type === 'build') {
    if (step.answer.length < 2) fail(`${where} build answer`);
    for (const tile of step.answer) {
      if (countOf(step.tiles, tile) < countOf(step.answer, tile)) fail(`${where} missing tile ${tile}`);
    }
    return;
  }
  if (step.type === 'cloze') {
    const blanks = step.parts.filter((part): part is ClozeBlank => typeof part !== 'string');
    if (blanks.length === 0) fail(`${where} no blanks`);
    for (const item of blanks) {
      if (!item.answer.trim()) fail(`${where} empty blank`);
      if (step.bank && !step.bank.includes(item.answer)) fail(`${where} bank missing ${item.answer}`);
    }
    return;
  }
  if (step.type === 'tf') {
    if (step.statements.length === 0) fail(`${where} tf`);
    return;
  }
  if (step.words.length < 3) fail(`${where} search words`);
  const width = step.grid[0]?.length ?? 0;
  if (step.grid.some((row) => row.length !== width)) fail(`${where} grid shape`);
  for (const word of step.words) {
    if (!gridHas(step.grid, word)) fail(`${where} cannot find ${word}`);
  }
}

export function assertContent(): void {
  const ids = new Set<string>();
  const unitIds = new Set(units.map((unit) => unit.id));
  if (activities.length < 20) fail('expected a full module of activities');
  for (const activity of activities) {
    if (ids.has(activity.id)) fail(`duplicate ${activity.id}`);
    ids.add(activity.id);
    if (!unitIds.has(activity.unitId)) fail(`${activity.id} bad unit`);
    if (activity.steps.length === 0) fail(`${activity.id} empty`);
    if (!activity.steps.some((step) => step.type !== 'info')) fail(`${activity.id} has no questions`);
    activity.steps.forEach((step, index) => checkStep(activity, step, index));
  }
  if (standalonePool().length < 12) fail('daily pool is too small');
}

export function contentStats(): { activities: number; steps: number; daily: number } {
  return {
    activities: activities.length,
    steps: activities.reduce((sum, activity) => sum + activity.steps.length, 0),
    daily: standalonePool().length,
  };
}

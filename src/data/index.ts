import type { Activity, McqStep } from '../lib/types';
import { seededShuffle } from '../lib/shuffle';
import { unit1 } from './u1';
import { unit2 } from './u2';
import { unit3 } from './u3';
import { unit4 } from './u4';

export const activities: Activity[] = [...unit1, ...unit2, ...unit3, ...unit4];

export function activitiesFor(unitId: string): Activity[] {
  return activities.filter((activity) => activity.unitId === unitId);
}

export function standalonePool(): McqStep[] {
  return activities.flatMap((activity) =>
    activity.steps.filter((step): step is McqStep => step.type === 'mcq' && step.standalone === true),
  );
}

export function makeDaily(date: string): Activity {
  const picked = seededShuffle(standalonePool(), `daily-${date}`).slice(0, 5);
  return {
    id: `daily-${date}`,
    unitId: 'daily',
    title: '每日五題',
    subtitle: '從四個單元抽出來的快問快答',
    minutes: 5,
    steps: picked,
  };
}

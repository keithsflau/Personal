import type { ReactNode } from 'react';
import { activities } from '../data';
import { units } from '../data/units';
import type { Tone } from '../lib/types';
import { loadStore, starsFor } from '../lib/progress';
import type { Route } from '../lib/route';
import { Mascot } from './bits';

export function Shell({ route, tone, children }: { route: Route; tone: Tone; children: ReactNode }) {
  const store = loadStore();
  const earned = activities.reduce((sum, activity) => sum + starsFor(store.activities[activity.id]?.best), 0);
  return (
    <div className={`app tone-${tone}`}>
      <a className="skip" href="#content">
        跳到內容
      </a>
      <header className="rail">
        <a className="brand" href="#/">
          <Mascot />
          <span>
            <strong>玩轉英語</strong>
            <em>Leisure · Friends · Books</em>
          </span>
        </a>
        <nav className="rail-nav" aria-label="單元">
          <a href="#/" aria-current={route.name === 'home' ? 'page' : undefined}>
            首頁
          </a>
          {units.map((unit) => (
            <a key={unit.id} href={`#/unit/${unit.id}`} aria-current={route.name === 'unit' && route.unitId === unit.id ? 'page' : undefined}>
              {unit.no}. {unit.titleZh}
            </a>
          ))}
          <a href="#/daily" aria-current={route.name === 'daily' ? 'page' : undefined}>
            每日五題
          </a>
          <a href="#/check" aria-current={route.name === 'check' ? 'page' : undefined}>
            自評
          </a>
        </nav>
        <p className="rail-extra">
          星星 {earned} / {activities.length * 3}
        </p>
      </header>
      <main id="content" tabIndex={-1} className="main" data-tone={tone}>
        {children}
      </main>
    </div>
  );
}

export function toneFor(route: Route): Tone {
  if (route.name === 'unit') return units.find((unit) => unit.id === route.unitId)?.tone ?? 'gold';
  if (route.name === 'play') {
    const activity = activities.find((item) => item.id === route.activityId);
    if (!activity || activity.unitId === 'daily') return 'gold';
    return units.find((unit) => unit.id === activity.unitId)?.tone ?? 'gold';
  }
  if (route.name === 'check') return 'violet';
  if (route.name === 'daily') return 'gold';
  return 'gold';
}

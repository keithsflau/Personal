import { useState } from 'react';
import { activities, activitiesFor } from '../data';
import { units } from '../data/units';
import { hkDateKey, hkDateLabel } from '../lib/shuffle';
import { loadStore, starsFor } from '../lib/progress';
import { Mascot, Stars } from './bits';

export function Home() {
  const store = loadStore();
  const earned = activities.reduce((sum, activity) => sum + starsFor(store.activities[activity.id]?.best), 0);
  const next = activities.find((activity) => (store.activities[activity.id]?.best ?? 0) < 100) ?? activities[0];
  const today = hkDateKey();
  const dailyDone = Boolean(store.activities[`daily-${today}`]);

  return (
    <div className="home">
      <section className="hero">
        <div>
          <p className="kicker">Unit 1–4</p>
          <h1>玩轉英語</h1>
          <p className="lede">
            休閒、相處、友情、閱讀。每題即時批改，星星會留在這部裝置上。題目是按課題寫的練習，不是課本原文。
          </p>
          <div className="actions">
            {next && (
              <a className="btn" href={`#/play/${next.id}`}>
                繼續練習
              </a>
            )}
            <a className="btn ghost" href="#/daily">
              {dailyDone ? '今日五題已完成' : '每日五題'}
            </a>
          </div>
          <p className="muted">
            {hkDateLabel()}　·　星星 {earned} / {activities.length * 3}
          </p>
        </div>
        <div className="hero-side">
          <Mascot />
          <Warmup />
        </div>
      </section>
      <section className="unit-grid">
        {units.map((unit) => {
          const list = activitiesFor(unit.id);
          const unitStars = list.reduce((sum, activity) => sum + starsFor(store.activities[activity.id]?.best), 0);
          return (
            <a key={unit.id} className={`unit-card tone-${unit.tone}`} href={`#/unit/${unit.id}`}>
              <span className="unit-no">Unit {unit.no}</span>
              <h2>{unit.titleZh}</h2>
              <p lang="en">{unit.title}</p>
              <p>{unit.blurb}</p>
              <Stars n={unitStars > 0 ? Math.min(3, Math.ceil((unitStars / (list.length * 3)) * 3)) : 0} />
              <span className="go">進入</span>
            </a>
          );
        })}
      </section>
      <section className="side-links">
        <a href="#/check">
          <strong>自評清單</strong>
          <span>對照這四個單元，你已經會什麼。</span>
        </a>
        <a href="#/daily">
          <strong>每日五題</strong>
          <span>每天的五題固定，適合課前五分鐘。</span>
        </a>
      </section>
    </div>
  );
}

function Warmup() {
  const [pick, setPick] = useState<'in' | 'out' | null>(null);
  return (
    <div className="warmup">
      <p>熱身：go hiking 多在哪裡？</p>
      <div className="pair">
        <button type="button" className={pick === 'in' ? 'choice slim on' : 'choice slim'} data-testid="warmup-indoor" onClick={() => setPick('in')}>
          indoor
        </button>
        <button type="button" className={pick === 'out' ? 'choice slim on' : 'choice slim'} data-testid="warmup-outdoor" onClick={() => setPick('out')}>
          outdoor
        </button>
      </div>
      {pick && <p className={pick === 'out' ? 'good-line' : 'bad-line'}>{pick === 'out' ? '對。行山在室外。' : '行山要上路，是 outdoor。'}</p>}
    </div>
  );
}

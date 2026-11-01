import { useEffect, useRef, useState } from 'react';
import type { Activity, Detail } from '../lib/types';
import { activitiesFor } from '../data';
import { recordScore, starsFor } from '../lib/progress';
import { SpeakButton, Stars } from './bits';
import { StepView } from './steps';

type Summary = { correct: number; total: number; pct: number; reviews: Detail[]; missed: number[]; practice: boolean };

export function Player({ activity }: { activity: Activity }) {
  const [round, setRound] = useState(0);
  const [only, setOnly] = useState<number[] | null>(null);
  const back = activity.unitId === 'daily' ? '#/' : `#/unit/${activity.unitId}`;
  const indexes = only ?? activity.steps.map((_, stepIndex) => stepIndex);
  return (
    <PlayerRun
      key={`${activity.id}-${round}-${indexes.join('.')}`}
      activity={activity}
      indexes={indexes}
      practice={only !== null}
      back={back}
      onReplay={() => {
        setOnly(null);
        setRound((value) => value + 1);
      }}
      onMissed={(missed) => {
        setOnly(missed);
        setRound((value) => value + 1);
      }}
    />
  );
}

function PlayerRun({
  activity,
  indexes,
  practice,
  back,
  onReplay,
  onMissed,
}: {
  activity: Activity;
  indexes: number[];
  practice: boolean;
  back: string;
  onReplay: () => void;
  onMissed: (indexes: number[]) => void;
}) {
  const steps = indexes.map((stepIndex) => activity.steps[stepIndex]).filter((item): item is Activity['steps'][number] => Boolean(item));
  const [index, setIndex] = useState(0);
  const [settled, setSettled] = useState<{ firstTry: boolean; detail: Detail } | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const results = useRef<boolean[]>([]);
  const reviews = useRef<Detail[]>([]);
  const step = steps[index];
  const scoredTotal = steps.filter((item) => item.type !== 'info').length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index, summary]);

  if (!step) return null;

  function finish() {
    const correct = results.current.filter(Boolean).length;
    const pct = scoredTotal === 0 ? 0 : Math.round((correct / scoredTotal) * 100);
    if (!practice) recordScore(activity.id, pct);
    const missed = indexes.filter((original, position) => {
      const item = activity.steps[original];
      return Boolean(item && item.type !== 'info' && results.current[position] !== true);
    });
    setSummary({ correct, total: scoredTotal, pct, reviews: [...reviews.current], missed, practice });
  }

  function advance() {
    if (step.type !== 'info') {
      if (!settled) return;
      results.current[index] = settled.firstTry;
      if (!settled.firstTry) reviews.current.push(settled.detail);
    }
    if (index + 1 >= steps.length) {
      finish();
      return;
    }
    setSettled(null);
    setIndex(index + 1);
  }

  if (summary) {
    const stars = starsFor(summary.pct);
    const list = activity.unitId === 'daily' ? [] : activitiesFor(activity.unitId);
    const next = list[list.findIndex((item) => item.id === activity.id) + 1];
    return (
      <section className="card done">
        {summary.pct === 100 && (
          <div className="confetti" aria-hidden="true">
            {['#e86f2a', '#0f9b8e', '#6d5bd0', '#e25b84', '#e0a100'].map((color, dot) => (
              <i key={color} style={{ background: color, left: `${12 + dot * 16}%` }} />
            ))}
          </div>
        )}
        <p className="kicker">完成</p>
        <h1>{activity.title}</h1>
        {summary.practice ? (
          <p className="score">錯題重溫：答對 {summary.correct} / {summary.total}。星星維持原來的紀錄。</p>
        ) : (
          <>
            <Stars n={stars} />
            <p className="score">
              第一次就答對 {summary.correct} / {summary.total}　·　{summary.pct}%
            </p>
            <p>{summaryMessage(summary.pct)}</p>
          </>
        )}
        {summary.reviews.length > 0 && (
          <div className="reviews">
            <h2>再看一次</h2>
            {summary.reviews.map((review) => (
              <article key={review.prompt}>
                <h3>{review.prompt}</h3>
                <p>{review.answer}</p>
                <p>{review.why}</p>
              </article>
            ))}
          </div>
        )}
        <div className="actions">
          {summary.missed.length > 0 && (
            <button type="button" className="btn" data-testid="retry-missed" onClick={() => onMissed(summary.missed)}>
              再練錯題
            </button>
          )}
          <button type="button" className={summary.missed.length > 0 ? 'btn ghost' : 'btn'} onClick={onReplay}>
            再練一次
          </button>
          {next && (
            <a className="btn ghost" href={`#/play/${next.id}`}>
              下一關
            </a>
          )}
          <a className="btn ghost" href={back}>
            返回
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="player">
      <div className="player-top">
        <a className="back" href={back}>
          ← 返回
        </a>
        <div>
          <p className="kicker">{activity.subtitle}</p>
          <h1>{activity.title}</h1>
        </div>
      </div>
      <div className="dots" aria-hidden="true">
        {steps.map((item, dot) => (
          <i key={`${item.type}-${dot}`} className={dot === index ? 'now' : dot < index ? 'did' : ''} />
        ))}
      </div>
      <p className="progress-note">
        {practice
          ? `錯題重溫　第 ${index + 1} / ${steps.length} 題。這輪不改星星。`
          : `第 ${index + 1} / ${steps.length} 步。星星只計算第一次就答對的題目。`}
      </p>
      {activity.passage && (
        <details className="passage" open>
          <summary>
            {activity.passage.kicker} · {activity.passage.title}
          </summary>
          <SpeakButton text={activity.passage.paragraphs.join('\n')} label="朗讀文章" />
          {activity.passage.paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </details>
      )}
      <div className="card">
        {step.type === 'info' ? (
          <article>
            <h2>{step.title}</h2>
            {step.body.split('\n').map((line, lineIndex) => (
              <p key={lineIndex}>{line || '\u00a0'}</p>
            ))}
            {step.example && (
              <div className="example-row">
                <p className="example">{step.example}</p>
                <SpeakButton text={step.example} label="聽一句" />
              </div>
            )}
            <div className="actions">
              <button type="button" className="btn" data-testid="next" onClick={advance}>
                繼續
              </button>
            </div>
          </article>
        ) : (
          <>
            <StepView
              key={`${activity.id}-${index}`}
              step={step}
              seed={`${activity.id}-${index}`}
              locked={settled !== null}
              revealAnswer={Boolean(settled && !settled.firstTry)}
              onPass={(firstTry, detail) => setSettled({ firstTry, detail })}
            />
            {settled && (
              <div className={`feedback ${settled.firstTry ? 'good' : 'bad'}`} aria-live="polite">
                <strong>{settled.firstTry ? '答對了。' : '看看正確答案。'}</strong>
                {!settled.firstTry && <p>{settled.detail.answer}</p>}
                <p>{settled.detail.why}</p>
                <button type="button" className="btn" data-testid="next" onClick={advance}>
                  {index + 1 >= steps.length ? '完成' : '下一題'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function summaryMessage(pct: number): string {
  if (pct >= 100) return '全部第一次就答對，三粒星。';
  if (pct >= 80) return '很穩。再練一次，就可以把錯過的題也拿下來。';
  if (pct >= 60) return '已經過關。錯題的解釋可以再讀一遍。';
  return '這關還沒熟。再練一輪會清楚很多。';
}

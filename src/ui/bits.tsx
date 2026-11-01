import type { ChartData } from '../lib/types';
import { useState } from 'react';
import { canSpeak, speakEnglish } from '../lib/speak';

export function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} 粒星`}>
      {[1, 2, 3].map((star) => (
        <span key={star} className={star <= n ? 'on' : ''}>
          ★
        </span>
      ))}
    </span>
  );
}

export function SpeakButton({ text, label = '朗讀' }: { text: string; label?: string }) {
  if (!canSpeak()) return null;
  return (
    <button type="button" className="btn tiny ghost" data-testid="speak" onClick={() => speakEnglish(text)}>
      {label}
    </button>
  );
}

export function Mascot() {
  return (
    <svg className="mascot" viewBox="0 0 160 150" aria-hidden="true">
      <ellipse cx="82" cy="128" rx="34" ry="8" fill="#e7d3b4" />
      <path d="M40 78c0-28 18-50 42-50s42 22 42 50c0 26-16 42-42 42S40 104 40 78z" fill="#f6b26b" />
      <path d="M48 48 62 18l18 28" fill="#e86f2a" />
      <path d="M112 48 98 18 80 46" fill="#e86f2a" />
      <ellipse cx="70" cy="76" rx="6" ry="7" fill="#243044" />
      <ellipse cx="98" cy="76" rx="6" ry="7" fill="#243044" />
      <ellipse cx="72" cy="74" rx="2" ry="2" fill="#fff" />
      <ellipse cx="100" cy="74" rx="2" ry="2" fill="#fff" />
      <path d="M74 96c6 6 14 6 20 0" fill="none" stroke="#243044" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="60" cy="90" rx="7" ry="4" fill="#f3c1a2" />
      <ellipse cx="108" cy="90" rx="7" ry="4" fill="#f3c1a2" />
      <path d="M58 112h48l-6 16H66z" fill="#0f9b8e" />
      <circle cx="82" cy="120" r="3" fill="#ffe08a" />
    </svg>
  );
}

function niceMax(value: number): number {
  if (value <= 5) return 5;
  if (value <= 10) return 10;
  return Math.ceil(value / 5) * 5;
}

export function BarChart({ chart }: { chart: ChartData }) {
  const [show, setShow] = useState(chart.showValues !== false);
  const max = niceMax(Math.max(...chart.bars.map((bar) => bar.value)));
  const step = max <= 10 ? 2 : 5;
  const ticks: number[] = [];
  for (let tick = 0; tick <= max; tick += step) ticks.push(tick);

  return (
    <figure className="chart">
      <figcaption>{chart.title}</figcaption>
      <div className="chart-layout">
        <div className="y-name">{chart.y}</div>
        <div className="plot-wrap">
          <div className="y-ticks" aria-hidden="true">
            {ticks.map((tick) => (
              <span key={tick} style={{ bottom: `${(tick / max) * 100}%` }}>
                {tick}
              </span>
            ))}
          </div>
          <div className="plot">
            <div className="gridlines" aria-hidden="true">
              {ticks.map((tick) => (
                <i key={tick} style={{ bottom: `${(tick / max) * 100}%` }} />
              ))}
            </div>
            {chart.bars.map((bar) => (
              <div className="bar-col" key={bar.label}>
                <div className="bar-space">
                  <div className="bar" style={{ height: `${(bar.value / max) * 100}%` }}>
                    {show && <span className="bar-val">{bar.value}</span>}
                  </div>
                </div>
                <div className="bar-label">{bar.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chart-foot">
        <span>x-axis：選項</span>
        <button type="button" className="btn tiny ghost" onClick={() => setShow((value) => !value)}>
          {show ? '隱藏數字' : '顯示數字'}
        </button>
      </div>
    </figure>
  );
}

import { useState } from 'react';
import { checklist } from '../data/units';
import { clearStore, loadStore, toggleCheck } from '../lib/progress';

export function SelfCheck() {
  const [store, setStore] = useState(loadStore);
  const total = checklist.reduce((sum, group) => sum + group.items.length, 0);
  const done = checklist.reduce((sum, group) => sum + group.items.filter((item) => store.checks[item.id]).length, 0);

  return (
    <div>
      <header className="unit-head">
        <p className="kicker">Self-assessment</p>
        <h1>我已經會什麼</h1>
        <p className="lede">
          勾選的是你自己的感覺，不是分數。已勾 {done} / {total}。
        </p>
      </header>
      {checklist.map((group) => (
        <section key={group.unit} className={`card check-card tone-${group.tone}`}>
          <h2>{group.unit}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(store.checks[item.id])}
                    onChange={() => setStore(toggleCheck(item.id))}
                  />
                  <span>{item.text}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          setStore(clearStore());
        }}
      >
        清除這部裝置上的星星和自評
      </button>
    </div>
  );
}

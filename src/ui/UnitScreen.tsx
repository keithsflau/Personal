import { activitiesFor } from '../data';
import { units } from '../data/units';
import { loadStore, starsFor } from '../lib/progress';
import { Stars } from './bits';

export function UnitScreen({ unitId }: { unitId: string }) {
  const unit = units.find((item) => item.id === unitId);
  const store = loadStore();
  if (!unit) {
    return (
      <section className="card">
        <h1>找不到這個單元</h1>
        <a className="btn" href="#/">
          回首頁
        </a>
      </section>
    );
  }
  const list = activitiesFor(unit.id);
  const next = list.find((activity) => (store.activities[activity.id]?.best ?? 0) < 100) ?? list[0];
  return (
    <div>
      <header className="unit-head">
        <p className="kicker">Unit {unit.no}</p>
        <h1>{unit.titleZh}</h1>
        <p lang="en" className="lede">
          {unit.title}
        </p>
        <p>{unit.blurb}</p>
        <ul className="skill-row">
          {unit.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        {next && (
          <a className="btn" href={`#/play/${next.id}`}>
            {store.activities[next.id] ? '繼續這一關' : '由第一關開始'}
          </a>
        )}
      </header>
      <ol className="path">
        {list.map((activity, index) => {
          const score = store.activities[activity.id];
          const stars = starsFor(score?.best);
          return (
            <li key={activity.id}>
              <a href={`#/play/${activity.id}`}>
                <span className="path-no">{index + 1}</span>
                <span>
                  <strong>{activity.title}</strong>
                  <em>
                    {activity.subtitle} · 約 {activity.minutes} 分鐘
                    {score ? ` · 最佳 ${score.best}%` : ''}
                  </em>
                </span>
                <Stars n={stars} />
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

import { useEffect } from 'react';
import { activities, makeDaily } from './data';
import { units } from './data/units';
import { hkDateKey } from './lib/shuffle';
import { useRoute } from './lib/route';
import { Home } from './ui/Home';
import { Player } from './ui/Player';
import { SelfCheck } from './ui/SelfCheck';
import { Shell, toneFor } from './ui/Shell';
import { UnitScreen } from './ui/UnitScreen';

export function App() {
  const route = useRoute();
  useEffect(() => {
    const titles: Record<string, string> = {
      home: '玩轉英語',
      check: '自評 · 玩轉英語',
      daily: '每日五題 · 玩轉英語',
    };
    if (route.name === 'unit') {
      const unit = units.find((item) => item.id === route.unitId);
      document.title = unit ? `${unit.titleZh} · 玩轉英語` : '玩轉英語';
      return;
    }
    if (route.name === 'play') {
      const activity = activities.find((item) => item.id === route.activityId);
      document.title = activity ? `${activity.title} · 玩轉英語` : '玩轉英語';
      return;
    }
    document.title = titles[route.name] ?? '玩轉英語';
  }, [route]);

  let body = <Home />;
  if (route.name === 'unit') body = <UnitScreen unitId={route.unitId} />;
  if (route.name === 'check') body = <SelfCheck />;
  if (route.name === 'daily') body = <Player activity={makeDaily(hkDateKey())} />;
  if (route.name === 'play') {
    const activity = activities.find((item) => item.id === route.activityId);
    body = activity ? (
      <Player activity={activity} />
    ) : (
      <section className="card">
        <h1>找不到這一關</h1>
        <a className="btn" href="#/">
          回首頁
        </a>
      </section>
    );
  }

  return (
    <Shell route={route} tone={toneFor(route)}>
      {body}
    </Shell>
  );
}

import { useMemo, useRef, useState } from 'react';
import type { Detail, Step } from '../lib/types';
import { answersMatch, seededShuffle, shufflePrompt } from '../lib/shuffle';
import { BarChart } from './bits';

type Scored = Exclude<Step, { type: 'info' }>;

const letters = 'ABCDEFGH';

function answerText(step: Scored): string {
  if (step.type === 'mcq') return `${letters[step.answer]}. ${step.options[step.answer]}`;
  if (step.type === 'sort') {
    return step.buckets
      .map((bucket, index) => {
        const names = step.items.filter((item) => item.bucket === index).map((item) => item.text);
        return `${bucket}: ${names.join(', ')}`;
      })
      .join(' · ');
  }
  if (step.type === 'match') return step.pairs.map((pair) => `${pair.left} = ${pair.right}`).join(' · ');
  if (step.type === 'order') return step.items.join(' → ');
  if (step.type === 'build') return step.answer.join(' ');
  if (step.type === 'cloze') {
    return step.parts
      .map((part) => (typeof part === 'string' ? part : part.answer))
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (step.type === 'tf') {
    return step.statements.map((item) => `${item.answer ? 'True' : 'False'}: ${item.text}`).join(' ');
  }
  return step.words.join(', ');
}

export function StepView({
  step,
  seed,
  locked,
  revealAnswer,
  onPass,
}: {
  step: Scored;
  seed: string;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
}) {
  const detail = (): Detail => ({ prompt: step.prompt, answer: answerText(step), why: step.why });
  if (step.type === 'mcq') return <Mcq step={step} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  if (step.type === 'sort') return <Sort step={step} seed={seed} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  if (step.type === 'match') return <Match step={step} seed={seed} locked={locked} onPass={onPass} detail={detail()} />;
  if (step.type === 'order') return <Order step={step} seed={seed} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  if (step.type === 'build') return <Build step={step} seed={seed} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  if (step.type === 'cloze') return <Cloze step={step} seed={seed} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  if (step.type === 'tf') return <TrueFalse step={step} locked={locked} revealAnswer={revealAnswer} onPass={onPass} detail={detail()} />;
  return <WordSearch step={step} locked={locked} onPass={onPass} detail={detail()} />;
}

function CheckRow({
  ready,
  hint,
  onCheck,
  onClear,
}: {
  ready: boolean;
  hint: string | null;
  onCheck: () => void;
  onClear?: () => void;
}) {
  return (
    <div className="actions">
      <button type="button" className="btn" data-testid="check" disabled={!ready} onClick={onCheck}>
        檢查
      </button>
      {onClear && (
        <button type="button" className="btn ghost" onClick={onClear}>
          清空
        </button>
      )}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function Mcq({
  step,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'mcq' }>;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  function check() {
    if (picked === null || locked) return;
    if (picked === step.answer) {
      onPass(tries === 0, detail);
      return;
    }
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint(step.hint ?? '再看一次選項，然後改選。');
  }

  return (
    <div>
      {step.chart && <BarChart chart={step.chart} />}
      <h2 className="prompt">{step.prompt}</h2>
      <div className="choices">
        {step.options.map((option, index) => {
          const mark = revealAnswer && index === step.answer ? 'correct' : revealAnswer && index === picked ? 'wrong' : picked === index ? 'on' : '';
          return (
            <button
              key={option}
              type="button"
              className={`choice ${mark}`}
              aria-pressed={picked === index}
              disabled={locked}
              onClick={() => setPicked(index)}
            >
              <span className="letter">{letters[index]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {!locked && <CheckRow ready={picked !== null} hint={hint} onCheck={check} />}
    </div>
  );
}

function Sort({
  step,
  seed,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'sort' }>;
  seed: string;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const items = useMemo(() => seededShuffle(step.items, seed), [step.items, seed]);
  const [placed, setPlaced] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(step.items.map((item) => [item.text, null])),
  );
  const [active, setActive] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const ready = step.items.every((item) => placed[item.text] !== null && placed[item.text] !== undefined);

  function drop(bucket: number) {
    if (!active || locked) return;
    setPlaced((prev) => ({ ...prev, [active]: bucket }));
    setActive(null);
  }

  function check() {
    if (!ready || locked) return;
    const missed = step.items.filter((item) => placed[item.text] !== item.bucket).map((item) => item.text);
    if (missed.length === 0) {
      onPass(tries === 0, detail);
      return;
    }
    setWrong(missed);
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint(step.hint ?? '紅色的詞還未放對，可以改。');
  }

  const pool = items.filter((item) => placed[item.text] === null || placed[item.text] === undefined);

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="pool">
        {pool.map((item) => (
          <button
            key={item.text}
            type="button"
            className={`chip ${active === item.text ? 'on' : ''}`}
            disabled={locked}
            onClick={() => setActive(item.text)}
          >
            {item.text}
          </button>
        ))}
        {pool.length === 0 && <span className="muted">詞語都放好了。</span>}
      </div>
      <div className="buckets">
        {step.buckets.map((bucket, index) => (
          <div key={bucket} className={`bucket ${active ? 'ready' : ''}`}>
            <strong>{bucket}</strong>
            <span>
              {items
                .filter((item) => placed[item.text] === index)
                .map((item) => {
                  const bad = wrong.includes(item.text) || (revealAnswer && placed[item.text] !== item.bucket);
                  return (
                    <button
                      key={item.text}
                      type="button"
                      className={`chip ${bad ? 'bad-word' : revealAnswer ? 'good-word' : ''}`}
                      disabled={locked}
                      onClick={() => setPlaced((prev) => ({ ...prev, [item.text]: null }))}
                    >
                      {item.text}
                    </button>
                  );
                })}
            </span>
            <button type="button" className="btn ghost drop" disabled={locked || !active} onClick={() => drop(index)}>
              放在這裡
            </button>
          </div>
        ))}
      </div>
      {!locked && (
        <CheckRow
          ready={ready}
          hint={hint}
          onCheck={check}
          onClear={() => {
            setPlaced(Object.fromEntries(step.items.map((item) => [item.text, null])));
            setWrong([]);
            setActive(null);
          }}
        />
      )}
    </div>
  );
}

function Match({
  step,
  seed,
  locked,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'match' }>;
  seed: string;
  locked: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const rights = useMemo(() => shufflePrompt(step.pairs.map((pair) => pair.right), `${seed}-r`), [step.pairs, seed]);
  const [leftPick, setLeftPick] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const misses = useRef(0);
  const sent = useRef(false);

  function chooseRight(right: string) {
    if (!leftPick || locked || sent.current) return;
    const pair = step.pairs.find((item) => item.left === leftPick);
    if (pair?.right === right) {
      const next = [...done, leftPick];
      setDone(next);
      setLeftPick(null);
      if (next.length === step.pairs.length) {
        sent.current = true;
        onPass(misses.current === 0, detail);
      }
      return;
    }
    misses.current += 1;
    setShake(true);
    setLeftPick(null);
    window.setTimeout(() => setShake(false), 350);
  }

  return (
    <div className={shake ? 'shake' : ''}>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="match">
        <div>
          {step.pairs.map((pair) => (
            <button
              key={pair.left}
              type="button"
              className={`choice ${done.includes(pair.left) ? 'correct' : leftPick === pair.left ? 'on' : ''}`}
              disabled={locked || done.includes(pair.left)}
              onClick={() => setLeftPick(pair.left)}
            >
              {pair.left}
            </button>
          ))}
        </div>
        <div>
          {rights.map((right) => {
            const used = step.pairs.some((pair) => pair.right === right && done.includes(pair.left));
            return (
              <button key={right} type="button" className={`choice ${used ? 'correct' : ''}`} disabled={locked || used || !leftPick} onClick={() => chooseRight(right)}>
                {right}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Order({
  step,
  seed,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'order' }>;
  seed: string;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const pool = useMemo(() => shufflePrompt(step.items, seed), [step.items, seed]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const rest = pool.filter((item) => !chosen.includes(item));

  function check() {
    if (chosen.length !== step.items.length || locked) return;
    const ok = chosen.every((item, index) => item === step.items[index]);
    if (ok) {
      onPass(tries === 0, detail);
      return;
    }
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint(step.hint ?? '次序還未對。可以清空再排。');
  }

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <ol className="order-list">
        {chosen.map((item, index) => (
          <li key={item}>
            <span>{index + 1}</span>
            {item}
          </li>
        ))}
        {chosen.length === 0 && <li className="muted">點下面的句子，由先到後排好。</li>}
      </ol>
      <div className="pool">
        {rest.map((item) => (
          <button key={item} type="button" className="chip" disabled={locked} onClick={() => setChosen((prev) => [...prev, item])}>
            {item}
          </button>
        ))}
      </div>
      {revealAnswer && <p className="model">參考次序：{step.items.join(' → ')}</p>}
      {!locked && <CheckRow ready={chosen.length === step.items.length} hint={hint} onCheck={check} onClear={() => setChosen([])} />}
    </div>
  );
}

function Build({
  step,
  seed,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'build' }>;
  seed: string;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const tiles = useMemo(() => seededShuffle(step.tiles, seed), [step.tiles, seed]);
  const [tray, setTray] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  function used(tile: string, list: string[]) {
    return list.filter((item) => item === tile).length;
  }

  function add(tile: string) {
    if (locked || used(tile, tray) >= used(tile, step.tiles)) return;
    setTray((prev) => [...prev, tile]);
  }

  function check() {
    if (tray.length !== step.answer.length || locked) return;
    const ok = tray.every((tile, index) => tile === step.answer[index]);
    if (ok) {
      onPass(tries === 0, detail);
      return;
    }
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint(step.hint ?? '看看主詞要不要加 s，以及字的次序。');
  }

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="tray" aria-label="你的句子">
        {step.answer.map((_, index) => (
          <button key={index} type="button" className="slot" disabled={locked || index >= tray.length} onClick={() => setTray((prev) => prev.slice(0, index))}>
            {tray[index] ?? ''}
          </button>
        ))}
      </div>
      <div className="pool">
        {tiles.map((tile, index) => (
          <button key={`${tile}-${index}`} type="button" className="chip" disabled={locked || used(tile, tray) >= used(tile, tiles)} onClick={() => add(tile)}>
            {tile}
          </button>
        ))}
      </div>
      {revealAnswer && <p className="model">{step.answer.join(' ')}</p>}
      {!locked && <CheckRow ready={tray.length === step.answer.length} hint={hint} onCheck={check} onClear={() => setTray([])} />}
    </div>
  );
}

type Token = { key: string; kind: 'text' | 'blank'; text?: string; node: JSX.Element };

function renderClozeLine(tokens: Token[]): JSX.Element[] {
  const nodes: JSX.Element[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const next = tokens[index + 1];
    const after = tokens[index + 2];
    if (token.kind === 'text' && next?.kind === 'blank' && (token.text?.length ?? 99) <= 28) {
      const group = after?.kind === 'text' ? [token, next, after] : [token, next];
      nodes.push(
        <span key={token.key} className="cloze-keep">
          {group.map((item) => (
            <span key={item.key}>{item.node}</span>
          ))}
        </span>,
      );
      index += group.length - 1;
      continue;
    }
    if (token.kind === 'blank') {
      const group = next?.kind === 'text' ? [token, next] : [token];
      nodes.push(
        <span key={token.key} className="cloze-keep">
          {group.map((item) => (
            <span key={item.key}>{item.node}</span>
          ))}
        </span>,
      );
      index += group.length - 1;
      continue;
    }
    nodes.push(<span key={token.key}>{token.node}</span>);
  }
  return nodes;
}

function Cloze({
  step,
  seed,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'cloze' }>;
  seed: string;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const blanks = step.parts.filter((part) => typeof part !== 'string');
  const bank = useMemo(() => (step.bank ? seededShuffle(step.bank, seed) : []), [step.bank, seed]);
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ''));
  const [focus, setFocus] = useState(0);
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [bad, setBad] = useState<boolean[]>(() => blanks.map(() => false));

  function setAt(index: number, value: string) {
    setValues((prev) => prev.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function check() {
    if (values.some((value) => !value.trim()) || locked) return;
    const marks = blanks.map((blank, index) => !answersMatch(values[index] ?? '', blank.answer, blank.accept));
    if (marks.every((mark) => !mark)) {
      onPass(tries === 0, detail);
      return;
    }
    setBad(marks);
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint(step.hint ?? '畫了紅線的空格還要改。');
  }

  const lines: Token[][] = [[]];
  let blankIndex = -1;
  step.parts.forEach((part, index) => {
    if (typeof part === 'string') {
      part.split('\n').forEach((chunk, chunkIndex) => {
        if (chunkIndex > 0) lines.push([]);
        if (!chunk) return;
        lines[lines.length - 1]?.push({ key: `${index}-${chunkIndex}`, kind: 'text', text: chunk, node: <span>{chunk}</span> });
      });
      return;
    }
    blankIndex += 1;
    const current = blankIndex;
    const wrong = bad[current] || (revealAnswer && !answersMatch(values[current] ?? '', part.answer, part.accept));
    const node = step.bank ? (
      <button
        type="button"
        className={`slot ${focus === current ? 'on' : ''} ${wrong ? 'wrong' : ''}`}
        disabled={locked}
        onClick={() => setFocus(current)}
      >
        {values[current] || '　'}
      </button>
    ) : (
      <input
        className={wrong ? 'wrong' : ''}
        aria-label={`空格 ${current + 1}`}
        value={values[current]}
        disabled={locked}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        onChange={(event) => setAt(current, event.target.value)}
      />
    );
    lines[lines.length - 1]?.push({ key: `b-${index}`, kind: 'blank', node });
  });

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="cloze">
        {lines.map((line, lineIndex) => (
          <p key={lineIndex}>{renderClozeLine(line)}</p>
        ))}
      </div>
      {step.bank && (
        <div className="pool">
          {bank.map((word) => (
            <button
              key={word}
              type="button"
              className="chip"
              disabled={locked}
              onClick={() => {
                setAt(focus, word);
                const next = values.findIndex((value, index) => index !== focus && !value);
                if (next >= 0) setFocus(next);
              }}
            >
              {word}
            </button>
          ))}
        </div>
      )}
      {revealAnswer && <p className="model">{answerText(step)}</p>}
      {!locked && (
        <CheckRow
          ready={values.every((value) => value.trim())}
          hint={hint}
          onCheck={check}
          onClear={() => {
            setValues(blanks.map(() => ''));
            setBad(blanks.map(() => false));
            setFocus(0);
          }}
        />
      )}
    </div>
  );
}

function TrueFalse({
  step,
  locked,
  revealAnswer,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'tf' }>;
  locked: boolean;
  revealAnswer: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const [picks, setPicks] = useState<(boolean | null)[]>(() => step.statements.map(() => null));
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  function check() {
    if (picks.some((pick) => pick === null) || locked) return;
    const ok = step.statements.every((item, index) => picks[index] === item.answer);
    if (ok) {
      onPass(tries === 0, detail);
      return;
    }
    const next = tries + 1;
    setTries(next);
    if (next >= 2) onPass(false, detail);
    else setHint('有句子的 True / False 還未對。');
  }

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="tf-list">
        {step.statements.map((item, index) => {
          const wrong = revealAnswer && picks[index] !== item.answer;
          return (
            <div key={item.text} className={`tf ${wrong ? 'wrong' : ''}`}>
              <p>{item.text}</p>
              {revealAnswer && <p className="model">{item.answer ? 'True' : 'False'}。{item.why}</p>}
              <div className="pair">
                {[true, false].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    className={`choice slim ${picks[index] === value ? 'on' : ''}`}
                    disabled={locked}
                    onClick={() => setPicks((prev) => prev.map((pick, pickIndex) => (pickIndex === index ? value : pick)))}
                  >
                    {value ? 'True' : 'False'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {!locked && <CheckRow ready={picks.every((pick) => pick !== null)} hint={hint} onCheck={check} />}
    </div>
  );
}

function WordSearch({
  step,
  locked,
  onPass,
  detail,
}: {
  step: Extract<Step, { type: 'search' }>;
  locked: boolean;
  onPass: (firstTry: boolean, detail: Detail) => void;
  detail: Detail;
}) {
  const [anchor, setAnchor] = useState<{ r: number; c: number } | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [marks, setMarks] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const misses = useRef(0);
  const sent = useRef(false);

  function pick(r: number, c: number) {
    if (locked || sent.current) return;
    if (!anchor) {
      setAnchor({ r, c });
      setNote(null);
      return;
    }
    if (anchor.r === r && anchor.c === c) {
      setAnchor(null);
      return;
    }
    if (anchor.r !== r && anchor.c !== c) {
      setAnchor({ r, c });
      setNote('只可以同一行或同一列。');
      return;
    }
    const dr = Math.sign(r - anchor.r);
    const dc = Math.sign(c - anchor.c);
    let rr = anchor.r;
    let cc = anchor.c;
    let word = '';
    const cells: string[] = [];
    while (true) {
      word += step.grid[rr]?.[cc] ?? '';
      cells.push(`${rr},${cc}`);
      if (rr === r && cc === c) break;
      rr += dr;
      cc += dc;
    }
    const upper = word.toUpperCase();
    const reversed = [...upper].reverse().join('');
    const hit = step.words
      .map((item) => item.toUpperCase())
      .find((item) => (item === upper || item === reversed) && !found.includes(item.toLowerCase()));
    if (!hit) {
      misses.current += 1;
      setAnchor(null);
      setNote('這不是要找的整個字，再試。');
      return;
    }
    const next = [...found, hit.toLowerCase()];
    setFound(next);
    setMarks((prev) => [...prev, ...cells]);
    setAnchor(null);
    setNote(null);
    if (next.length === step.words.length) {
      sent.current = true;
      onPass(misses.current === 0, detail);
    }
  }

  return (
    <div>
      <h2 className="prompt">{step.prompt}</h2>
      <div className="search-grid" style={{ gridTemplateColumns: `repeat(${step.grid[0]?.length ?? 1}, 1fr)` }}>
        {step.grid.map((row, r) =>
          [...row].map((letter, c) => {
            const key = `${r},${c}`;
            const on = marks.includes(key) || (anchor?.r === r && anchor?.c === c);
            return (
              <button key={key} type="button" className={`cell ${marks.includes(key) ? 'found' : on ? 'on' : ''}`} disabled={locked} onClick={() => pick(r, c)}>
                {letter}
              </button>
            );
          }),
        )}
      </div>
      <ul className="word-bank">
        {step.words.map((word) => (
          <li key={word} className={found.includes(word) ? 'found' : ''}>
            {word}
          </li>
        ))}
      </ul>
      {note && <p className="hint">{note}</p>}
    </div>
  );
}

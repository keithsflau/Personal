import type { Unit } from '../lib/types';

export const units: Unit[] = [
  {
    id: 'u1',
    no: 1,
    title: 'Our leisure time',
    titleZh: '我們的休閒時間',
    blurb: '活動詞彙、次數、頻率副詞同棒形圖。',
    tone: 'orange',
    skills: ['do / go / play / watch', 'How often…?', 'always → never', 'bar charts'],
  },
  {
    id: 'u2',
    no: 2,
    title: 'We are different!',
    titleZh: '我們不一樣',
    blurb: '友善與不友善、the same / different、日記。',
    tone: 'teal',
    skills: ['friendly actions', 'the same / different', 'should / should not', 'journal entries'],
  },
  {
    id: 'u3',
    no: 3,
    title: 'Amazing friendships',
    titleZh: '奇妙的友情',
    blurb: '形容人、比較級、最高級、雜誌文章。',
    tone: 'violet',
    skills: ['adjectives', '-er than', 'the -est', 'magazine articles'],
  },
  {
    id: 'u4',
    no: 4,
    title: 'We love reading',
    titleZh: '我們愛閱讀',
    blurb: '故事種類、more / the most、書評。',
    tone: 'rose',
    skills: ['types of stories', 'more … than', 'the most …', 'book reports'],
  },
];

export const checklist: { unit: string; tone: Unit['tone']; items: { id: string; text: string }[] }[] = [
  {
    unit: 'Unit 1 休閒時間',
    tone: 'orange',
    items: [
      { id: 'c1', text: '我認得休閒活動，也知道用 do、go、play 還是 watch。' },
      { id: 'c2', text: '我能用 How often 問次數，也會用 once、twice、three times。' },
      { id: 'c3', text: '我能把 always、often、sometimes、seldom、never 放在動詞前面。' },
      { id: 'c4', text: '我看得懂棒形圖的標題、x 軸、y 軸和長條。' },
    ],
  },
  {
    unit: 'Unit 2 我們不一樣',
    tone: 'teal',
    items: [
      { id: 'c5', text: '我分得出友善和不友善的行為。' },
      { id: 'c6', text: 'the same 後面用單數，different 後面用複數。' },
      { id: 'c7', text: '我會用 should / should not … each other。' },
      { id: 'c8', text: '我知道日記有日期、開頭、細節和結尾，並用 simple past。' },
    ],
  },
  {
    unit: 'Unit 3 友情',
    tone: 'violet',
    items: [
      { id: 'c9', text: '我能用形容詞描述人。' },
      { id: 'c10', text: '比較兩個人或東西時，我會用 -er than 或 more … than。' },
      { id: 'c11', text: '三個或以上時，我會用 the -est 或 the most。' },
      { id: 'c12', text: '我知道雜誌文章有標題、主題句和圖片說明。' },
    ],
  },
  {
    unit: 'Unit 4 閱讀',
    tone: 'rose',
    items: [
      { id: 'c13', text: '我認得 adventure、detective、fairy tale、ghost、love 和 true story。' },
      { id: 'c14', text: '長的形容詞我會用 more … than 和 the most …。' },
      { id: 'c15', text: '我分得出書評裡的 summary 和 opinion。' },
      { id: 'c16', text: '我知道 -ing 形容詞是在描述一種感覺。' },
    ],
  },
  {
    unit: '小探險家',
    tone: 'gold',
    items: [
      { id: 'c17', text: '不同地方的禮儀可以不一樣。出發前可以先了解。' },
      { id: 'c18', text: '閱讀讓人認識更多事情。世界各地仍有人未能閱讀。' },
    ],
  },
];

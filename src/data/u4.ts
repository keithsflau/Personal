import type { Activity } from '../lib/types';
import { blank, build, cloze, info, match, mcq, sort, tf } from './helpers';

export const unit4: Activity[] = [
  {
    id: 'u4-types',
    unitId: 'u4',
    title: '故事種類',
    subtitle: '六種 story',
    minutes: 5,
    steps: [
      info(
        '六種故事',
        'an adventure story：去遠的地方、有旅程和危險。\na detective story：找線索、破案。\na fairy tale：仙女、魔法、想象出來的王國。\na ghost story：鬼或空屋裡的怪聲，令人害怕。\na love story：喜歡、在乎另一個人。\na true story：真的發生過。\n\n形容故事：boring、exciting、frightening、interesting、popular、touching。\n也可以用 disappointing、dramatic、enjoyable、imaginative。',
      ),
      match(
        '讀一句簡介，配故事種類。',
        [
          { left: 'Two children follow a map and find a cave.', right: 'an adventure story' },
          { left: 'A detective looks for clues at school.', right: 'a detective story' },
          { left: 'A tiny fairy helps a lost star.', right: 'a fairy tale' },
          { left: 'A family hears a voice in an empty room.', right: 'a ghost story' },
          { left: 'Two friends learn to say "I like you".', right: 'a love story' },
          { left: 'A book about the real life of a brave nurse.', right: 'a true story' },
        ],
        '看關鍵字：map 和 cave 是冒險，clues 是偵探，fairy 是童話，voice in an empty room 是鬼故事，I like you 是愛情，real life 是真實故事。',
      ),
      mcq(
        'A story about a real nurse who helped sick people is ____.',
        ['a fairy tale', 'a ghost story', 'a true story', 'a detective story'],
        2,
        'real life 表示真的發生過，是 a true story。',
        { standalone: true },
      ),
      mcq(
        'Which adjective says a story makes you feel scared?',
        ['touching', 'frightening', 'popular', 'boring'],
        1,
        'frightening 是令人害怕。touching 是令人感動。boring 是沉悶。popular 是很多人喜歡。',
        { standalone: true },
      ),
    ],
  },
  {
    id: 'u4-more',
    unitId: 'u4',
    title: 'more … than',
    subtitle: '較長的形容詞',
    minutes: 5,
    steps: [
      info(
        '三個或更多音節，用 more',
        'exciting、interesting、frightening、beautiful、popular、touching、boring、imaginative 這些較長的形容詞，不加 -er。\n\nmore exciting than\nmore beautiful than\n\nI think ghost stories are more frightening than true stories.\n\n短的形容詞仍然用 -er：taller than。不要兩種同時用。',
        'Detective stories are more exciting than fairy tales.',
      ),
      mcq(
        'Which sentence is correct?',
        [
          'This story is excitinger than that one.',
          'This story is more exciting than that one.',
          'This story is more excitinger than that one.',
          'This story is the more exciting than that one.',
        ],
        1,
        'exciting 用 more exciting than。不要加 -er，比較兩個時也不要加 the。',
        { standalone: true },
      ),
      cloze(
        '用 frightening 比較。空格要包含 more 和 than。',
        ['I think ghost stories are ', blank('more frightening than'), ' true stories.'],
        'frightening 較長，所以 more frightening than。',
        { hint: '中間是形容詞，前後是 more 和 than。' },
      ),
      cloze(
        '用 boring 比較。Sam 覺得 true stories 比較沉悶。',
        ['Sam thinks true stories are ', blank('more boring than'), ' ghost stories.'],
        'more boring than。boring 也不加 -er。',
      ),
      build(
        '用 exciting，說偵探故事比冒險故事更刺激。',
        ['Detective stories', 'are', 'more', 'most', 'exciting', 'than', 'adventure stories', 'the'],
        ['Detective stories', 'are', 'more', 'exciting', 'than', 'adventure stories'],
        '比較兩個用 more … than，不是 the most。the most 要留到三個或以上。',
      ),
    ],
  },
  {
    id: 'u4-most',
    unitId: 'u4',
    title: 'the most …',
    subtitle: '三本或以上',
    minutes: 4,
    steps: [
      info(
        '記得加 the',
        '三本或更多書之中「最」怎樣，用 the most + 長形容詞。\nThe Night Bus is the most frightening ghost story I know.\nThe Paper Boat is the most exciting fairy tale I know.\n\nThis is the most touching story. ✓\nThis is most touching story. ✗\nThis is the touchingest story. ✗',
      ),
      cloze(
        '用 frightening。記得 the most。',
        ['The Night Bus is ', blank('the most frightening'), ' ghost story on my shelf.'],
        '很多鬼故事之中它最可怕，用 the most frightening。the 不能省。',
      ),
      cloze(
        '用 exciting。',
        ['The Paper Boat is ', blank('the most exciting'), ' fairy tale I know.'],
        'the most exciting。這是最高級，不是 more exciting than。',
      ),
      mcq(
        'Which sentence is correct?',
        [
          'This is most touching story.',
          'This is the most touching story.',
          'This is the touchingest story.',
          'This is more touching story of all.',
        ],
        1,
        'the most touching。touching 不加 -est。of all 表示最高級時，不要只用 more。',
        { standalone: true },
      ),
      build(
        'The Paper Boat 是你知道最有想象力的童話。用 imaginative。',
        ['The Paper Boat', 'is', 'the most', 'more', 'imaginative', 'fairy tale', 'than', 'I know'],
        ['The Paper Boat', 'is', 'the most', 'imaginative', 'fairy tale', 'I know'],
        'the most imaginative。imaginative 是長形容詞，不能寫 imaginativest。',
      ),
    ],
  },
  {
    id: 'u4-report',
    unitId: 'u4',
    title: '書評',
    subtitle: 'summary 和 opinion',
    minutes: 6,
    steps: [
      info(
        'Book report 有兩塊',
        'summary 只講故事發生了什麼：誰、去了哪裡、最後怎樣。用簡單的現在式來概括故事。\nopinion 講你的感覺：I like this book because … It is the most exciting … My favourite character is …\n\n也要寫書名、作者和故事種類。',
        'The Paper Boat by Mira Chen is a fairy tale.',
      ),
      sort(
        '哪些是 summary，哪些是 opinion？故事是 The Paper Boat：Lily 摺了一艘紙船，紙船駛到天空市集，最後回家。',
        ['summary', 'opinion'],
        [
          { text: 'A girl named Lily folds a paper boat.', bucket: 0 },
          { text: 'The boat sails to a sky market.', bucket: 0 },
          { text: 'In the end, the boat gets home.', bucket: 0 },
          { text: 'I like this book because it is imaginative.', bucket: 1 },
          { text: 'It is the most exciting fairy tale I know.', bucket: 1 },
          { text: 'My favourite character is the star bird.', bucket: 1 },
        ],
        'summary 只敘述情節。有 I like、the most、my favourite 的句子是 opinion。',
      ),
      cloze(
        'The Paper Boat 的作者是 Mira Chen，種類是童話，主要角色有 Lily、紙船和 star bird。',
        [
          blank('Mira Chen'),
          ' wrote The Paper Boat. It is ',
          blank('a fairy tale'),
          '. There are ',
          blank('three', ['3']),
          ' main characters.',
        ],
        '作者 Mira Chen。a fairy tale。Lily、the paper boat 和 the star bird 是三個角色。',
        { bank: ['Mira Chen', 'a fairy tale', 'three', 'Sam', 'a true story', 'five'] },
      ),
      mcq(
        'The writer says, "I like this book because it is the most exciting fairy tale I know." Does the writer like the book?',
        [
          'No. The story is frightening.',
          'Yes. The writer says it is the most exciting fairy tale.',
          'No. There is no opinion.',
          'We cannot know.',
        ],
        1,
        'I like this book because … 就是意見。形容故事的字是 exciting。',
        { standalone: true },
      ),
    ],
  },
  {
    id: 'u4-read',
    unitId: 'u4',
    title: '閱讀：書本論壇',
    subtitle: '-ing 形容詞和意見',
    minutes: 6,
    passage: {
      kicker: 'Book Bugs',
      title: 'Your favourite storybook',
      paragraphs: [
        'Amy: My favourite book is a fairy tale called The Paper Boat. It is imaginative. A girl folds a boat and it sails to a sky market. The most exciting part is when the boat meets a storm of stars. Exciting things happen, but the ending is happy.',
        'Leo: I like true stories. The most touching true story I know is about a nurse. She cleaned dirty hospitals and helped sick people. I also enjoy adventure stories.',
        'Sam: I think fairy tales are boring. Ghost stories are more frightening than fairy tales. Detective stories are more exciting than adventure stories. My favourite detective uses a red notebook.',
      ],
    },
    steps: [
      info(
        '-ing 形容詞',
        'exciting、interesting、frightening、boring、touching 這些 -ing 字可以形容一本書帶給你的感覺。\nexciting story = 這本書令你覺得刺激。\n不要把它們看成只是動詞。an exciting story 裡的 exciting 是形容詞。',
      ),
      tf(
        'True or false?',
        [
          { text: 'The Paper Boat is a true story.', answer: false, why: 'Amy 說它是 a fairy tale。' },
          { text: 'Leo admires a nurse in a true story.', answer: true, why: '他說最 touching 的 true story 是一位護士。' },
          { text: 'Sam thinks fairy tales are more exciting than detective stories.', answer: false, why: 'Sam 覺得 fairy tales boring。他說偵探故事比冒險故事 more exciting。' },
          { text: 'Sam enjoys detective stories.', answer: true, why: '他有 favourite detective，也覺得偵探故事更 exciting。' },
        ],
        '意見句要看是誰說的。Amy 喜歡童話，Sam 覺得童話 boring。',
      ),
      mcq(
        'Which word in Amy\'s post is an -ing adjective?',
        ['imaginative', 'exciting', 'favourite', 'market'],
        1,
        'exciting 是 -ing 形容詞，描述故事帶來的感覺。imaginative 是形容詞，但不是 -ing。',
      ),
      mcq(
        'Who would enjoy a ghost story most?',
        ['Amy', 'Leo', 'Sam', 'the nurse'],
        2,
        'Sam 說 ghost stories are more frightening than fairy tales，而且他覺得童話 boring。Amy 喜歡童話，Leo 喜歡 true stories。',
      ),
      mcq(
        'Which adjective is positive?',
        ['boring', 'disappointing', 'exciting', 'frightening'],
        2,
        'exciting 是正面的。boring 和 disappointing 是負面。frightening 多是負面或中性，不一定表示喜歡。',
        { standalone: true },
      ),
    ],
  },
  {
    id: 'u4-facts',
    unitId: 'u4',
    title: '關於書的事實',
    subtitle: '閱讀為什麼重要',
    minutes: 4,
    steps: [
      info(
        '三則事實',
        '世界上大約百分之十四、15 歲或以上的人不會閱讀或書寫。\n現存很早的印刷書《金剛經》抄本，於 868 年在中國印刷，現藏於英國圖書館。\n1994 年，Bill Gates 買下當時很貴的一本書 Codex Leicester，那是達文西的科學手稿。是買下，不是賣出。\n\n公共領域裡有一句老話：Reading is to the mind what exercise is to the body. —— Joseph Addison',
      ),
      tf(
        'True or false?',
        [
          {
            text: 'About 14 per cent of people aged 15 or above in the world cannot read or write.',
            answer: true,
            why: '大約每七個人就有一個。',
          },
          {
            text: 'The Diamond Sutra was printed in China in 868.',
            answer: true,
            why: '868 年，距今超過一千年。',
          },
          {
            text: 'Bill Gates sold the most expensive book in the world.',
            answer: false,
            why: '他是在 1994 年買下 Codex Leicester，不是賣出。',
          },
          {
            text: 'Reading is only useful for school tests.',
            answer: false,
            why: '閱讀讓人認識世界，不只為了測驗。',
          },
        ],
        '數字和年份可以直接核對。Gates 那一句把 bought 說成 sold，所以是 false。',
      ),
      mcq(
        'When was the Diamond Sutra printed?',
        ['688', '868', '1994', '2010'],
        1,
        '868 年在中國印刷。1994 是 Bill Gates 買書的年份。',
        { standalone: true },
      ),
      mcq(
        'Joseph Addison said reading is to the mind what ____ is to the body.',
        ['sleep', 'exercise', 'money', 'music'],
        1,
        'Reading is to the mind what exercise is to the body. 閱讀之於頭腦，如同運動之於身體。',
        { standalone: true },
      ),
    ],
  },
  {
    id: 'u4-sound',
    unitId: 'u4',
    title: '讀音 br / fr / gr',
    subtitle: 'brave、friend、green',
    minutes: 4,
    steps: [
      info(
        '三個開頭',
        'br：brave、brown、brought、bring\nfr：friends、frog、fresh、from\ngr：green、great、greedy\n\n讀的時候兩個子音要連在一起，不要在中間加一個元音。',
      ),
      cloze(
        '填進 br、fr 或 gr 開頭的字。',
        [
          blank('Frank'),
          ' had a ',
          blank('brown'),
          ' and ',
          blank('green'),
          ' pencil case. He ',
          blank('brought'),
          ' it to his ',
          blank('friends'),
          '. They said it looked ',
          blank('great'),
          '!',
        ],
        'Frank、brown、brought 是 br。green、great 是 gr。friends 是 fr。',
        {
          bank: ['Frank', 'brown', 'green', 'brought', 'friends', 'great', 'frog', 'from'],
          hint: '人名用 Frank。鉛筆盒是棕色和綠色。',
        },
      ),
      mcq(
        'Which word starts with br?',
        ['frog', 'green', 'brave', 'great'],
        2,
        'brave 是 br。frog 是 fr。green 和 great 是 gr。',
        { standalone: true },
      ),
      mcq(
        'Which word starts with gr?',
        ['brown', 'friend', 'greedy', 'fresh'],
        2,
        'greedy 是 gr。brown 是 br。friend 和 fresh 是 fr。',
        { standalone: true },
      ),
    ],
  },
];

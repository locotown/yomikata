import type { CounterPattern } from '../core/types';

/**
 * 数字+助数詞の読み方マッピング
 * 日本語TTSが誤読しやすいパターンを明示的なひらがなに変換
 *
 * 音便（おんびん）のルール：
 * - 促音便: 1→いっ, 6→ろっ, 8→はっ, 10→じゅっ（特定の助数詞で発生）
 * - 半濁音化: ほ→ぽ, ひ→ぴ, ふ→ぷ（促音便の後に発生）
 */
export const COUNTER_PATTERNS: CounterPattern[] = [
  // 歳（年齢）- 読み聞かせで最も頻出
  {
    counter: '歳',
    readings: {
      '1': 'いっさい',
      '2': 'にさい',
      '3': 'さんさい',
      '4': 'よんさい',
      '5': 'ごさい',
      '6': 'ろくさい',
      '7': 'ななさい',
      '8': 'はっさい',
      '9': 'きゅうさい',
      '10': 'じゅっさい',
      '11': 'じゅういっさい',
      '12': 'じゅうにさい',
    },
    defaultSuffix: 'さい',
  },
  // 個（個数）
  {
    counter: '個',
    readings: {
      '1': 'いっこ',
      '2': 'にこ',
      '3': 'さんこ',
      '4': 'よんこ',
      '5': 'ごこ',
      '6': 'ろっこ',
      '7': 'ななこ',
      '8': 'はっこ',
      '9': 'きゅうこ',
      '10': 'じゅっこ',
    },
    defaultSuffix: 'こ',
  },
  // 匹（動物）
  {
    counter: '匹',
    readings: {
      '1': 'いっぴき',
      '2': 'にひき',
      '3': 'さんびき',
      '4': 'よんひき',
      '5': 'ごひき',
      '6': 'ろっぴき',
      '7': 'ななひき',
      '8': 'はっぴき',
      '9': 'きゅうひき',
      '10': 'じゅっぴき',
    },
    defaultSuffix: 'ひき',
  },
  // 人（人数）- 1人と2人は特殊読み
  {
    counter: '人',
    readings: {
      '1': 'ひとり',
      '2': 'ふたり',
      '3': 'さんにん',
      '4': 'よにん',
      '5': 'ごにん',
      '6': 'ろくにん',
      '7': 'ななにん',
      '8': 'はちにん',
      '9': 'きゅうにん',
      '10': 'じゅうにん',
    },
    defaultSuffix: 'にん',
  },
  // 本（細長いもの）
  {
    counter: '本',
    readings: {
      '1': 'いっぽん',
      '2': 'にほん',
      '3': 'さんぼん',
      '4': 'よんほん',
      '5': 'ごほん',
      '6': 'ろっぽん',
      '7': 'ななほん',
      '8': 'はっぽん',
      '9': 'きゅうほん',
      '10': 'じゅっぽん',
    },
    defaultSuffix: 'ほん',
  },
  // 枚（薄いもの）
  {
    counter: '枚',
    readings: {
      '1': 'いちまい',
      '2': 'にまい',
      '3': 'さんまい',
      '4': 'よんまい',
      '5': 'ごまい',
      '6': 'ろくまい',
      '7': 'ななまい',
      '8': 'はちまい',
      '9': 'きゅうまい',
      '10': 'じゅうまい',
    },
    defaultSuffix: 'まい',
  },
  // 冊（本）
  {
    counter: '冊',
    readings: {
      '1': 'いっさつ',
      '2': 'にさつ',
      '3': 'さんさつ',
      '4': 'よんさつ',
      '5': 'ごさつ',
      '6': 'ろくさつ',
      '7': 'ななさつ',
      '8': 'はっさつ',
      '9': 'きゅうさつ',
      '10': 'じゅっさつ',
    },
    defaultSuffix: 'さつ',
  },
  // 回（回数）
  {
    counter: '回',
    readings: {
      '1': 'いっかい',
      '2': 'にかい',
      '3': 'さんかい',
      '4': 'よんかい',
      '5': 'ごかい',
      '6': 'ろっかい',
      '7': 'ななかい',
      '8': 'はっかい',
      '9': 'きゅうかい',
      '10': 'じゅっかい',
    },
    defaultSuffix: 'かい',
  },
  // 杯（飲み物・ご飯）
  {
    counter: '杯',
    readings: {
      '1': 'いっぱい',
      '2': 'にはい',
      '3': 'さんばい',
      '4': 'よんはい',
      '5': 'ごはい',
      '6': 'ろっぱい',
      '7': 'ななはい',
      '8': 'はっぱい',
      '9': 'きゅうはい',
      '10': 'じゅっぱい',
    },
    defaultSuffix: 'はい',
  },
  // 台（車・機械）
  {
    counter: '台',
    readings: {
      '1': 'いちだい',
      '2': 'にだい',
      '3': 'さんだい',
      '4': 'よんだい',
      '5': 'ごだい',
      '6': 'ろくだい',
      '7': 'ななだい',
      '8': 'はちだい',
      '9': 'きゅうだい',
      '10': 'じゅうだい',
    },
    defaultSuffix: 'だい',
  },
  // 軒（家）
  {
    counter: '軒',
    readings: {
      '1': 'いっけん',
      '2': 'にけん',
      '3': 'さんげん',
      '4': 'よんけん',
      '5': 'ごけん',
      '6': 'ろっけん',
      '7': 'ななけん',
      '8': 'はっけん',
      '9': 'きゅうけん',
      '10': 'じゅっけん',
    },
    defaultSuffix: 'けん',
  },
  // 頭（大型動物）
  {
    counter: '頭',
    readings: {
      '1': 'いっとう',
      '2': 'にとう',
      '3': 'さんとう',
      '4': 'よんとう',
      '5': 'ごとう',
      '6': 'ろくとう',
      '7': 'ななとう',
      '8': 'はっとう',
      '9': 'きゅうとう',
      '10': 'じゅっとう',
    },
    defaultSuffix: 'とう',
  },
  // 羽（鳥）
  {
    counter: '羽',
    readings: {
      '1': 'いちわ',
      '2': 'にわ',
      '3': 'さんわ',
      '4': 'よんわ',
      '5': 'ごわ',
      '6': 'ろくわ',
      '7': 'ななわ',
      '8': 'はちわ',
      '9': 'きゅうわ',
      '10': 'じゅうわ',
    },
    defaultSuffix: 'わ',
  },
  // 階（建物）
  {
    counter: '階',
    readings: {
      '1': 'いっかい',
      '2': 'にかい',
      '3': 'さんがい',
      '4': 'よんかい',
      '5': 'ごかい',
      '6': 'ろっかい',
      '7': 'ななかい',
      '8': 'はっかい',
      '9': 'きゅうかい',
      '10': 'じゅっかい',
    },
    defaultSuffix: 'かい',
  },
  // 足（靴・靴下）
  {
    counter: '足',
    readings: {
      '1': 'いっそく',
      '2': 'にそく',
      '3': 'さんぞく',
      '4': 'よんそく',
      '5': 'ごそく',
      '6': 'ろくそく',
      '7': 'ななそく',
      '8': 'はっそく',
      '9': 'きゅうそく',
      '10': 'じゅっそく',
    },
    defaultSuffix: 'そく',
  },
  // 着（衣類）
  {
    counter: '着',
    readings: {
      '1': 'いっちゃく',
      '2': 'にちゃく',
      '3': 'さんちゃく',
      '4': 'よんちゃく',
      '5': 'ごちゃく',
      '6': 'ろくちゃく',
      '7': 'ななちゃく',
      '8': 'はっちゃく',
      '9': 'きゅうちゃく',
      '10': 'じゅっちゃく',
    },
    defaultSuffix: 'ちゃく',
  },
  // 組（セット）- 1組、2組は特殊読み
  {
    counter: '組',
    readings: {
      '1': 'ひとくみ',
      '2': 'ふたくみ',
      '3': 'さんくみ',
      '4': 'よんくみ',
      '5': 'ごくみ',
      '6': 'ろくくみ',
      '7': 'ななくみ',
      '8': 'はちくみ',
      '9': 'きゅうくみ',
      '10': 'じゅうくみ',
    },
    defaultSuffix: 'くみ',
  },
  // 箱（容器）- 1箱、2箱は特殊読み
  {
    counter: '箱',
    readings: {
      '1': 'ひとはこ',
      '2': 'ふたはこ',
      '3': 'さんばこ',
      '4': 'よんはこ',
      '5': 'ごはこ',
      '6': 'ろっぱこ',
      '7': 'ななはこ',
      '8': 'はっぱこ',
      '9': 'きゅうはこ',
      '10': 'じゅっぱこ',
    },
    defaultSuffix: 'はこ',
  },
  // 番（順序）
  {
    counter: '番',
    readings: {
      '1': 'いちばん',
      '2': 'にばん',
      '3': 'さんばん',
      '4': 'よんばん',
      '5': 'ごばん',
      '6': 'ろくばん',
      '7': 'ななばん',
      '8': 'はちばん',
      '9': 'きゅうばん',
      '10': 'じゅうばん',
    },
    defaultSuffix: 'ばん',
  },
];

/**
 * 基本的な数字の読み方（10以上の合成用）
 */
const NUMBER_READINGS: Record<string, string> = {
  '0': 'れい',
  '1': 'いち',
  '2': 'に',
  '3': 'さん',
  '4': 'よん',
  '5': 'ご',
  '6': 'ろく',
  '7': 'なな',
  '8': 'はち',
  '9': 'きゅう',
};

/**
 * 漢数字からアラビア数字へのマッピング
 */
const KANJI_TO_ARABIC: Record<string, string> = {
  '一': '1',
  '二': '2',
  '三': '3',
  '四': '4',
  '五': '5',
  '六': '6',
  '七': '7',
  '八': '8',
  '九': '9',
  '十': '10',
};

/**
 * 漢数字を数値に変換（1〜99対応）
 * 例: 九 → 9, 十 → 10, 十一 → 11, 二十三 → 23
 */
function parseKanjiNumber(kanjiStr: string): number | null {
  // 一桁の漢数字
  if (KANJI_TO_ARABIC[kanjiStr]) {
    return Number.parseInt(KANJI_TO_ARABIC[kanjiStr], 10);
  }

  // 十だけ
  if (kanjiStr === '十') {
    return 10;
  }

  // 十X（11〜19）
  const tenPlusMatch = kanjiStr.match(/^十([一二三四五六七八九])$/);
  if (tenPlusMatch) {
    const ones = Number.parseInt(KANJI_TO_ARABIC[tenPlusMatch[1]], 10);
    return 10 + ones;
  }

  // X十（20, 30, ... 90）
  const timesTenMatch = kanjiStr.match(/^([二三四五六七八九])十$/);
  if (timesTenMatch) {
    const tens = Number.parseInt(KANJI_TO_ARABIC[timesTenMatch[1]], 10);
    return tens * 10;
  }

  // X十Y（21〜99）
  const fullMatch = kanjiStr.match(/^([二三四五六七八九])十([一二三四五六七八九])$/);
  if (fullMatch) {
    const tens = Number.parseInt(KANJI_TO_ARABIC[fullMatch[1]], 10);
    const ones = Number.parseInt(KANJI_TO_ARABIC[fullMatch[2]], 10);
    return tens * 10 + ones;
  }

  return null;
}

/**
 * 数字+助数詞パターンをひらがな読みに変換
 * TTSが誤読しやすい「9歳」→「くさい」などの問題を解決
 * アラビア数字（9歳、１０歳）と漢数字（九歳、十歳）の両方に対応
 */
export function convertCounters(text: string): string {
  let result = text;

  for (const pattern of COUNTER_PATTERNS) {
    // 1〜99のアラビア数字+助数詞パターンにマッチ
    const arabicRegex = new RegExp(`(\\d{1,2})${pattern.counter}`, 'g');

    result = result.replace(arabicRegex, (match, numStr) => {
      return convertNumberWithCounter(numStr, pattern) ?? match;
    });

    // 漢数字+助数詞パターンにマッチ（一〜九、十、十一〜十九、二十〜九十九）
    const kanjiRegex = new RegExp(
      `([一二三四五六七八九十]十?[一二三四五六七八九]?|十[一二三四五六七八九]?)${pattern.counter}`,
      'g',
    );

    result = result.replace(kanjiRegex, (match, kanjiNum) => {
      const num = parseKanjiNumber(kanjiNum);
      if (num === null) return match;
      return convertNumberWithCounter(num.toString(), pattern) ?? match;
    });
  }

  return result;
}

/**
 * 数字と助数詞パターンから読み方を生成
 */
function convertNumberWithCounter(numStr: string, pattern: CounterPattern): string | null {
  // 定義済みの読み方があればそれを使用
  if (pattern.readings[numStr]) {
    return pattern.readings[numStr];
  }

  // 10以上の数字は合成（例：15歳 → じゅうごさい）
  const num = Number.parseInt(numStr, 10);
  if (num > 10 && num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    // 10の位の読み
    let reading = tens === 1 ? 'じゅう' : `${NUMBER_READINGS[tens.toString()]}じゅう`;

    // 1の位がある場合は追加
    if (ones > 0) {
      // 1の位+助数詞の定義済み読み方を使用（音便対応のため）
      const onesReading = pattern.readings[ones.toString()];
      if (onesReading) {
        reading += onesReading;
        return reading;
      }
      reading += NUMBER_READINGS[ones.toString()];
    }

    return reading + pattern.defaultSuffix;
  }

  return null;
}

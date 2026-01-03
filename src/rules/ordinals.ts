/**
 * 序数詞の変換
 *
 * 第X回、X番目、X位などの序数表現を正しいひらがな読みに変換
 */

/**
 * 回の読み方（促音便あり）
 */
const KAI_READINGS: Record<number, string> = {
  1: 'いっかい',
  2: 'にかい',
  3: 'さんかい',
  4: 'よんかい',
  5: 'ごかい',
  6: 'ろっかい',
  7: 'ななかい',
  8: 'はっかい',
  9: 'きゅうかい',
  10: 'じゅっかい',
};

/**
 * 番の読み方
 */
const BAN_READINGS: Record<number, string> = {
  1: 'いちばん',
  2: 'にばん',
  3: 'さんばん',
  4: 'よんばん',
  5: 'ごばん',
  6: 'ろくばん',
  7: 'ななばん',
  8: 'はちばん',
  9: 'きゅうばん',
  10: 'じゅうばん',
};

/**
 * 章の読み方（促音便あり）
 */
const SHOU_READINGS: Record<number, string> = {
  1: 'いっしょう',
  2: 'にしょう',
  3: 'さんしょう',
  4: 'よんしょう',
  5: 'ごしょう',
  6: 'ろくしょう',
  7: 'ななしょう',
  8: 'はっしょう',
  9: 'きゅうしょう',
  10: 'じゅっしょう',
};

/**
 * 基本的な数字の読み方
 */
const NUMBER_READINGS: Record<number, string> = {
  1: 'いち',
  2: 'に',
  3: 'さん',
  4: 'よん',
  5: 'ご',
  6: 'ろく',
  7: 'なな',
  8: 'はち',
  9: 'きゅう',
  10: 'じゅう',
};

/**
 * 10以上の数字の読み方を生成
 */
function getNumberReading(num: number): string {
  if (num <= 10) {
    return NUMBER_READINGS[num] || String(num);
  }

  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    let reading = tens === 1 ? 'じゅう' : `${NUMBER_READINGS[tens]}じゅう`;
    if (ones > 0) {
      reading += NUMBER_READINGS[ones];
    }
    return reading;
  }

  return String(num);
}

/**
 * 序数詞を変換する
 *
 * @param text - 変換元のテキスト
 * @returns 変換後のテキスト
 */
export function convertOrdinals(text: string): string {
  let result = text;

  // 第X回
  result = result.replace(/第(\d{1,2})回/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    const reading = KAI_READINGS[num];
    if (reading) {
      return `だい${reading}`;
    }
    // 11以上は合成
    return `だい${getNumberReading(num)}かい`;
  });

  // 第X話
  result = result.replace(/第(\d{1,2})話/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    return `だい${getNumberReading(num)}わ`;
  });

  // 第X章
  result = result.replace(/第(\d{1,2})章/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    const reading = SHOU_READINGS[num];
    if (reading) {
      return `だい${reading}`;
    }
    // 11以上は合成
    return `だい${getNumberReading(num)}しょう`;
  });

  // X番目
  result = result.replace(/(\d{1,2})番目/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    const reading = BAN_READINGS[num];
    if (reading) {
      return `${reading}め`;
    }
    // 11以上は合成
    return `${getNumberReading(num)}ばんめ`;
  });

  // X位
  result = result.replace(/(\d{1,2})位/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    return `${getNumberReading(num)}い`;
  });

  return result;
}

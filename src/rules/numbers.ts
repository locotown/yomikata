/**
 * 大きな数字の読み方変換
 *
 * 100以上の数字を正しいひらがな読みに変換
 */

/**
 * 百の位の読み方（音便変化あり）
 */
const HUNDRED_READINGS: Record<number, string> = {
  1: 'ひゃく',
  2: 'にひゃく',
  3: 'さんびゃく', // 濁音化
  4: 'よんひゃく',
  5: 'ごひゃく',
  6: 'ろっぴゃく', // 促音便+半濁音化
  7: 'ななひゃく',
  8: 'はっぴゃく', // 促音便+半濁音化
  9: 'きゅうひゃく',
};

/**
 * 千の位の読み方（音便変化あり）
 */
const THOUSAND_READINGS: Record<number, string> = {
  1: 'せん',
  2: 'にせん',
  3: 'さんぜん', // 濁音化
  4: 'よんせん',
  5: 'ごせん',
  6: 'ろくせん',
  7: 'ななせん',
  8: 'はっせん', // 促音便
  9: 'きゅうせん',
};

/**
 * 基本的な数字の読み方
 */
const NUMBER_READINGS: Record<number, string> = {
  0: '',
  1: 'いち',
  2: 'に',
  3: 'さん',
  4: 'よん',
  5: 'ご',
  6: 'ろく',
  7: 'なな',
  8: 'はち',
  9: 'きゅう',
};

/**
 * 十の位の読み方
 */
function getTensReading(tens: number, ones: number): string {
  if (tens === 0) {
    return ones > 0 ? NUMBER_READINGS[ones] : '';
  }

  let reading = '';
  if (tens === 1) {
    reading = 'じゅう';
  } else {
    reading = NUMBER_READINGS[tens] + 'じゅう';
  }

  if (ones > 0) {
    reading += NUMBER_READINGS[ones];
  }

  return reading;
}

/**
 * 100-999の読み方を生成
 */
function getHundredsReading(num: number): string {
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  const tens = Math.floor(remainder / 10);
  const ones = remainder % 10;

  let reading = HUNDRED_READINGS[hundreds];
  reading += getTensReading(tens, ones);

  return reading;
}

/**
 * 1000-9999の読み方を生成
 */
function getThousandsReading(num: number): string {
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let reading = THOUSAND_READINGS[thousands];

  if (remainder >= 100) {
    reading += getHundredsReading(remainder);
  } else if (remainder > 0) {
    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;
    reading += getTensReading(tens, ones);
  }

  return reading;
}

/**
 * 10000以上の読み方を生成
 */
function getTenThousandsReading(num: number): string {
  const tenThousands = Math.floor(num / 10000);
  const remainder = num % 10000;

  let reading = '';

  // 万の位の読み方
  if (tenThousands >= 1000) {
    reading += getThousandsReading(tenThousands);
  } else if (tenThousands >= 100) {
    reading += getHundredsReading(tenThousands);
  } else if (tenThousands >= 10) {
    const tens = Math.floor(tenThousands / 10);
    const ones = tenThousands % 10;
    reading += getTensReading(tens, ones);
  } else {
    reading += NUMBER_READINGS[tenThousands];
  }

  reading += 'まん';

  // 残りの部分
  if (remainder >= 1000) {
    reading += getThousandsReading(remainder);
  } else if (remainder >= 100) {
    reading += getHundredsReading(remainder);
  } else if (remainder > 0) {
    const tens = Math.floor(remainder / 10);
    const ones = remainder % 10;
    reading += getTensReading(tens, ones);
  }

  return reading;
}

/**
 * 数字を読み方に変換
 */
function getNumberReading(num: number): string {
  if (num < 100) {
    return String(num); // 99以下はそのまま返す（助数詞変換で処理）
  }

  if (num >= 10000) {
    return getTenThousandsReading(num);
  }

  if (num >= 1000) {
    return getThousandsReading(num);
  }

  return getHundredsReading(num);
}

/**
 * 大きな数字を変換する
 *
 * @param text - 変換元のテキスト
 * @returns 変換後のテキスト
 */
export function convertLargeNumbers(text: string): string {
  // 100以上の数字にマッチ（助数詞の直前ではない単独の数字）
  return text.replace(/\b(\d{3,})\b/g, (_match, numStr) => {
    const num = Number.parseInt(numStr, 10);
    return getNumberReading(num);
  });
}

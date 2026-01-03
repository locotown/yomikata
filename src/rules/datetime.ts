/**
 * 日付・時間表現の変換
 *
 * 日本語TTSが誤読しやすい日付・時刻パターンを正しいひらがな読みに変換
 */

/**
 * 月の読み方（4月、7月、9月は特殊）
 */
const MONTH_READINGS: Record<number, string> = {
  1: 'いちがつ',
  2: 'にがつ',
  3: 'さんがつ',
  4: 'しがつ', // 「よんがつ」ではない
  5: 'ごがつ',
  6: 'ろくがつ',
  7: 'しちがつ', // 「なながつ」ではない
  8: 'はちがつ',
  9: 'くがつ', // 「きゅうがつ」ではない
  10: 'じゅうがつ',
  11: 'じゅういちがつ',
  12: 'じゅうにがつ',
};

/**
 * 日の特殊読み（1日〜10日、14日、20日、24日）
 */
const DAY_READINGS: Record<number, string> = {
  1: 'ついたち',
  2: 'ふつか',
  3: 'みっか',
  4: 'よっか',
  5: 'いつか',
  6: 'むいか',
  7: 'なのか',
  8: 'ようか',
  9: 'ここのか',
  10: 'とおか',
  14: 'じゅうよっか',
  20: 'はつか',
  24: 'にじゅうよっか',
};

/**
 * 時刻の特殊読み（4時、7時、9時）
 */
const HOUR_READINGS: Record<number, string> = {
  4: 'よじ', // 「よんじ」ではない
  7: 'しちじ', // 「ななじ」ではない
  9: 'くじ', // 「きゅうじ」ではない
};

/**
 * 曜日の読み方
 */
const WEEKDAY_READINGS: Record<string, string> = {
  月曜日: 'げつようび',
  火曜日: 'かようび',
  水曜日: 'すいようび',
  木曜日: 'もくようび',
  金曜日: 'きんようび',
  土曜日: 'どようび',
  日曜日: 'にちようび',
};

/**
 * 数字の基本読み（10以上の日付合成用）
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
};

/**
 * 日（にち）の読みを生成
 */
function getDayReading(day: number): string {
  // 特殊読みがあればそれを使用
  if (DAY_READINGS[day]) {
    return DAY_READINGS[day];
  }

  // 11日以降は通常の読み
  if (day >= 11 && day <= 31) {
    const tens = Math.floor(day / 10);
    const ones = day % 10;

    let reading = '';

    // 10の位
    if (tens === 1) {
      reading = 'じゅう';
    } else if (tens === 2) {
      reading = 'にじゅう';
    } else if (tens === 3) {
      reading = 'さんじゅう';
    }

    // 1の位
    if (ones > 0) {
      reading += NUMBER_READINGS[ones];
    }

    return reading + 'にち';
  }

  return `${day}日`;
}

/**
 * 時刻の読みを生成
 */
function getHourReading(hour: number): string {
  // 特殊読みがあればそれを使用
  if (HOUR_READINGS[hour]) {
    return HOUR_READINGS[hour];
  }

  // 通常の読み
  if (hour >= 1 && hour <= 12) {
    if (hour <= 9) {
      return NUMBER_READINGS[hour] + 'じ';
    }
    if (hour === 10) {
      return 'じゅうじ';
    }
    if (hour === 11) {
      return 'じゅういちじ';
    }
    if (hour === 12) {
      return 'じゅうにじ';
    }
  }

  return `${hour}時`;
}

/**
 * 日付・時間表現を変換する
 *
 * @param text - 変換元のテキスト
 * @returns 変換後のテキスト
 */
export function convertDatetime(text: string): string {
  let result = text;

  // Step 1: 曜日を変換（最初に処理して他のパターンと干渉しないようにする）
  for (const [weekday, reading] of Object.entries(WEEKDAY_READINGS)) {
    result = result.replace(new RegExp(weekday, 'g'), reading);
  }

  // Step 2: X月Y日パターンを変換（月日の組み合わせを先に処理）
  result = result.replace(/(\d{1,2})月(\d{1,2})日/g, (_match, monthStr, dayStr) => {
    const month = Number.parseInt(monthStr, 10);
    const day = Number.parseInt(dayStr, 10);

    const monthReading = MONTH_READINGS[month] || `${month}がつ`;
    const dayReading = getDayReading(day);

    return monthReading + dayReading;
  });

  // Step 3: 単独のX月パターンを変換
  result = result.replace(/(\d{1,2})月(?!\d)/g, (_match, monthStr) => {
    const month = Number.parseInt(monthStr, 10);
    return MONTH_READINGS[month] || `${month}がつ`;
  });

  // Step 4: 単独のX日パターンを変換（X月Y日でマッチしなかったもの）
  result = result.replace(/(?<!月)(\d{1,2})日/g, (_match, dayStr) => {
    const day = Number.parseInt(dayStr, 10);
    return getDayReading(day);
  });

  // Step 5: X時パターンを変換
  result = result.replace(/(\d{1,2})時/g, (_match, hourStr) => {
    const hour = Number.parseInt(hourStr, 10);
    return getHourReading(hour);
  });

  return result;
}

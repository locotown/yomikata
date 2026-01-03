/**
 * yomikata - 日本語TTS読み間違い対策ライブラリ
 *
 * Japanese TTS text preprocessing library for correct pronunciation.
 * Gemini TTS などSSML非対応のTTSでも正確な発音を実現します。
 *
 * @example
 * ```typescript
 * import { yomikata, createYomikata } from 'yomikata';
 *
 * // シンプルな使い方
 * const result = yomikata("9歳の男の子が3匹の猫と遊んでいます");
 * // → "きゅうさいの男の子がさんびきの猫と遊んでいます"
 *
 * // カスタム設定
 * const myYomikata = createYomikata({
 *   counters: true,
 *   dictionary: { "豊": "ゆたか" }
 * });
 * const result = myYomikata("豊くんは9歳です");
 * // → "ゆたかくんはきゅうさいです"
 * ```
 */

import { convert, createConverter } from './core/converter';
import type { YomikataConfig } from './core/types';

// 型エクスポート
export type { YomikataConfig } from './core/types';

/**
 * テキストを変換する
 *
 * @param text - 変換元のテキスト
 * @param config - オプション設定
 * @returns 変換後のテキスト
 *
 * @example
 * ```typescript
 * yomikata("9歳の男の子");
 * // → "きゅうさいの男の子"
 * ```
 */
export function yomikata(text: string, config?: YomikataConfig): string {
  return convert(text, config);
}

/**
 * 設定済みの変換関数を作成する
 *
 * @param config - 設定オプション
 * @returns 変換関数
 *
 * @example
 * ```typescript
 * const myYomikata = createYomikata({
 *   dictionary: { "豊": "ゆたか" }
 * });
 * myYomikata("豊くんは9歳です");
 * // → "ゆたかくんはきゅうさいです"
 * ```
 */
export function createYomikata(config?: YomikataConfig): (text: string) => string {
  return createConverter(config);
}

// デフォルトエクスポート
export default yomikata;

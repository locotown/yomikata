/**
 * yomikata - ブラウザ用エントリーポイント
 *
 * ファイルシステムを使用しないブラウザ向けビルド。
 * インライン辞書のみをサポートします。
 */

import { applyDictionary } from './dictionary/custom';
import { applyCommonMisreadings } from './rules/common-misreadings';
import { convertCounters } from './rules/counters';
import { convertDatetime } from './rules/datetime';
import { convertLargeNumbers } from './rules/numbers';
import { convertOrdinals } from './rules/ordinals';

/**
 * ブラウザ向け設定オプション
 * ファイル関連のオプションは除外
 */
export interface YomikataBrowserConfig {
  /**
   * Tier 1: 数字+助数詞の変換を有効化
   * @default true
   */
  counters?: boolean;

  /**
   * Tier 2: 日付・時間表現の変換を有効化
   * @default false
   */
  datetime?: boolean;

  /**
   * Tier 3: 大きな数字（100以上）の変換を有効化
   * @default false
   */
  numbers?: boolean;

  /**
   * Tier 4: 序数詞（第X回、X番目など）の変換を有効化
   * @default false
   */
  ordinals?: boolean;

  /**
   * カスタム辞書（インラインのみ）
   */
  dictionary?: Record<string, string>;
}

/**
 * デフォルト設定
 */
const DEFAULT_CONFIG: Required<YomikataBrowserConfig> = {
  counters: true,
  datetime: false,
  numbers: false,
  ordinals: false,
  dictionary: {},
};

/**
 * テキストを変換する（ブラウザ向け）
 */
function convert(text: string, config?: YomikataBrowserConfig): string {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  let result = text;

  // Step 1: カスタム辞書を適用
  if (mergedConfig.dictionary && Object.keys(mergedConfig.dictionary).length > 0) {
    result = applyDictionary(result, mergedConfig.dictionary);
  }

  // Step 2: よくある誤読を修正
  result = applyCommonMisreadings(result);

  // Step 3: 序数詞変換
  if (mergedConfig.ordinals) {
    result = convertOrdinals(result);
  }

  // Step 4: 数字+助数詞変換
  if (mergedConfig.counters) {
    result = convertCounters(result);
  }

  // Step 5: 日付・時間変換
  if (mergedConfig.datetime) {
    result = convertDatetime(result);
  }

  // Step 6: 大きな数字変換
  if (mergedConfig.numbers) {
    result = convertLargeNumbers(result);
  }

  return result;
}

/**
 * テキストを変換する
 *
 * @param text - 変換元のテキスト
 * @param config - オプション設定
 * @returns 変換後のテキスト
 */
export function yomikata(text: string, config?: YomikataBrowserConfig): string {
  return convert(text, config);
}

/**
 * 設定済みの変換関数を作成する
 *
 * @param config - 設定オプション
 * @returns 変換関数
 */
export function createYomikata(config?: YomikataBrowserConfig): (text: string) => string {
  return (text: string) => convert(text, config);
}

// デフォルトエクスポート
export default yomikata;

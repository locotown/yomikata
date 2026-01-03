import { applyDictionary } from '../dictionary/custom';
import { mergeDictionaries } from '../dictionary/merger';
import { applyCommonMisreadings } from '../rules/common-misreadings';
import { convertCounters } from '../rules/counters';
import { convertDatetime } from '../rules/datetime';
import { convertLargeNumbers } from '../rules/numbers';
import { convertOrdinals } from '../rules/ordinals';
import type { YomikataConfig } from './types';

/**
 * デフォルト設定
 */
const DEFAULT_CONFIG: Required<YomikataConfig> = {
  counters: true,
  datetime: false,
  numbers: false,
  ordinals: false,
  dictionary: {},
  dictionaryFiles: [],
  loadGlobalDictionary: false,
  loadProjectDictionary: false,
  projectDir: process.cwd(),
};

/**
 * 設定をマージしてデフォルト値を適用
 */
function mergeConfig(config?: YomikataConfig): Required<YomikataConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    dictionary: config?.dictionary ?? {},
    dictionaryFiles: config?.dictionaryFiles ?? [],
    projectDir: config?.projectDir ?? process.cwd(),
  };
}

/**
 * 辞書をマージして取得
 */
function getMergedDictionary(config: Required<YomikataConfig>): Record<string, string> {
  // ファイル辞書を使用するかどうか
  const useFileDictionaries =
    config.loadGlobalDictionary ||
    config.loadProjectDictionary ||
    config.dictionaryFiles.length > 0;

  if (!useFileDictionaries) {
    // インライン辞書のみ
    return config.dictionary;
  }

  // ファイル辞書とインライン辞書をマージ
  return mergeDictionaries({
    inline: config.dictionary,
    loadGlobal: config.loadGlobalDictionary,
    loadProject: config.loadProjectDictionary,
    dictionaryFiles: config.dictionaryFiles,
    projectDir: config.projectDir,
  });
}

/**
 * テキストを変換する
 *
 * 変換順序:
 * 1. カスタム辞書（ユーザー定義の置換を優先）
 * 2. よくある誤読の修正
 * 3. 数字+助数詞変換
 * 4. 日付・時間変換（将来実装）
 */
export function convert(text: string, config?: YomikataConfig): string {
  const mergedConfig = mergeConfig(config);
  let result = text;

  // Step 1: カスタム辞書を適用（インライン + ファイル辞書をマージ）
  const dictionary = getMergedDictionary(mergedConfig);
  if (Object.keys(dictionary).length > 0) {
    result = applyDictionary(result, dictionary);
  }

  // Step 2: よくある誤読を修正
  result = applyCommonMisreadings(result);

  // Step 3: 序数詞変換（第X回、X番目など）
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

  // Step 6: 大きな数字変換（100以上）
  if (mergedConfig.numbers) {
    result = convertLargeNumbers(result);
  }

  return result;
}

/**
 * 設定済みの変換関数を作成するファクトリ
 */
export function createConverter(config?: YomikataConfig): (text: string) => string {
  const mergedConfig = mergeConfig(config);
  return (text: string) => convert(text, mergedConfig);
}

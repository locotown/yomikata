/**
 * 辞書マージ機能
 *
 * 複数の辞書をマージし、優先順位に従って統合する
 *
 * 優先順位（高い順）:
 * 1. インライン辞書（config.dictionary）
 * 2. プロジェクト辞書（.yomikata/dictionary.json）
 * 3. グローバル辞書（~/.yomikata/dictionary.json）
 */

import type { DictionaryFile } from './types';
import {
  loadGlobalDictionarySync,
  loadProjectDictionarySync,
  loadDictionaryFileSync,
} from './file-loader';

/**
 * 辞書マージオプション
 */
export interface MergeDictionariesOptions {
  /**
   * インライン辞書（最高優先度）
   */
  inline?: Record<string, string>;

  /**
   * プロジェクト辞書を読み込むか
   * @default false
   */
  loadProject?: boolean;

  /**
   * グローバル辞書を読み込むか
   * @default false
   */
  loadGlobal?: boolean;

  /**
   * 追加の辞書ファイルパス
   */
  dictionaryFiles?: string[];

  /**
   * プロジェクトディレクトリ（プロジェクト辞書の検索に使用）
   */
  projectDir?: string;
}

/**
 * 複数の辞書をマージする
 *
 * 優先順位（高い順）:
 * 1. インライン辞書
 * 2. 追加の辞書ファイル（配列の順序で、後が優先）
 * 3. プロジェクト辞書
 * 4. グローバル辞書
 *
 * @param options - マージオプション
 * @returns マージされた辞書
 */
export function mergeDictionaries(options: MergeDictionariesOptions = {}): Record<string, string> {
  const {
    inline = {},
    loadProject = false,
    loadGlobal = false,
    dictionaryFiles = [],
    projectDir = process.cwd(),
  } = options;

  // 結果の辞書（優先度の低い順に追加）
  let merged: Record<string, string> = {};

  // 4. グローバル辞書（最低優先度）
  if (loadGlobal) {
    const globalDict = loadGlobalDictionarySync();
    merged = { ...merged, ...globalDict.entries };
  }

  // 3. プロジェクト辞書
  if (loadProject) {
    const projectDict = loadProjectDictionarySync(projectDir);
    merged = { ...merged, ...projectDict.entries };
  }

  // 2. 追加の辞書ファイル
  for (const filePath of dictionaryFiles) {
    const fileDict = loadDictionaryFileSync(filePath);
    merged = { ...merged, ...fileDict.entries };
  }

  // 1. インライン辞書（最高優先度）
  merged = { ...merged, ...inline };

  return merged;
}

/**
 * 辞書ファイルの内容をマージする
 *
 * @param dictionaries - 辞書ファイルの配列（後の方が優先度が高い）
 * @returns マージされたエントリ
 */
export function mergeDictionaryFiles(dictionaries: DictionaryFile[]): Record<string, string> {
  let merged: Record<string, string> = {};

  for (const dict of dictionaries) {
    merged = { ...merged, ...dict.entries };
  }

  return merged;
}

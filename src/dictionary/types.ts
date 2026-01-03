/**
 * 辞書ファイル関連の型定義
 */

/**
 * 辞書ファイルのメタデータ
 */
export interface DictionaryMetadata {
  /**
   * 辞書のバージョン
   */
  version?: string;

  /**
   * 最終更新日（ISO 8601形式）
   */
  lastUpdated?: string;

  /**
   * 辞書の説明
   */
  description?: string;
}

/**
 * 辞書ファイルの構造
 *
 * @example
 * ```json
 * {
 *   "entries": {
 *     "豊": "ゆたか",
 *     "花子": "はなこ"
 *   },
 *   "metadata": {
 *     "version": "1.0",
 *     "lastUpdated": "2026-01-03"
 *   }
 * }
 * ```
 */
export interface DictionaryFile {
  /**
   * 辞書エントリ（漢字 → 読み）
   */
  entries: Record<string, string>;

  /**
   * メタデータ（オプション）
   */
  metadata?: DictionaryMetadata;
}

/**
 * 辞書のスコープ
 */
export type DictionaryScope = 'global' | 'project' | 'inline';

/**
 * 辞書エントリ（スコープ情報付き）
 */
export interface DictionaryEntry {
  /**
   * キー（漢字）
   */
  key: string;

  /**
   * 値（読み）
   */
  reading: string;

  /**
   * スコープ
   */
  scope: DictionaryScope;
}

/**
 * グローバル辞書のパス
 */
export const GLOBAL_DICTIONARY_PATH = '~/.yomikata/dictionary.json';

/**
 * プロジェクト辞書のファイル名
 */
export const PROJECT_DICTIONARY_FILENAME = '.yomikata/dictionary.json';

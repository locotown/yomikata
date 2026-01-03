/**
 * yomikata の設定オプション
 */
export interface YomikataConfig {
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
   * Tier 5: カスタム辞書（インライン）
   * キー: 変換元の文字列
   * 値: 変換後の読み仮名
   */
  dictionary?: Record<string, string>;

  /**
   * 辞書ファイルのパス（複数指定可）
   * 後の方が優先度が高い
   */
  dictionaryFiles?: string[];

  /**
   * グローバル辞書（~/.yomikata/dictionary.json）を読み込むか
   * @default false
   */
  loadGlobalDictionary?: boolean;

  /**
   * プロジェクト辞書（.yomikata/dictionary.json）を読み込むか
   * @default false
   */
  loadProjectDictionary?: boolean;

  /**
   * プロジェクトディレクトリ（プロジェクト辞書の検索に使用）
   * @default process.cwd()
   */
  projectDir?: string;
}

/**
 * 変換ルールの型定義
 */
export interface ConversionRule {
  /**
   * ルール名（デバッグ用）
   */
  name: string;

  /**
   * テキストを変換する関数
   */
  convert: (text: string) => string;
}

/**
 * 助数詞パターンの定義
 */
export interface CounterPattern {
  /**
   * 助数詞（例: '歳', '個', '匹'）
   */
  counter: string;

  /**
   * 数字ごとの読み方マッピング
   * キー: 数字の文字列（例: '1', '2', '10'）
   * 値: 読み仮名（例: 'いっさい', 'にさい'）
   */
  readings: Record<string, string>;

  /**
   * デフォルトの接尾辞（未定義の数字用）
   */
  defaultSuffix: string;
}

/**
 * 辞書管理クラス（API経由）
 *
 * Railway上のPostgreSQLに接続されたAPIを通じて辞書を操作
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';

/**
 * 辞書エントリの情報
 */
export interface DictionaryEntry {
  key: string;
  reading: string;
}

/**
 * 設定ファイルの形式
 */
interface Config {
  apiUrl: string;
}

/**
 * デフォルトのAPI URL
 */
const DEFAULT_API_URL = 'https://yomikata-web-production.up.railway.app';

/**
 * 設定ファイルのパス
 */
const CONFIG_PATH = join(homedir(), '.yomikata', 'config.json');

/**
 * 辞書管理クラス（API経由）
 */
export class DictionaryManager {
  private apiUrl: string;

  constructor() {
    this.apiUrl = this.loadConfig().apiUrl;
  }

  /**
   * 設定ファイルを読み込む
   */
  private loadConfig(): Config {
    // 環境変数が設定されていれば優先
    if (process.env.YOMIKATA_API_URL) {
      return { apiUrl: process.env.YOMIKATA_API_URL };
    }

    // 設定ファイルを読み込む
    if (existsSync(CONFIG_PATH)) {
      try {
        const content = readFileSync(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(content);
        if (config.apiUrl) {
          return { apiUrl: config.apiUrl };
        }
      } catch {
        // 設定ファイルの読み込みに失敗した場合はデフォルトを使用
      }
    }

    return { apiUrl: DEFAULT_API_URL };
  }

  /**
   * 設定を保存
   */
  saveConfig(apiUrl: string): void {
    const dir = dirname(CONFIG_PATH);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(CONFIG_PATH, JSON.stringify({ apiUrl }, null, 2), 'utf-8');
    this.apiUrl = apiUrl;
  }

  /**
   * 現在のAPI URLを取得
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * エントリを追加
   */
  async add(key: string, reading: string): Promise<{ success: boolean }> {
    const res = await fetch(`${this.apiUrl}/api/dictionary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, reading }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${res.status}`);
    }

    return { success: true };
  }

  /**
   * エントリを削除
   */
  async remove(key: string): Promise<{ success: boolean; deleted: boolean }> {
    const res = await fetch(`${this.apiUrl}/api/dictionary`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${res.status}`);
    }

    const data = await res.json();
    return { success: true, deleted: data.deleted };
  }

  /**
   * エントリ一覧を取得
   */
  async list(): Promise<DictionaryEntry[]> {
    const res = await fetch(`${this.apiUrl}/api/dictionary`);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${res.status}`);
    }

    const data = await res.json();
    return data.entries;
  }

  /**
   * テキストを変換（プレビュー用）
   */
  async test(text: string): Promise<string> {
    // エントリを取得して変換を適用
    const entries = await this.list();

    let result = text;
    for (const entry of entries) {
      result = result.replace(new RegExp(entry.key, 'g'), entry.reading);
    }

    return result;
  }
}

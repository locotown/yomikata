/**
 * 辞書管理クラス
 *
 * グローバル辞書とプロジェクト辞書のCRUD操作を提供
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import type { DictionaryFile, DictionaryScope } from '../src/dictionary/types';

/**
 * 辞書エントリの情報
 */
export interface DictionaryEntry {
  key: string;
  reading: string;
  scope: DictionaryScope;
  source?: string;
}

/**
 * 辞書管理クラス
 */
export class DictionaryManager {
  private globalPath: string;
  private projectPath: string;

  constructor(projectDir: string = process.cwd()) {
    this.globalPath = join(homedir(), '.yomikata', 'dictionary.json');
    this.projectPath = join(projectDir, '.yomikata', 'dictionary.json');
  }

  /**
   * 辞書ファイルのパスを取得
   */
  getPath(scope: DictionaryScope): string {
    return scope === 'global' ? this.globalPath : this.projectPath;
  }

  /**
   * 辞書ファイルを読み込む
   */
  private loadDictionary(path: string): DictionaryFile {
    if (!existsSync(path)) {
      return { entries: {}, metadata: {} };
    }

    try {
      const content = readFileSync(path, 'utf-8');
      const parsed = JSON.parse(content);

      // 古い形式（フラット）もサポート
      if (parsed.entries === undefined && typeof parsed === 'object') {
        return { entries: parsed, metadata: {} };
      }

      return {
        entries: parsed.entries || {},
        metadata: parsed.metadata || {},
      };
    } catch {
      return { entries: {}, metadata: {} };
    }
  }

  /**
   * 辞書ファイルを保存
   */
  private saveDictionary(path: string, dict: DictionaryFile): void {
    const dir = dirname(path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // メタデータを更新
    dict.metadata = {
      ...dict.metadata,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    writeFileSync(path, JSON.stringify(dict, null, 2), 'utf-8');
  }

  /**
   * 辞書を初期化
   */
  init(scope: DictionaryScope): { path: string; created: boolean } {
    const path = this.getPath(scope);

    if (existsSync(path)) {
      return { path, created: false };
    }

    const dict: DictionaryFile = {
      entries: {},
      metadata: {
        version: '1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    };

    this.saveDictionary(path, dict);
    return { path, created: true };
  }

  /**
   * エントリを追加
   */
  add(key: string, reading: string, scope: DictionaryScope): { success: boolean; path: string } {
    const path = this.getPath(scope);
    const dict = this.loadDictionary(path);

    dict.entries[key] = reading;
    this.saveDictionary(path, dict);

    return { success: true, path };
  }

  /**
   * エントリを削除
   */
  remove(key: string, scope: DictionaryScope): { success: boolean; existed: boolean; path: string } {
    const path = this.getPath(scope);
    const dict = this.loadDictionary(path);

    const existed = key in dict.entries;
    if (existed) {
      delete dict.entries[key];
      this.saveDictionary(path, dict);
    }

    return { success: true, existed, path };
  }

  /**
   * エントリ一覧を取得
   */
  list(scope?: DictionaryScope): DictionaryEntry[] {
    const entries: DictionaryEntry[] = [];

    if (!scope || scope === 'global') {
      const globalDict = this.loadDictionary(this.globalPath);
      for (const [key, reading] of Object.entries(globalDict.entries)) {
        entries.push({ key, reading, scope: 'global', source: this.globalPath });
      }
    }

    if (!scope || scope === 'project') {
      const projectDict = this.loadDictionary(this.projectPath);
      for (const [key, reading] of Object.entries(projectDict.entries)) {
        entries.push({ key, reading, scope: 'project', source: this.projectPath });
      }
    }

    return entries;
  }

  /**
   * 辞書ファイルをインポート
   */
  import(
    filePath: string,
    scope: DictionaryScope
  ): { success: boolean; imported: number; path: string } {
    if (!existsSync(filePath)) {
      throw new Error(`ファイルが見つかりません: ${filePath}`);
    }

    const content = readFileSync(filePath, 'utf-8');
    let importData: Record<string, string>;

    try {
      const parsed = JSON.parse(content);
      // 新形式と旧形式の両方をサポート
      importData = parsed.entries || parsed;
    } catch {
      throw new Error(`JSONの解析に失敗しました: ${filePath}`);
    }

    const path = this.getPath(scope);
    const dict = this.loadDictionary(path);

    let imported = 0;
    for (const [key, reading] of Object.entries(importData)) {
      if (typeof reading === 'string') {
        dict.entries[key] = reading;
        imported++;
      }
    }

    this.saveDictionary(path, dict);

    return { success: true, imported, path };
  }

  /**
   * 辞書をエクスポート
   */
  export(scope?: DictionaryScope): DictionaryFile {
    const entries: Record<string, string> = {};

    if (!scope || scope === 'global') {
      const globalDict = this.loadDictionary(this.globalPath);
      Object.assign(entries, globalDict.entries);
    }

    if (!scope || scope === 'project') {
      const projectDict = this.loadDictionary(this.projectPath);
      Object.assign(entries, projectDict.entries);
    }

    return {
      entries,
      metadata: {
        exportedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * 辞書が存在するかチェック
   */
  exists(scope: DictionaryScope): boolean {
    return existsSync(this.getPath(scope));
  }
}

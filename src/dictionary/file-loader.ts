/**
 * 辞書ファイルの読み込み機能
 */

import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import type { DictionaryFile } from './types';

/**
 * パスを展開する（~をホームディレクトリに置換）
 */
function expandPath(path: string): string {
  if (path.startsWith('~')) {
    return join(homedir(), path.slice(1));
  }
  return resolve(path);
}

/**
 * 空の辞書ファイルを返す
 */
function emptyDictionary(): DictionaryFile {
  return {
    entries: {},
    metadata: {},
  };
}

/**
 * JSONをパースして辞書ファイル形式に変換
 */
function parseDictionaryFile(content: string, path: string): DictionaryFile {
  try {
    const parsed = JSON.parse(content);

    // 古い形式（直接 Record<string, string>）もサポート
    if (parsed.entries === undefined && typeof parsed === 'object') {
      // メタデータがないフラットな辞書
      const hasMetadata = parsed.metadata !== undefined;
      if (!hasMetadata) {
        return {
          entries: parsed,
          metadata: {},
        };
      }
    }

    // 新しい形式
    return {
      entries: parsed.entries || {},
      metadata: parsed.metadata || {},
    };
  } catch (error) {
    console.warn(`辞書ファイルの解析に失敗しました: ${path}`);
    return emptyDictionary();
  }
}

/**
 * 辞書ファイルを同期的に読み込む
 *
 * @param path - 辞書ファイルのパス（~はホームディレクトリに展開）
 * @returns 辞書ファイルの内容
 */
export function loadDictionaryFileSync(path: string): DictionaryFile {
  const expandedPath = expandPath(path);

  if (!existsSync(expandedPath)) {
    return emptyDictionary();
  }

  try {
    const content = readFileSync(expandedPath, 'utf-8');
    return parseDictionaryFile(content, expandedPath);
  } catch (error) {
    console.warn(`辞書ファイルの読み込みに失敗しました: ${expandedPath}`);
    return emptyDictionary();
  }
}

/**
 * 辞書ファイルを非同期で読み込む
 *
 * @param path - 辞書ファイルのパス（~はホームディレクトリに展開）
 * @returns 辞書ファイルの内容
 */
export async function loadDictionaryFile(path: string): Promise<DictionaryFile> {
  const expandedPath = expandPath(path);

  if (!existsSync(expandedPath)) {
    return emptyDictionary();
  }

  try {
    const content = await readFile(expandedPath, 'utf-8');
    return parseDictionaryFile(content, expandedPath);
  } catch (error) {
    console.warn(`辞書ファイルの読み込みに失敗しました: ${expandedPath}`);
    return emptyDictionary();
  }
}

/**
 * グローバル辞書を読み込む
 */
export function loadGlobalDictionarySync(): DictionaryFile {
  return loadDictionaryFileSync('~/.yomikata/dictionary.json');
}

/**
 * グローバル辞書を非同期で読み込む
 */
export async function loadGlobalDictionary(): Promise<DictionaryFile> {
  return loadDictionaryFile('~/.yomikata/dictionary.json');
}

/**
 * プロジェクト辞書を読み込む
 *
 * @param projectDir - プロジェクトディレクトリ（デフォルトは現在のディレクトリ）
 */
export function loadProjectDictionarySync(projectDir = process.cwd()): DictionaryFile {
  const path = join(projectDir, '.yomikata/dictionary.json');
  return loadDictionaryFileSync(path);
}

/**
 * プロジェクト辞書を非同期で読み込む
 *
 * @param projectDir - プロジェクトディレクトリ（デフォルトは現在のディレクトリ）
 */
export async function loadProjectDictionary(projectDir = process.cwd()): Promise<DictionaryFile> {
  const path = join(projectDir, '.yomikata/dictionary.json');
  return loadDictionaryFile(path);
}

/**
 * グローバル辞書のパスを取得
 */
export function getGlobalDictionaryPath(): string {
  return expandPath('~/.yomikata/dictionary.json');
}

/**
 * プロジェクト辞書のパスを取得
 */
export function getProjectDictionaryPath(projectDir = process.cwd()): string {
  return join(projectDir, '.yomikata/dictionary.json');
}

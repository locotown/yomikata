import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadDictionaryFileSync, loadDictionaryFile } from '../src/dictionary/file-loader';
import { mergeDictionaries } from '../src/dictionary/merger';

describe('file-loader', () => {
  const testDir = join(tmpdir(), 'yomikata-test-' + Date.now());
  const testFile = join(testDir, 'test-dict.json');

  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('loadDictionaryFileSync', () => {
    it('新しい形式の辞書ファイルを読み込む', () => {
      const content = JSON.stringify({
        entries: {
          '豊': 'ゆたか',
          '花子': 'はなこ',
        },
        metadata: {
          version: '1.0',
          lastUpdated: '2026-01-03',
        },
      });
      writeFileSync(testFile, content);

      const result = loadDictionaryFileSync(testFile);
      expect(result.entries).toEqual({
        '豊': 'ゆたか',
        '花子': 'はなこ',
      });
      expect(result.metadata?.version).toBe('1.0');
    });

    it('古い形式（フラット）の辞書ファイルを読み込む', () => {
      const content = JSON.stringify({
        '豊': 'ゆたか',
        '花子': 'はなこ',
      });
      writeFileSync(testFile, content);

      const result = loadDictionaryFileSync(testFile);
      expect(result.entries).toEqual({
        '豊': 'ゆたか',
        '花子': 'はなこ',
      });
    });

    it('存在しないファイルは空の辞書を返す', () => {
      const result = loadDictionaryFileSync('/nonexistent/path/dict.json');
      expect(result.entries).toEqual({});
    });

    it('不正なJSONは空の辞書を返す', () => {
      writeFileSync(testFile, 'invalid json {{{');
      const result = loadDictionaryFileSync(testFile);
      expect(result.entries).toEqual({});
    });
  });

  describe('loadDictionaryFile (async)', () => {
    it('辞書ファイルを非同期で読み込む', async () => {
      const content = JSON.stringify({
        entries: { '太郎': 'たろう' },
      });
      writeFileSync(testFile, content);

      const result = await loadDictionaryFile(testFile);
      expect(result.entries).toEqual({ '太郎': 'たろう' });
    });
  });
});

describe('merger', () => {
  const testDir = join(tmpdir(), 'yomikata-merger-test-' + Date.now());
  const projectDir = join(testDir, 'project');
  const projectDictDir = join(projectDir, '.yomikata');
  const projectDictFile = join(projectDictDir, 'dictionary.json');

  beforeEach(() => {
    mkdirSync(projectDictDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('mergeDictionaries', () => {
    it('インライン辞書のみをマージ', () => {
      const result = mergeDictionaries({
        inline: { '豊': 'ゆたか' },
      });
      expect(result).toEqual({ '豊': 'ゆたか' });
    });

    it('プロジェクト辞書を読み込んでマージ', () => {
      writeFileSync(
        projectDictFile,
        JSON.stringify({ entries: { '花子': 'はなこ' } })
      );

      const result = mergeDictionaries({
        inline: { '豊': 'ゆたか' },
        loadProject: true,
        projectDir: projectDir,
      });

      expect(result).toEqual({
        '豊': 'ゆたか',
        '花子': 'はなこ',
      });
    });

    it('インライン辞書がプロジェクト辞書より優先される', () => {
      writeFileSync(
        projectDictFile,
        JSON.stringify({ entries: { '豊': 'とよ' } }) // 別の読み
      );

      const result = mergeDictionaries({
        inline: { '豊': 'ゆたか' }, // こちらが優先
        loadProject: true,
        projectDir: projectDir,
      });

      expect(result['豊']).toBe('ゆたか');
    });

    it('辞書ファイルパスを指定してマージ', () => {
      const customFile = join(testDir, 'custom.json');
      writeFileSync(
        customFile,
        JSON.stringify({ entries: { '次郎': 'じろう' } })
      );

      const result = mergeDictionaries({
        inline: { '豊': 'ゆたか' },
        dictionaryFiles: [customFile],
      });

      expect(result).toEqual({
        '豊': 'ゆたか',
        '次郎': 'じろう',
      });
    });
  });
});

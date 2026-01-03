import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DictionaryManager } from '../cli/dictionary-manager';

describe('DictionaryManager', () => {
  const testDir = join(tmpdir(), 'yomikata-cli-test-' + Date.now());
  let manager: DictionaryManager;

  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    manager = new DictionaryManager(testDir);
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('init', () => {
    it('プロジェクト辞書を初期化できる', () => {
      const result = manager.init('project');
      expect(result.created).toBe(true);
      expect(existsSync(result.path)).toBe(true);
    });

    it('既存の辞書は作成しない', () => {
      manager.init('project');
      const result = manager.init('project');
      expect(result.created).toBe(false);
    });
  });

  describe('add', () => {
    it('エントリを追加できる', () => {
      const result = manager.add('豊', 'ゆたか', 'project');
      expect(result.success).toBe(true);

      const entries = manager.list('project');
      expect(entries).toHaveLength(1);
      expect(entries[0].key).toBe('豊');
      expect(entries[0].reading).toBe('ゆたか');
    });

    it('複数エントリを追加できる', () => {
      manager.add('豊', 'ゆたか', 'project');
      manager.add('花子', 'はなこ', 'project');

      const entries = manager.list('project');
      expect(entries).toHaveLength(2);
    });
  });

  describe('remove', () => {
    it('エントリを削除できる', () => {
      manager.add('豊', 'ゆたか', 'project');
      const result = manager.remove('豊', 'project');

      expect(result.existed).toBe(true);
      expect(manager.list('project')).toHaveLength(0);
    });

    it('存在しないエントリの削除を検出', () => {
      const result = manager.remove('存在しない', 'project');
      expect(result.existed).toBe(false);
    });
  });

  describe('list', () => {
    it('空の辞書は空配列を返す', () => {
      const entries = manager.list('project');
      expect(entries).toHaveLength(0);
    });
  });

  describe('import', () => {
    it('JSONファイルをインポートできる', () => {
      const importFile = join(testDir, 'import.json');
      const content = JSON.stringify({
        entries: {
          '太郎': 'たろう',
          '次郎': 'じろう',
        },
      });
      mkdirSync(testDir, { recursive: true });
      require('node:fs').writeFileSync(importFile, content);

      const result = manager.import(importFile, 'project');
      expect(result.imported).toBe(2);

      const entries = manager.list('project');
      expect(entries).toHaveLength(2);
    });

    it('フラット形式のJSONもインポートできる', () => {
      const importFile = join(testDir, 'import-flat.json');
      const content = JSON.stringify({
        '太郎': 'たろう',
      });
      mkdirSync(testDir, { recursive: true });
      require('node:fs').writeFileSync(importFile, content);

      const result = manager.import(importFile, 'project');
      expect(result.imported).toBe(1);
    });
  });

  describe('export', () => {
    it('辞書をエクスポートできる', () => {
      manager.add('豊', 'ゆたか', 'project');
      manager.add('花子', 'はなこ', 'project');

      const exported = manager.export('project');
      expect(Object.keys(exported.entries)).toHaveLength(2);
      expect(exported.entries['豊']).toBe('ゆたか');
    });
  });
});

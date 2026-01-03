/**
 * list コマンド - 辞書エントリ一覧を表示
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerListCommand(program: Command): void {
  program
    .command('list')
    .description('辞書エントリ一覧を表示')
    .option('-g, --global', 'グローバル辞書のみ表示')
    .option('-p, --project', 'プロジェクト辞書のみ表示')
    .action((options: { global?: boolean; project?: boolean }) => {
      const manager = new DictionaryManager();

      let scope: 'global' | 'project' | undefined;
      if (options.global && !options.project) {
        scope = 'global';
      } else if (options.project && !options.global) {
        scope = 'project';
      }

      const entries = manager.list(scope);

      if (entries.length === 0) {
        console.log('📭 辞書にエントリがありません');
        return;
      }

      console.log(`📖 辞書エントリ (${entries.length}件)\n`);

      // スコープごとにグループ化
      const globalEntries = entries.filter((e) => e.scope === 'global');
      const projectEntries = entries.filter((e) => e.scope === 'project');

      if (globalEntries.length > 0) {
        console.log('🌐 グローバル辞書:');
        for (const entry of globalEntries) {
          console.log(`   ${entry.key} → ${entry.reading}`);
        }
        console.log();
      }

      if (projectEntries.length > 0) {
        console.log('📁 プロジェクト辞書:');
        for (const entry of projectEntries) {
          console.log(`   ${entry.key} → ${entry.reading}`);
        }
        console.log();
      }
    });
}

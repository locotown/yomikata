/**
 * list コマンド - 辞書エントリ一覧を表示
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerListCommand(program: Command): void {
  program
    .command('list')
    .description('辞書エントリ一覧を表示')
    .action(async () => {
      const manager = new DictionaryManager();

      try {
        const entries = await manager.list();

        if (entries.length === 0) {
          console.log('📭 辞書にエントリがありません');
          return;
        }

        console.log(`📖 辞書エントリ (${entries.length}件)\n`);

        for (const entry of entries) {
          console.log(`   ${entry.key} → ${entry.reading}`);
        }
        console.log();
        console.log(`   API: ${manager.getApiUrl()}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

/**
 * remove コマンド - 辞書からエントリを削除
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerRemoveCommand(program: Command): void {
  program
    .command('remove <key>')
    .description('辞書からエントリを削除')
    .action(async (key: string) => {
      const manager = new DictionaryManager();

      try {
        const result = await manager.remove(key);

        if (result.deleted) {
          console.log(`✅ 削除しました: ${key}`);
        } else {
          console.log(`⚠️ エントリが見つかりません: ${key}`);
        }
        console.log(`   API: ${manager.getApiUrl()}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

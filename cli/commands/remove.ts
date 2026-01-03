/**
 * remove コマンド - 辞書からエントリを削除
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerRemoveCommand(program: Command): void {
  program
    .command('remove <key>')
    .description('辞書からエントリを削除')
    .option('-g, --global', 'グローバル辞書から削除', false)
    .action((key: string, options: { global: boolean }) => {
      const manager = new DictionaryManager();
      const scope = options.global ? 'global' : 'project';

      try {
        const result = manager.remove(key, scope);

        if (result.existed) {
          console.log(`✅ 削除しました: ${key}`);
          console.log(`   対象: ${result.path}`);
        } else {
          console.log(`⚠️ エントリが見つかりません: ${key}`);
        }
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

/**
 * add コマンド - 辞書にエントリを追加
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerAddCommand(program: Command): void {
  program
    .command('add <key> <reading>')
    .description('辞書にエントリを追加')
    .option('-g, --global', 'グローバル辞書に追加', false)
    .action((key: string, reading: string, options: { global: boolean }) => {
      const manager = new DictionaryManager();
      const scope = options.global ? 'global' : 'project';

      try {
        const result = manager.add(key, reading, scope);
        console.log(`✅ 追加しました: ${key} → ${reading}`);
        console.log(`   保存先: ${result.path}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

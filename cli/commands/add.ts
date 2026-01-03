/**
 * add コマンド - 辞書にエントリを追加
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerAddCommand(program: Command): void {
  program
    .command('add <key> <reading>')
    .description('辞書にエントリを追加')
    .action(async (key: string, reading: string) => {
      const manager = new DictionaryManager();

      try {
        await manager.add(key, reading);
        console.log(`✅ 追加しました: ${key} → ${reading}`);
        console.log(`   API: ${manager.getApiUrl()}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

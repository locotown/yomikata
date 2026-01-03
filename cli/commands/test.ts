/**
 * test コマンド - テキスト変換をプレビュー
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerTestCommand(program: Command): void {
  program
    .command('test <text>')
    .description('テキスト変換をプレビュー')
    .action(async (text: string) => {
      const manager = new DictionaryManager();

      try {
        const result = await manager.test(text);

        console.log('📝 入力:');
        console.log(`   ${text}`);
        console.log();
        console.log('🔊 出力:');
        console.log(`   ${result}`);

        if (text !== result) {
          console.log();
          console.log('✅ 変換されました');
        } else {
          console.log();
          console.log('ℹ️ 変換なし');
        }
        console.log();
        console.log(`   API: ${manager.getApiUrl()}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

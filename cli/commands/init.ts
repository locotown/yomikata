/**
 * init コマンド - 辞書ファイルを初期化
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('辞書ファイルを初期化')
    .option('-g, --global', 'グローバル辞書を初期化', false)
    .action((options: { global: boolean }) => {
      const manager = new DictionaryManager();
      const scope = options.global ? 'global' : 'project';

      try {
        const result = manager.init(scope);

        if (result.created) {
          console.log(`✅ 辞書ファイルを作成しました: ${result.path}`);
        } else {
          console.log(`⚠️ 辞書ファイルは既に存在します: ${result.path}`);
        }
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

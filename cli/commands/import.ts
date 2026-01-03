/**
 * import コマンド - 辞書ファイルをインポート
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerImportCommand(program: Command): void {
  program
    .command('import <file>')
    .description('JSONファイルから辞書をインポート')
    .option('-g, --global', 'グローバル辞書にインポート', false)
    .action((file: string, options: { global: boolean }) => {
      const manager = new DictionaryManager();
      const scope = options.global ? 'global' : 'project';

      try {
        const result = manager.import(file, scope);
        console.log(`✅ インポートしました: ${result.imported}件`);
        console.log(`   保存先: ${result.path}`);
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

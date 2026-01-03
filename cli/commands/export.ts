/**
 * export コマンド - 辞書をエクスポート
 */

import type { Command } from 'commander';
import { DictionaryManager } from '../dictionary-manager';

export function registerExportCommand(program: Command): void {
  program
    .command('export')
    .description('辞書をJSON形式でエクスポート')
    .option('-g, --global', 'グローバル辞書のみ')
    .option('-p, --project', 'プロジェクト辞書のみ')
    .action((options: { global?: boolean; project?: boolean }) => {
      const manager = new DictionaryManager();

      let scope: 'global' | 'project' | undefined;
      if (options.global && !options.project) {
        scope = 'global';
      } else if (options.project && !options.global) {
        scope = 'project';
      }

      try {
        const dict = manager.export(scope);
        console.log(JSON.stringify(dict, null, 2));
      } catch (error) {
        console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
}

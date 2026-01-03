/**
 * test コマンド - テキスト変換をプレビュー
 */

import type { Command } from 'commander';
import { convert } from '../../src/core/converter';

export function registerTestCommand(program: Command): void {
  program
    .command('test <text>')
    .description('テキスト変換をプレビュー')
    .option('-g, --global', 'グローバル辞書を使用', false)
    .option('-p, --project', 'プロジェクト辞書を使用', false)
    .option('-a, --all', '全機能を有効化', false)
    .action(
      (text: string, options: { global: boolean; project: boolean; all: boolean }) => {
        try {
          const result = convert(text, {
            counters: true,
            datetime: options.all,
            numbers: options.all,
            ordinals: options.all,
            loadGlobalDictionary: options.global || options.all,
            loadProjectDictionary: options.project || options.all,
          });

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
        } catch (error) {
          console.error(`❌ エラー: ${error instanceof Error ? error.message : error}`);
          process.exit(1);
        }
      }
    );
}

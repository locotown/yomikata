/**
 * yomikata CLI
 *
 * 辞書管理とテキスト変換のコマンドラインツール
 */

import { Command } from 'commander';
import { registerAddCommand } from './commands/add';
import { registerListCommand } from './commands/list';
import { registerRemoveCommand } from './commands/remove';
import { registerImportCommand } from './commands/import';
import { registerExportCommand } from './commands/export';
import { registerInitCommand } from './commands/init';
import { registerTestCommand } from './commands/test';

const program = new Command();

program
  .name('yomikata')
  .description('日本語TTS読み間違い対策 - 辞書管理CLI')
  .version('0.1.0');

// コマンド登録
registerAddCommand(program);
registerListCommand(program);
registerRemoveCommand(program);
registerImportCommand(program);
registerExportCommand(program);
registerInitCommand(program);
registerTestCommand(program);

program.parse();

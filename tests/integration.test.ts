import { describe, expect, it } from 'vitest';
import { createYomikata, yomikata } from '../src/index';

describe('yomikata', () => {
  it('デフォルト設定で数字+助数詞を変換する', () => {
    expect(yomikata('9歳の男の子')).toBe('きゅうさいの男の子');
  });

  it('カスタム辞書と助数詞変換を組み合わせる', () => {
    const result = yomikata('豊くんは9歳です', {
      dictionary: { '豊': 'ゆたか' },
    });
    expect(result).toBe('ゆたかくんはきゅうさいです');
  });

  it('助数詞変換を無効化できる', () => {
    const result = yomikata('9歳の男の子', { counters: false });
    expect(result).toBe('9歳の男の子');
  });

  it('辞書のみ使用する', () => {
    const result = yomikata('豊くん', {
      counters: false,
      dictionary: { '豊': 'ゆたか' },
    });
    expect(result).toBe('ゆたかくん');
  });
});

describe('createYomikata', () => {
  it('設定済みの変換関数を作成する', () => {
    const myYomikata = createYomikata({
      dictionary: { '豊': 'ゆたか' },
    });

    expect(myYomikata('豊くんは9歳です')).toBe('ゆたかくんはきゅうさいです');
  });

  it('同じ設定で複数回変換できる', () => {
    const myYomikata = createYomikata({
      dictionary: { '豊': 'ゆたか', '花子': 'はなこ' },
    });

    expect(myYomikata('豊くん')).toBe('ゆたかくん');
    expect(myYomikata('花子さん')).toBe('はなこさん');
    expect(myYomikata('豊と花子')).toBe('ゆたかとはなこ');
  });

  it('デフォルト設定で作成できる', () => {
    const myYomikata = createYomikata();
    expect(myYomikata('3匹の猫')).toBe('さんびきの猫');
  });
});

describe('実際の読み聞かせシナリオ', () => {
  it('キャラクター名と年齢を正しく変換する', () => {
    const convert = createYomikata({
      dictionary: { '豊': 'ゆたか' },
    });

    const story = `むかしむかし、豊という9歳の男の子がいました。
豊は3匹の猫と一緒に暮らしていました。
ある日、豊は森で8本の不思議な木を見つけました。`;

    const expected = `むかしむかし、ゆたかというきゅうさいの男の子がいました。
ゆたかはさんびきの猫といっしょに暮らしていました。
ある日、ゆたかは森ではっぽんの不思議な木を見つけました。`;

    expect(convert(story)).toBe(expected);
  });

  it('複数のキャラクターを正しく変換する', () => {
    const convert = createYomikata({
      dictionary: {
        '豊': 'ゆたか',
        '花子': 'はなこ',
        '魔法の森': 'まほうのもり',
      },
    });

    const story = '豊と花子は魔法の森を冒険しました';
    const expected = 'ゆたかとはなこはまほうのもりを冒険しました';

    expect(convert(story)).toBe(expected);
  });

  it('よくある誤読も含めて変換する', () => {
    const convert = createYomikata({
      dictionary: { '豊': 'ゆたか' },
    });

    const story = '今日、9歳の豊くんは大人と子供を見ました。明日また会おうね。';
    const expected = 'きょう、きゅうさいのゆたかくんはおとなとこどもを見ました。あしたまた会おうね。';

    expect(convert(story)).toBe(expected);
  });

  it('カスタム辞書が共通誤読より優先される', () => {
    const convert = createYomikata({
      dictionary: { '今日': 'こんにち' }, // あえて「こんにち」と読みたい場合
    });

    // カスタム辞書の「こんにち」が優先される
    expect(convert('今日は')).toBe('こんにちは');
  });
});

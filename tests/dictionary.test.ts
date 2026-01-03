import { describe, expect, it } from 'vitest';
import { applyDictionary } from '../src/dictionary/custom';

describe('applyDictionary', () => {
  it('単純な置換を行う', () => {
    const dictionary = { '豊': 'ゆたか' };
    expect(applyDictionary('豊くん', dictionary)).toBe('ゆたかくん');
  });

  it('複数の置換を行う', () => {
    const dictionary = {
      '豊': 'ゆたか',
      '太郎': 'たろう',
    };
    expect(applyDictionary('豊と太郎', dictionary)).toBe('ゆたかとたろう');
  });

  it('最長一致で置換する', () => {
    const dictionary = {
      '大': 'おお',
      '大人': 'おとな',
    };
    // '大人' が '大' より長いので、'大人' が優先される
    expect(applyDictionary('大人になりたい', dictionary)).toBe('おとなになりたい');
  });

  it('同じ単語が複数回出現する場合すべて置換する', () => {
    const dictionary = { '豊': 'ゆたか' };
    expect(applyDictionary('豊と豊', dictionary)).toBe('ゆたかとゆたか');
  });

  it('空の辞書の場合はそのまま返す', () => {
    expect(applyDictionary('テスト', {})).toBe('テスト');
  });

  it('undefinedの辞書の場合はそのまま返す', () => {
    expect(applyDictionary('テスト', undefined as unknown as Record<string, string>)).toBe(
      'テスト'
    );
  });

  it('正規表現の特殊文字を含むキーも正しく処理する', () => {
    const dictionary = { '(注)': 'ちゅう' };
    expect(applyDictionary('(注)これは重要です', dictionary)).toBe('ちゅうこれは重要です');
  });
});

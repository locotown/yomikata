import { describe, it, expect } from 'vitest';
import { convertOrdinals } from '../src/rules/ordinals';

describe('convertOrdinals', () => {
  describe('第X回', () => {
    it('第1回〜第10回を正しく変換する', () => {
      expect(convertOrdinals('第1回')).toBe('だいいっかい');
      expect(convertOrdinals('第2回')).toBe('だいにかい');
      expect(convertOrdinals('第3回')).toBe('だいさんかい');
      expect(convertOrdinals('第4回')).toBe('だいよんかい');
      expect(convertOrdinals('第5回')).toBe('だいごかい');
      expect(convertOrdinals('第6回')).toBe('だいろっかい');
      expect(convertOrdinals('第7回')).toBe('だいななかい');
      expect(convertOrdinals('第8回')).toBe('だいはっかい');
      expect(convertOrdinals('第9回')).toBe('だいきゅうかい');
      expect(convertOrdinals('第10回')).toBe('だいじゅっかい');
    });

    it('文中の第X回を変換する', () => {
      expect(convertOrdinals('第1回大会が開催されました')).toBe('だいいっかい大会が開催されました');
    });
  });

  describe('X番目', () => {
    it('1番目〜10番目を正しく変換する', () => {
      expect(convertOrdinals('1番目')).toBe('いちばんめ');
      expect(convertOrdinals('2番目')).toBe('にばんめ');
      expect(convertOrdinals('3番目')).toBe('さんばんめ');
      expect(convertOrdinals('10番目')).toBe('じゅうばんめ');
    });

    it('文中のX番目を変換する', () => {
      expect(convertOrdinals('3番目の扉を開けて')).toBe('さんばんめの扉を開けて');
    });
  });

  describe('X位', () => {
    it('1位〜10位を正しく変換する', () => {
      expect(convertOrdinals('1位')).toBe('いちい');
      expect(convertOrdinals('2位')).toBe('にい');
      expect(convertOrdinals('3位')).toBe('さんい');
      expect(convertOrdinals('10位')).toBe('じゅうい');
    });

    it('文中のX位を変換する', () => {
      expect(convertOrdinals('1位を獲得')).toBe('いちいを獲得');
    });
  });

  describe('第X話', () => {
    it('第1話〜第10話を正しく変換する', () => {
      expect(convertOrdinals('第1話')).toBe('だいいちわ');
      expect(convertOrdinals('第2話')).toBe('だいにわ');
      expect(convertOrdinals('第10話')).toBe('だいじゅうわ');
    });
  });

  describe('第X章', () => {
    it('第1章〜第10章を正しく変換する', () => {
      expect(convertOrdinals('第1章')).toBe('だいいっしょう');
      expect(convertOrdinals('第2章')).toBe('だいにしょう');
      expect(convertOrdinals('第8章')).toBe('だいはっしょう');
      expect(convertOrdinals('第10章')).toBe('だいじゅっしょう');
    });
  });

  describe('複合パターン', () => {
    it('複数の序数詞を変換する', () => {
      expect(convertOrdinals('第1回と第2回')).toBe('だいいっかいとだいにかい');
    });
  });

  describe('変換しない場合', () => {
    it('序数詞がないテキストはそのまま返す', () => {
      expect(convertOrdinals('こんにちは')).toBe('こんにちは');
    });
  });
});

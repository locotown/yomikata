import { describe, it, expect } from 'vitest';
import { convertLargeNumbers } from '../src/rules/numbers';

describe('convertLargeNumbers', () => {
  describe('百の位（100-999）', () => {
    it('100を正しく変換する', () => {
      expect(convertLargeNumbers('100')).toBe('ひゃく');
    });

    it('音便変化を正しく処理する', () => {
      expect(convertLargeNumbers('200')).toBe('にひゃく');
      expect(convertLargeNumbers('300')).toBe('さんびゃく');
      expect(convertLargeNumbers('400')).toBe('よんひゃく');
      expect(convertLargeNumbers('500')).toBe('ごひゃく');
      expect(convertLargeNumbers('600')).toBe('ろっぴゃく');
      expect(convertLargeNumbers('700')).toBe('ななひゃく');
      expect(convertLargeNumbers('800')).toBe('はっぴゃく');
      expect(convertLargeNumbers('900')).toBe('きゅうひゃく');
    });

    it('百＋十の位を正しく変換する', () => {
      expect(convertLargeNumbers('110')).toBe('ひゃくじゅう');
      expect(convertLargeNumbers('250')).toBe('にひゃくごじゅう');
      expect(convertLargeNumbers('320')).toBe('さんびゃくにじゅう');
    });

    it('百＋十＋一の位を正しく変換する', () => {
      expect(convertLargeNumbers('123')).toBe('ひゃくにじゅうさん');
      expect(convertLargeNumbers('456')).toBe('よんひゃくごじゅうろく');
      expect(convertLargeNumbers('789')).toBe('ななひゃくはちじゅうきゅう');
    });

    it('百＋一の位（十の位が0）を正しく変換する', () => {
      expect(convertLargeNumbers('101')).toBe('ひゃくいち');
      expect(convertLargeNumbers('305')).toBe('さんびゃくご');
    });
  });

  describe('千の位（1000-9999）', () => {
    it('1000を正しく変換する', () => {
      expect(convertLargeNumbers('1000')).toBe('せん');
    });

    it('音便変化を正しく処理する', () => {
      expect(convertLargeNumbers('2000')).toBe('にせん');
      expect(convertLargeNumbers('3000')).toBe('さんぜん');
      expect(convertLargeNumbers('4000')).toBe('よんせん');
      expect(convertLargeNumbers('5000')).toBe('ごせん');
      expect(convertLargeNumbers('6000')).toBe('ろくせん');
      expect(convertLargeNumbers('7000')).toBe('ななせん');
      expect(convertLargeNumbers('8000')).toBe('はっせん');
      expect(convertLargeNumbers('9000')).toBe('きゅうせん');
    });

    it('千＋百の位を正しく変換する', () => {
      expect(convertLargeNumbers('1100')).toBe('せんひゃく');
      expect(convertLargeNumbers('1500')).toBe('せんごひゃく');
      expect(convertLargeNumbers('2300')).toBe('にせんさんびゃく');
    });

    it('千＋百＋十＋一の位を正しく変換する', () => {
      expect(convertLargeNumbers('1234')).toBe('せんにひゃくさんじゅうよん');
      expect(convertLargeNumbers('5678')).toBe('ごせんろっぴゃくななじゅうはち');
    });
  });

  describe('万の位（10000+）', () => {
    it('1万を正しく変換する', () => {
      expect(convertLargeNumbers('10000')).toBe('いちまん');
    });

    it('10万を正しく変換する', () => {
      expect(convertLargeNumbers('100000')).toBe('じゅうまん');
    });

    it('100万を正しく変換する', () => {
      expect(convertLargeNumbers('1000000')).toBe('ひゃくまん');
    });
  });

  describe('文中での変換', () => {
    it('文中の数字を変換する', () => {
      expect(convertLargeNumbers('価格は300円です')).toBe('価格はさんびゃく円です');
      expect(convertLargeNumbers('距離は1000メートル')).toBe('距離はせんメートル');
    });

    it('複数の数字を変換する', () => {
      expect(convertLargeNumbers('100円と200円')).toBe('ひゃく円とにひゃく円');
    });
  });

  describe('変換しない場合', () => {
    it('99以下はそのまま返す', () => {
      expect(convertLargeNumbers('99')).toBe('99');
      expect(convertLargeNumbers('50')).toBe('50');
    });

    it('助数詞がない普通のテキストはそのまま返す', () => {
      expect(convertLargeNumbers('こんにちは')).toBe('こんにちは');
    });
  });
});

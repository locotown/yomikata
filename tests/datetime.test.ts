import { describe, it, expect } from 'vitest';
import { convertDatetime } from '../src/rules/datetime';

describe('convertDatetime', () => {
  describe('月の読み', () => {
    it('1月〜12月を変換', () => {
      expect(convertDatetime('1月')).toBe('いちがつ');
      expect(convertDatetime('2月')).toBe('にがつ');
      expect(convertDatetime('3月')).toBe('さんがつ');
      expect(convertDatetime('4月')).toBe('しがつ');
      expect(convertDatetime('5月')).toBe('ごがつ');
      expect(convertDatetime('6月')).toBe('ろくがつ');
      expect(convertDatetime('7月')).toBe('しちがつ');
      expect(convertDatetime('8月')).toBe('はちがつ');
      expect(convertDatetime('9月')).toBe('くがつ');
      expect(convertDatetime('10月')).toBe('じゅうがつ');
      expect(convertDatetime('11月')).toBe('じゅういちがつ');
      expect(convertDatetime('12月')).toBe('じゅうにがつ');
    });
  });

  describe('日の特殊読み', () => {
    it('1日〜10日の特殊読み', () => {
      expect(convertDatetime('1日')).toBe('ついたち');
      expect(convertDatetime('2日')).toBe('ふつか');
      expect(convertDatetime('3日')).toBe('みっか');
      expect(convertDatetime('4日')).toBe('よっか');
      expect(convertDatetime('5日')).toBe('いつか');
      expect(convertDatetime('6日')).toBe('むいか');
      expect(convertDatetime('7日')).toBe('なのか');
      expect(convertDatetime('8日')).toBe('ようか');
      expect(convertDatetime('9日')).toBe('ここのか');
      expect(convertDatetime('10日')).toBe('とおか');
    });

    it('14日、20日、24日の特殊読み', () => {
      expect(convertDatetime('14日')).toBe('じゅうよっか');
      expect(convertDatetime('20日')).toBe('はつか');
      expect(convertDatetime('24日')).toBe('にじゅうよっか');
    });

    it('11日以降の通常読み', () => {
      expect(convertDatetime('11日')).toBe('じゅういちにち');
      expect(convertDatetime('12日')).toBe('じゅうににち');
      expect(convertDatetime('13日')).toBe('じゅうさんにち');
      expect(convertDatetime('15日')).toBe('じゅうごにち');
      expect(convertDatetime('21日')).toBe('にじゅういちにち');
      expect(convertDatetime('31日')).toBe('さんじゅういちにち');
    });
  });

  describe('月日の組み合わせ', () => {
    it('X月Y日を正しく変換', () => {
      expect(convertDatetime('1月1日')).toBe('いちがつついたち');
      expect(convertDatetime('12月25日')).toBe('じゅうにがつにじゅうごにち');
      expect(convertDatetime('4月14日')).toBe('しがつじゅうよっか');
      expect(convertDatetime('8月20日')).toBe('はちがつはつか');
    });
  });

  describe('時刻', () => {
    it('通常の時刻を変換', () => {
      expect(convertDatetime('1時')).toBe('いちじ');
      expect(convertDatetime('2時')).toBe('にじ');
      expect(convertDatetime('3時')).toBe('さんじ');
      expect(convertDatetime('5時')).toBe('ごじ');
      expect(convertDatetime('6時')).toBe('ろくじ');
      expect(convertDatetime('8時')).toBe('はちじ');
      expect(convertDatetime('10時')).toBe('じゅうじ');
      expect(convertDatetime('11時')).toBe('じゅういちじ');
      expect(convertDatetime('12時')).toBe('じゅうにじ');
    });

    it('特殊読みの時刻を変換', () => {
      expect(convertDatetime('4時')).toBe('よじ');
      expect(convertDatetime('7時')).toBe('しちじ');
      expect(convertDatetime('9時')).toBe('くじ');
    });
  });

  describe('曜日', () => {
    it('曜日を変換', () => {
      expect(convertDatetime('月曜日')).toBe('げつようび');
      expect(convertDatetime('火曜日')).toBe('かようび');
      expect(convertDatetime('水曜日')).toBe('すいようび');
      expect(convertDatetime('木曜日')).toBe('もくようび');
      expect(convertDatetime('金曜日')).toBe('きんようび');
      expect(convertDatetime('土曜日')).toBe('どようび');
      expect(convertDatetime('日曜日')).toBe('にちようび');
    });
  });

  describe('複合パターン', () => {
    it('日付と時刻の組み合わせ', () => {
      expect(convertDatetime('1月1日は3時に集合')).toBe('いちがつついたちはさんじに集合');
      expect(convertDatetime('4月4日の4時')).toBe('しがつよっかのよじ');
    });

    it('曜日を含むパターン', () => {
      expect(convertDatetime('月曜日の9時')).toBe('げつようびのくじ');
    });
  });

  describe('変換しないパターン', () => {
    it('日付・時刻以外は変換しない', () => {
      expect(convertDatetime('こんにちは')).toBe('こんにちは');
      expect(convertDatetime('100円')).toBe('100円');
    });
  });
});

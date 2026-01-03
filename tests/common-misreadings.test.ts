import { describe, expect, it } from 'vitest';
import { applyCommonMisreadings, COMMON_MISREADINGS } from '../src/rules/common-misreadings';

describe('applyCommonMisreadings', () => {
  describe('日時関連', () => {
    it('今日を正しく変換する', () => {
      expect(applyCommonMisreadings('今日はいい天気です')).toBe('きょうはいい天気です');
    });

    it('明日を正しく変換する', () => {
      expect(applyCommonMisreadings('明日また会おうね')).toBe('あしたまた会おうね');
    });

    it('昨日を正しく変換する', () => {
      expect(applyCommonMisreadings('昨日は楽しかった')).toBe('きのうは楽しかった');
    });
  });

  describe('人物関連', () => {
    it('大人を正しく変換する', () => {
      expect(applyCommonMisreadings('大人になりたい')).toBe('おとなになりたい');
    });

    it('子供を正しく変換する', () => {
      expect(applyCommonMisreadings('子供たちが遊んでいます')).toBe('こどもたちが遊んでいます');
    });
  });

  describe('家族関連', () => {
    it('お母さんを変換する', () => {
      expect(applyCommonMisreadings('お母さんが呼んでいる')).toBe('おかあさんが呼んでいる');
    });

    it('お父さんを変換する', () => {
      expect(applyCommonMisreadings('お父さんと遊ぶ')).toBe('おとうさんと遊ぶ');
    });

    it('お兄さん・お姉さんを変換する', () => {
      expect(applyCommonMisreadings('お兄さんとお姉さん')).toBe('おにいさんとおねえさん');
    });

    it('兄弟・姉妹を変換する', () => {
      expect(applyCommonMisreadings('兄弟と姉妹')).toBe('きょうだいとしまい');
    });
  });

  describe('友達・人間関係', () => {
    it('友達を変換する', () => {
      expect(applyCommonMisreadings('友達と遊ぶ')).toBe('ともだちと遊ぶ');
    });

    it('仲間を変換する', () => {
      expect(applyCommonMisreadings('仲間がいる')).toBe('なかまがいる');
    });

    it('皆を変換する', () => {
      expect(applyCommonMisreadings('皆で遊ぼう')).toBe('みんなで遊ぼう');
    });
  });

  describe('動作・状態', () => {
    it('一緒を変換する', () => {
      expect(applyCommonMisreadings('一緒に行こう')).toBe('いっしょに行こう');
    });

    it('上手・下手を変換する', () => {
      expect(applyCommonMisreadings('上手で下手')).toBe('じょうずでへた');
    });

    it('本当を変換する', () => {
      expect(applyCommonMisreadings('本当に嬉しい')).toBe('ほんとうに嬉しい');
    });
  });

  describe('場所', () => {
    it('部屋を変換する', () => {
      expect(applyCommonMisreadings('部屋に入る')).toBe('へやに入る');
    });

    it('玄関を変換する', () => {
      expect(applyCommonMisreadings('玄関で待つ')).toBe('げんかんで待つ');
    });
  });

  describe('時間表現（追加）', () => {
    it('一昨日・明後日を変換する', () => {
      expect(applyCommonMisreadings('一昨日と明後日')).toBe('おとといとあさって');
    });

    it('今朝・今晩を変換する', () => {
      expect(applyCommonMisreadings('今朝から今晩まで')).toBe('けさからこんばんまで');
    });
  });

  describe('複合パターン', () => {
    it('複数の誤読を一度に変換する', () => {
      const input = '今日は大人と子供で遊びます';
      const expected = 'きょうはおとなとこどもで遊びます';
      expect(applyCommonMisreadings(input)).toBe(expected);
    });

    it('物語形式のテキストを変換する', () => {
      const input = '昨日、子供が「明日、大人になりたい」と言いました';
      const expected = 'きのう、こどもが「あした、おとなになりたい」と言いました';
      expect(applyCommonMisreadings(input)).toBe(expected);
    });
  });

  describe('変換しない場合', () => {
    it('誤読パターンがないテキストはそのまま返す', () => {
      expect(applyCommonMisreadings('ただの文章です')).toBe('ただの文章です');
    });

    it('空文字列はそのまま返す', () => {
      expect(applyCommonMisreadings('')).toBe('');
    });
  });
});

describe('COMMON_MISREADINGS辞書', () => {
  it('日時関連の語が登録されている', () => {
    expect(COMMON_MISREADINGS['今日']).toBe('きょう');
    expect(COMMON_MISREADINGS['明日']).toBe('あした');
    expect(COMMON_MISREADINGS['昨日']).toBe('きのう');
  });

  it('人物関連の語が登録されている', () => {
    expect(COMMON_MISREADINGS['大人']).toBe('おとな');
    expect(COMMON_MISREADINGS['子供']).toBe('こども');
  });
});

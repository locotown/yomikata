import { describe, expect, it } from 'vitest';
import { convertCounters } from '../src/rules/counters';

describe('convertCounters', () => {
  describe('歳（年齢）', () => {
    it('1〜10歳を正しく変換する', () => {
      expect(convertCounters('1歳')).toBe('いっさい');
      expect(convertCounters('2歳')).toBe('にさい');
      expect(convertCounters('3歳')).toBe('さんさい');
      expect(convertCounters('4歳')).toBe('よんさい');
      expect(convertCounters('5歳')).toBe('ごさい');
      expect(convertCounters('6歳')).toBe('ろくさい');
      expect(convertCounters('7歳')).toBe('ななさい');
      expect(convertCounters('8歳')).toBe('はっさい');
      expect(convertCounters('9歳')).toBe('きゅうさい');
      expect(convertCounters('10歳')).toBe('じゅっさい');
    });

    it('11歳と12歳を正しく変換する', () => {
      expect(convertCounters('11歳')).toBe('じゅういっさい');
      expect(convertCounters('12歳')).toBe('じゅうにさい');
    });

    it('文中の年齢を正しく変換する', () => {
      expect(convertCounters('9歳の男の子')).toBe('きゅうさいの男の子');
      expect(convertCounters('彼は8歳です')).toBe('彼ははっさいです');
    });
  });

  describe('匹（動物）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1匹')).toBe('いっぴき');
      expect(convertCounters('2匹')).toBe('にひき');
      expect(convertCounters('3匹')).toBe('さんびき');
      expect(convertCounters('6匹')).toBe('ろっぴき');
      expect(convertCounters('8匹')).toBe('はっぴき');
      expect(convertCounters('10匹')).toBe('じゅっぴき');
    });

    it('文中の匹を正しく変換する', () => {
      expect(convertCounters('3匹の猫')).toBe('さんびきの猫');
    });
  });

  describe('人（人数）', () => {
    it('1人と2人の特殊読みを正しく処理する', () => {
      expect(convertCounters('1人')).toBe('ひとり');
      expect(convertCounters('2人')).toBe('ふたり');
    });

    it('3人以上を正しく変換する', () => {
      expect(convertCounters('3人')).toBe('さんにん');
      expect(convertCounters('4人')).toBe('よにん');
      expect(convertCounters('10人')).toBe('じゅうにん');
    });
  });

  describe('本（細長いもの）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1本')).toBe('いっぽん');
      expect(convertCounters('2本')).toBe('にほん');
      expect(convertCounters('3本')).toBe('さんぼん');
      expect(convertCounters('6本')).toBe('ろっぽん');
      expect(convertCounters('8本')).toBe('はっぽん');
    });
  });

  describe('個（個数）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1個')).toBe('いっこ');
      expect(convertCounters('6個')).toBe('ろっこ');
      expect(convertCounters('8個')).toBe('はっこ');
      expect(convertCounters('10個')).toBe('じゅっこ');
    });
  });

  describe('台（車・機械）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1台')).toBe('いちだい');
      expect(convertCounters('2台')).toBe('にだい');
      expect(convertCounters('3台')).toBe('さんだい');
      expect(convertCounters('10台')).toBe('じゅうだい');
    });
  });

  describe('軒（家）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1軒')).toBe('いっけん');
      expect(convertCounters('2軒')).toBe('にけん');
      expect(convertCounters('3軒')).toBe('さんげん');
      expect(convertCounters('6軒')).toBe('ろっけん');
      expect(convertCounters('10軒')).toBe('じゅっけん');
    });
  });

  describe('頭（大型動物）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1頭')).toBe('いっとう');
      expect(convertCounters('2頭')).toBe('にとう');
      expect(convertCounters('3頭')).toBe('さんとう');
      expect(convertCounters('10頭')).toBe('じゅっとう');
    });
  });

  describe('羽（鳥）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1羽')).toBe('いちわ');
      expect(convertCounters('2羽')).toBe('にわ');
      expect(convertCounters('3羽')).toBe('さんわ');
      expect(convertCounters('6羽')).toBe('ろくわ');
      expect(convertCounters('10羽')).toBe('じゅうわ');
    });
  });

  describe('階（建物）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1階')).toBe('いっかい');
      expect(convertCounters('2階')).toBe('にかい');
      expect(convertCounters('3階')).toBe('さんがい');
      expect(convertCounters('6階')).toBe('ろっかい');
      expect(convertCounters('10階')).toBe('じゅっかい');
    });
  });

  describe('足（靴）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1足')).toBe('いっそく');
      expect(convertCounters('2足')).toBe('にそく');
      expect(convertCounters('3足')).toBe('さんぞく');
      expect(convertCounters('10足')).toBe('じゅっそく');
    });
  });

  describe('着（衣類）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1着')).toBe('いっちゃく');
      expect(convertCounters('2着')).toBe('にちゃく');
      expect(convertCounters('3着')).toBe('さんちゃく');
      expect(convertCounters('10着')).toBe('じゅっちゃく');
    });
  });

  describe('組（セット）', () => {
    it('特殊読みを正しく処理する', () => {
      expect(convertCounters('1組')).toBe('ひとくみ');
      expect(convertCounters('2組')).toBe('ふたくみ');
      expect(convertCounters('3組')).toBe('さんくみ');
      expect(convertCounters('10組')).toBe('じゅうくみ');
    });
  });

  describe('箱（容器）', () => {
    it('特殊読みを正しく処理する', () => {
      expect(convertCounters('1箱')).toBe('ひとはこ');
      expect(convertCounters('2箱')).toBe('ふたはこ');
      expect(convertCounters('3箱')).toBe('さんばこ');
      expect(convertCounters('10箱')).toBe('じゅっぱこ');
    });
  });

  describe('番（順序）', () => {
    it('音便変化を正しく処理する', () => {
      expect(convertCounters('1番')).toBe('いちばん');
      expect(convertCounters('2番')).toBe('にばん');
      expect(convertCounters('3番')).toBe('さんばん');
      expect(convertCounters('10番')).toBe('じゅうばん');
    });
  });

  describe('複数の助数詞が混在する場合', () => {
    it('すべて正しく変換する', () => {
      const input = '9歳の男の子が3匹の猫と遊んでいます';
      const expected = 'きゅうさいの男の子がさんびきの猫と遊んでいます';
      expect(convertCounters(input)).toBe(expected);
    });

    it('複数の同じ助数詞を正しく変換する', () => {
      const input = '1匹と2匹と3匹';
      const expected = 'いっぴきとにひきとさんびき';
      expect(convertCounters(input)).toBe(expected);
    });
  });

  describe('変換しない場合', () => {
    it('助数詞がないテキストはそのまま返す', () => {
      expect(convertCounters('今日はいい天気です')).toBe('今日はいい天気です');
    });

    it('100以上の数字はそのまま残す', () => {
      expect(convertCounters('100歳')).toBe('100歳');
    });
  });
});

# yomikata

日本語TTS（Text-to-Speech）の読み間違いを防ぐテキスト前処理ライブラリ

Gemini TTS など SSML 非対応の TTS でも正確な発音を実現します。

## Features

- **数字+助数詞の変換**: 9歳→きゅうさい、3匹→さんびき
- **日付・時間の変換**: 1月1日→いちがつついたち、4時→よじ
- **よくある誤読の修正**: 今日→きょう、大人→おとな
- **大きな数字の変換**: 300→さんびゃく、8000→はっせん
- **序数詞の変換**: 第1回→だいいっかい、1番目→いちばんめ
- **カスタム辞書**: 固有名詞や特殊な読みに対応

## Installation

```bash
npm install yomikata
```

## Quick Start

```typescript
import { yomikata, createYomikata } from 'yomikata';

// シンプルな使い方
const result = yomikata("9歳の男の子が3匹の猫と遊んでいます");
// → "きゅうさいの男の子がさんびきの猫と遊んでいます"

// カスタム設定
const myYomikata = createYomikata({
  datetime: true,
  dictionary: { "豊": "ゆたか" }
});
const result = myYomikata("豊くんは9歳です。今日は1月1日");
// → "ゆたかくんはきゅうさいです。きょうはいちがつついたち"
```

## API Reference

### `yomikata(text, config?)`

テキストを変換します。

```typescript
yomikata("9歳の男の子"); // → "きゅうさいの男の子"
```

### `createYomikata(config?)`

設定済みの変換関数を作成します。

```typescript
const myYomikata = createYomikata({
  dictionary: { "豊": "ゆたか" }
});
myYomikata("豊くんは9歳です"); // → "ゆたかくんはきゅうさいです"
```

## Configuration Options

| オプション | 型 | デフォルト | 説明 |
|-----------|------|---------|------|
| `counters` | `boolean` | `true` | 数字+助数詞の変換を有効化 |
| `datetime` | `boolean` | `false` | 日付・時間表現の変換を有効化 |
| `numbers` | `boolean` | `false` | 大きな数字（100以上）の変換を有効化 |
| `ordinals` | `boolean` | `false` | 序数詞の変換を有効化 |
| `dictionary` | `Record<string, string>` | `{}` | カスタム辞書 |

## Examples

### 読み聞かせシナリオ

```typescript
const story = createYomikata({
  datetime: true,
  ordinals: true,
  dictionary: {
    "豊": "ゆたか",
    "花子": "はなこ"
  }
});

const text = `
むかしむかし、豊という9歳の男の子がいました。
豊は3匹の猫と一緒に暮らしていました。
今日は1月1日、新年の始まりです。
第1話「不思議な森の冒険」
`;

console.log(story(text));
// むかしむかし、ゆたかというきゅうさいの男の子がいました。
// ゆたかはさんびきの猫といっしょに暮らしていました。
// きょうはいちがつついたち、新年の始まりです。
// だいいちわ「不思議な森の冒険」
```

### 対応助数詞

| 助数詞 | 用途 | 例 |
|-------|------|-----|
| 歳 | 年齢 | 9歳→きゅうさい |
| 個 | 個数 | 6個→ろっこ |
| 匹 | 動物 | 3匹→さんびき |
| 人 | 人数 | 1人→ひとり |
| 本 | 細長いもの | 8本→はっぽん |
| 枚 | 薄いもの | 5枚→ごまい |
| 冊 | 本 | 1冊→いっさつ |
| 回 | 回数 | 6回→ろっかい |
| 杯 | 飲み物 | 1杯→いっぱい |
| 台 | 車・機械 | 3台→さんだい |
| 軒 | 家 | 1軒→いっけん |
| 頭 | 大型動物 | 1頭→いっとう |
| 羽 | 鳥 | 3羽→さんわ |
| 階 | 建物 | 3階→さんがい |
| 足 | 靴 | 1足→いっそく |
| 着 | 衣類 | 1着→いっちゃく |
| 組 | セット | 1組→ひとくみ |
| 箱 | 容器 | 1箱→ひとはこ |
| 番 | 順序 | 1番→いちばん |

### 日付・時間の特殊読み

```typescript
const dt = createYomikata({ datetime: true });

// 日付
dt("1月1日");  // → いちがつついたち
dt("1月2日");  // → いちがつふつか
dt("1月10日"); // → いちがつとおか
dt("1月20日"); // → いちがつはつか

// 時刻（特殊読み）
dt("4時"); // → よじ
dt("7時"); // → しちじ
dt("9時"); // → くじ

// 曜日
dt("月曜日"); // → げつようび
```

## License

MIT

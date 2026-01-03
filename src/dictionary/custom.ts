/**
 * カスタム辞書による変換
 * 長い文字列から順に置換を行い、部分一致の問題を回避
 */
export function applyDictionary(text: string, dictionary: Record<string, string>): string {
  if (!dictionary || Object.keys(dictionary).length === 0) {
    return text;
  }

  // キーを長さの降順でソート（最長一致）
  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

  let result = text;
  for (const key of sortedKeys) {
    const value = dictionary[key];
    // 正規表現の特殊文字をエスケープ
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escapedKey, 'g'), value);
  }

  return result;
}

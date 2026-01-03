'use client';

import { useEffect } from 'react';
import { useDictionaryStore } from '@/lib/store';

export function DictionaryList() {
  const { entries, loading, error, searchQuery, fetchEntries, removeEntry } =
    useDictionaryStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.key.includes(searchQuery) || entry.reading.includes(searchQuery)
  );

  if (loading && entries.length === 0) {
    return <div className="text-gray-500 py-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-4">エラー: {error}</div>;
  }

  if (filteredEntries.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center">
        {searchQuery
          ? '検索結果がありません'
          : '辞書にエントリがありません'}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow divide-y">
      {filteredEntries.map((entry) => (
        <div
          key={entry.key}
          className="flex items-center justify-between p-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">{entry.key}</span>
            <span className="text-gray-400">→</span>
            <span className="text-blue-600">{entry.reading}</span>
          </div>
          <button
            onClick={() => removeEntry(entry.key)}
            className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
            disabled={loading}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}

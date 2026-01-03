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

  const globalEntries = filteredEntries.filter((e) => e.scope === 'global');
  const projectEntries = filteredEntries.filter((e) => e.scope === 'project');

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
    <div className="space-y-6">
      {globalEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <span className="text-lg">🌐</span>
            グローバル辞書
          </h3>
          <div className="bg-white rounded-lg shadow divide-y">
            {globalEntries.map((entry) => (
              <div
                key={`global-${entry.key}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{entry.key}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-blue-600">{entry.reading}</span>
                </div>
                <button
                  onClick={() => removeEntry(entry.key, 'global')}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                  disabled={loading}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {projectEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
            <span className="text-lg">📁</span>
            プロジェクト辞書
          </h3>
          <div className="bg-white rounded-lg shadow divide-y">
            {projectEntries.map((entry) => (
              <div
                key={`project-${entry.key}`}
                className="flex items-center justify-between p-3 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">{entry.key}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-blue-600">{entry.reading}</span>
                </div>
                <button
                  onClick={() => removeEntry(entry.key, 'project')}
                  className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                  disabled={loading}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

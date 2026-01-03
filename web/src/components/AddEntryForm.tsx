'use client';

import { useState } from 'react';
import { useDictionaryStore } from '@/lib/store';

export function AddEntryForm() {
  const [key, setKey] = useState('');
  const [reading, setReading] = useState('');
  const { addEntry, loading } = useDictionaryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim() || !reading.trim()) return;

    await addEntry(key.trim(), reading.trim());
    setKey('');
    setReading('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">エントリを追加</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
              漢字・単語
            </label>
            <input
              id="key"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="例: 豊"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="reading" className="block text-sm font-medium text-gray-700 mb-1">
              読み仮名
            </label>
            <input
              id="reading"
              type="text"
              value={reading}
              onChange={(e) => setReading(e.target.value)}
              placeholder="例: ゆたか"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !key.trim() || !reading.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '追加中...' : '追加'}
        </button>
      </div>
    </form>
  );
}

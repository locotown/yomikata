'use client';

import { useState } from 'react';
import { useDictionaryStore } from '@/lib/store';

export function ProjectSelector() {
  const {
    selectedProjectPath,
    recentProjects,
    setSelectedProjectPath,
    removeRecentProject,
  } = useDictionaryStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputPath, setInputPath] = useState('');

  const handleSelectProject = (path: string | null) => {
    setSelectedProjectPath(path);
    setIsOpen(false);
  };

  const handleAddPath = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPath.trim()) {
      setSelectedProjectPath(inputPath.trim());
      setInputPath('');
      setIsOpen(false);
    }
  };

  const getDisplayName = (path: string) => {
    const parts = path.split('/');
    return parts[parts.length - 1] || path;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📁</span>
          <div>
            <div className="text-sm text-gray-500">プロジェクト</div>
            <div className="font-medium text-gray-900">
              {selectedProjectPath ? (
                <span title={selectedProjectPath}>
                  {getDisplayName(selectedProjectPath)}
                </span>
              ) : (
                <span className="text-gray-400">未選択（グローバルのみ）</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {isOpen ? '閉じる' : '変更'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border-t pt-4">
          {/* パス入力フォーム */}
          <form onSubmit={handleAddPath} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              プロジェクトパスを入力
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputPath}
                onChange={(e) => setInputPath(e.target.value)}
                placeholder="/path/to/your/project"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputPath.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                選択
              </button>
            </div>
          </form>

          {/* グローバルのみオプション */}
          <button
            onClick={() => handleSelectProject(null)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm mb-2 ${
              selectedProjectPath === null
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">🌐</span>
            グローバル辞書のみ
          </button>

          {/* 最近使用したプロジェクト */}
          {recentProjects.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">
                最近使用したプロジェクト
              </div>
              <div className="space-y-1">
                {recentProjects.map((path) => (
                  <div
                    key={path}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                      selectedProjectPath === path
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleSelectProject(path)}
                      className="flex-1 text-left truncate"
                      title={path}
                    >
                      <span className="mr-2">📁</span>
                      {getDisplayName(path)}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentProject(path);
                      }}
                      className="ml-2 text-gray-400 hover:text-red-500"
                      title="履歴から削除"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 選択中のフルパス表示 */}
          {selectedProjectPath && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xs text-gray-500">
                辞書パス: {selectedProjectPath}/.yomikata/dictionary.json
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

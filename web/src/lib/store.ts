import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DictionaryEntry {
  key: string;
  reading: string;
  scope: 'global' | 'project';
}

interface DictionaryState {
  // 辞書エントリ
  entries: DictionaryEntry[];
  loading: boolean;
  error: string | null;
  searchQuery: string;

  // プロジェクト管理
  selectedProjectPath: string | null;
  recentProjects: string[];

  // アクション
  setSearchQuery: (query: string) => void;
  setSelectedProjectPath: (path: string | null) => void;
  addRecentProject: (path: string) => void;
  removeRecentProject: (path: string) => void;
  fetchEntries: () => Promise<void>;
  addEntry: (key: string, reading: string, scope: 'global' | 'project') => Promise<void>;
  removeEntry: (key: string, scope: 'global' | 'project') => Promise<void>;
}

export const useDictionaryStore = create<DictionaryState>()(
  persist(
    (set, get) => ({
      entries: [],
      loading: false,
      error: null,
      searchQuery: '',
      selectedProjectPath: null,
      recentProjects: [],

      setSearchQuery: (query) => set({ searchQuery: query }),

      setSelectedProjectPath: (path) => {
        set({ selectedProjectPath: path });
        // 選択したプロジェクトを履歴に追加
        if (path) {
          get().addRecentProject(path);
        }
        // プロジェクト変更時にエントリを再取得
        get().fetchEntries();
      },

      addRecentProject: (path) => {
        const { recentProjects } = get();
        // 重複を除去して先頭に追加（最大10件）
        const filtered = recentProjects.filter((p) => p !== path);
        set({ recentProjects: [path, ...filtered].slice(0, 10) });
      },

      removeRecentProject: (path) => {
        const { recentProjects, selectedProjectPath } = get();
        set({ recentProjects: recentProjects.filter((p) => p !== path) });
        // 削除したプロジェクトが選択中なら解除
        if (selectedProjectPath === path) {
          set({ selectedProjectPath: null });
          get().fetchEntries();
        }
      },

      fetchEntries: async () => {
        const { selectedProjectPath } = get();
        set({ loading: true, error: null });
        try {
          const url = selectedProjectPath
            ? `/api/dictionary?projectPath=${encodeURIComponent(selectedProjectPath)}`
            : '/api/dictionary';
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          set({ entries: data.entries, loading: false });
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
        }
      },

      addEntry: async (key, reading, scope) => {
        const { selectedProjectPath } = get();
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/dictionary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, reading, scope, projectPath: selectedProjectPath }),
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to add');
          }
          await get().fetchEntries();
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
        }
      },

      removeEntry: async (key, scope) => {
        const { selectedProjectPath } = get();
        set({ loading: true, error: null });
        try {
          const res = await fetch('/api/dictionary', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, scope, projectPath: selectedProjectPath }),
          });
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to remove');
          }
          await get().fetchEntries();
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
        }
      },
    }),
    {
      name: 'yomikata-dictionary-storage',
      // 永続化するのはプロジェクト関連の状態のみ
      partialize: (state) => ({
        selectedProjectPath: state.selectedProjectPath,
        recentProjects: state.recentProjects,
      }),
    }
  )
);

import { create } from 'zustand';

export interface DictionaryEntry {
  key: string;
  reading: string;
}

interface DictionaryState {
  entries: DictionaryEntry[];
  loading: boolean;
  error: string | null;
  searchQuery: string;

  setSearchQuery: (query: string) => void;
  fetchEntries: () => Promise<void>;
  addEntry: (key: string, reading: string) => Promise<void>;
  removeEntry: (key: string) => Promise<void>;
}

export const useDictionaryStore = create<DictionaryState>()((set, get) => ({
  entries: [],
  loading: false,
  error: null,
  searchQuery: '',

  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchEntries: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/dictionary');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      set({ entries: data.entries, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Unknown error', loading: false });
    }
  },

  addEntry: async (key, reading) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, reading }),
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

  removeEntry: async (key) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/dictionary', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
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
}));

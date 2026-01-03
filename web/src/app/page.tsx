import { AddEntryForm } from '@/components/AddEntryForm';
import { DictionaryList } from '@/components/DictionaryList';
import { ProjectSelector } from '@/components/ProjectSelector';
import { SearchBar } from '@/components/SearchBar';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            yomikata 辞書管理
          </h1>
          <p className="text-gray-600">
            日本語TTSの読み間違い対策辞書
          </p>
        </header>

        <div className="space-y-6">
          <ProjectSelector />
          <AddEntryForm />

          <div className="space-y-4">
            <SearchBar />
            <DictionaryList />
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            CLI: <code className="bg-gray-200 px-2 py-1 rounded">yomikata add &quot;漢字&quot; &quot;よみ&quot;</code>
          </p>
        </footer>
      </div>
    </main>
  );
}

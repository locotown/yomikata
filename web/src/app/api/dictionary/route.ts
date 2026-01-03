import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { homedir } from 'node:os';

interface DictionaryFile {
  entries: Record<string, string>;
  metadata?: Record<string, unknown>;
}

interface DictionaryEntry {
  key: string;
  reading: string;
  scope: 'global' | 'project';
}

function getGlobalPath(): string {
  return join(homedir(), '.yomikata', 'dictionary.json');
}

function getProjectDictionaryPath(projectPath: string): string {
  return join(projectPath, '.yomikata', 'dictionary.json');
}

function loadDictionary(path: string): DictionaryFile {
  if (!existsSync(path)) {
    return { entries: {} };
  }
  try {
    const content = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(content);
    if (parsed.entries === undefined) {
      return { entries: parsed };
    }
    return { entries: parsed.entries || {}, metadata: parsed.metadata };
  } catch {
    return { entries: {} };
  }
}

function saveDictionary(path: string, dict: DictionaryFile): void {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  dict.metadata = {
    ...dict.metadata,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
  writeFileSync(path, JSON.stringify(dict, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  const entries: DictionaryEntry[] = [];
  const projectPath = request.nextUrl.searchParams.get('projectPath');

  // グローバル辞書は常に読み込む
  const globalPath = getGlobalPath();
  const globalDict = loadDictionary(globalPath);
  for (const [key, reading] of Object.entries(globalDict.entries)) {
    entries.push({ key, reading, scope: 'global' });
  }

  // プロジェクトパスが指定されている場合のみプロジェクト辞書を読み込む
  if (projectPath) {
    const projectDictPath = getProjectDictionaryPath(projectPath);
    const projectDict = loadDictionary(projectDictPath);
    for (const [key, reading] of Object.entries(projectDict.entries)) {
      entries.push({ key, reading, scope: 'project' });
    }
  }

  return NextResponse.json({
    entries,
    projectPath: projectPath || null,
    projectName: projectPath ? basename(projectPath) : null,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { key, reading, scope, projectPath } = await request.json();

    if (!key || !reading) {
      return NextResponse.json({ error: 'key and reading required' }, { status: 400 });
    }

    if (scope === 'project' && !projectPath) {
      return NextResponse.json({ error: 'projectPath required for project scope' }, { status: 400 });
    }

    const path = scope === 'global'
      ? getGlobalPath()
      : getProjectDictionaryPath(projectPath);

    const dict = loadDictionary(path);
    dict.entries[key] = reading;
    saveDictionary(path, dict);

    return NextResponse.json({ success: true, path });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { key, scope, projectPath } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'key required' }, { status: 400 });
    }

    if (scope === 'project' && !projectPath) {
      return NextResponse.json({ error: 'projectPath required for project scope' }, { status: 400 });
    }

    const path = scope === 'global'
      ? getGlobalPath()
      : getProjectDictionaryPath(projectPath);

    const dict = loadDictionary(path);

    if (key in dict.entries) {
      delete dict.entries[key];
      saveDictionary(path, dict);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

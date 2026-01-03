import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

// PostgreSQL connection using postgres.js (pure JavaScript, works in serverless)
const sql = postgres(process.env.DATABASE_URL || '', {
  max: 1, // Limit connections for serverless
});

interface DictionaryEntry {
  key: string;
  reading: string;
}

export async function GET() {
  try {
    const entries = await sql<DictionaryEntry[]>`
      SELECT key, reading FROM dictionary_entries ORDER BY key
    `;

    return NextResponse.json({
      entries,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, reading } = await request.json();

    if (!key || !reading) {
      return NextResponse.json({ error: 'key and reading required' }, { status: 400 });
    }

    // UPSERT: Insert or update if key exists
    await sql`
      INSERT INTO dictionary_entries (key, reading)
      VALUES (${key}, ${reading})
      ON CONFLICT (key) DO UPDATE SET reading = ${reading}, updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'key required' }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM dictionary_entries WHERE key = ${key}
    `;

    return NextResponse.json({
      success: true,
      deleted: result.count > 0,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

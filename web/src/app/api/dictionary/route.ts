import { NextRequest, NextResponse } from 'next/server';
import pg from 'pg';

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

interface DictionaryEntry {
  key: string;
  reading: string;
}

export async function GET() {
  try {
    const result = await pool.query<DictionaryEntry>(
      'SELECT key, reading FROM dictionary_entries ORDER BY key'
    );

    return NextResponse.json({
      entries: result.rows,
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
    await pool.query(
      `INSERT INTO dictionary_entries (key, reading)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET reading = $2, updated_at = NOW()`,
      [key, reading]
    );

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

    const result = await pool.query(
      'DELETE FROM dictionary_entries WHERE key = $1',
      [key]
    );

    return NextResponse.json({
      success: true,
      deleted: result.rowCount && result.rowCount > 0,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Database error' },
      { status: 500 }
    );
  }
}

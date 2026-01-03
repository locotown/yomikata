import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:SUOERzrrYJOOGyzECIjstzaQpLrFfQmM@caboose.proxy.rlwy.net:53793/railway',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Creating dictionary_entries table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS dictionary_entries (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        reading TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('Creating update_updated_at function...');

    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('Creating trigger...');

    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_updated_at ON dictionary_entries;
    `);

    await client.query(`
      CREATE TRIGGER trigger_update_updated_at
      BEFORE UPDATE ON dictionary_entries
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    `);

    console.log('Migration completed successfully!');

    // Verify table exists
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'dictionary_entries';
    `);

    console.log('Table structure:', result.rows);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

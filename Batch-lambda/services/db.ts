import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
});

export async function insertCampaigns(data: any[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const campaign of data) {
      await client.query(
        'INSERT INTO campaigns(id, name, status, created_at) VALUES ($1, $2, $3, $4)',
        [campaign.id, campaign.name, campaign.status || null, campaign.createdAt || null]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

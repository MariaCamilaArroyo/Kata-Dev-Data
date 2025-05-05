import { getRedisClient } from './redis';
import { getDbClient } from './db';

export async function getAllCampaigns(page: number, limit: number) {
  const redis = await getRedisClient();
  const cacheKey = `campaigns:page:${page}:limit:${limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const client = await getDbClient();
  const offset = (page - 1) * limit;

  const result = await client.query(
    'SELECT * FROM campaigns ORDER BY id LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  await redis.set(cacheKey, JSON.stringify(result.rows), { EX: 60 });
  return result.rows;
}

export async function getCampaignById(id: string) {
  const redis = await getRedisClient();
  const cacheKey = `campaigns:id:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const client = await getDbClient();
  const result = await client.query('SELECT * FROM campaigns WHERE id = $1', [id]);
  const row = result.rows[0] || null;
  if (row) await redis.set(cacheKey, JSON.stringify(row), { EX: 60 });
  return row;
}


import { Pool, PoolClient } from 'pg';
import { from } from 'pg-copy-streams';
import { PassThrough } from 'stream';

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || '5432'),
  ssl: { rejectUnauthorized: false }
});

export async function getDbClient(): Promise<PoolClient> {
  return pool.connect();
}

export async function insertCsvBatch(client: PoolClient, header: string, lines: string[]): Promise<void> {
  const passthrough = new PassThrough();
  passthrough.write(`${header}\n`);
  for (const line of lines) passthrough.write(`${line}\n`);
  passthrough.end();

  const dbStream = client.query(from(
    `COPY campaigns (client_name, card_amount, interest_rate, client_type)
     FROM STDIN WITH (FORMAT csv, HEADER true)`
  ));  

  await new Promise<void>((resolve, reject) => {
    passthrough.pipe(dbStream)
      .on('finish', resolve)
      .on('error', reject);
  });
}

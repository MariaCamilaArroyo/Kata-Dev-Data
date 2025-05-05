
import { S3Event } from 'aws-lambda';
import { getS3Stream } from '../services/s3';
import { getDbClient, insertCsvBatch } from '../services/db';
import readline from 'readline';

const BATCH_SIZE = 10000;

export async function handleS3InsertExecution(event: S3Event) {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

  if (!key.endsWith('.csv')) return;

  const s3Stream = await getS3Stream(bucket, key);
  const rl = readline.createInterface({ input: s3Stream, crlfDelay: Infinity });
  console.log('----->>>getDbClient before')
  const client = await getDbClient();
  console.log('----->>>getDbClient after')
  try {
    let header: string | null = null;
    let lines: string[] = [];

    for await (const line of rl) {
      if (!header) {
        header = line;
        continue;
      }

      lines.push(line);

      if (lines.length >= BATCH_SIZE) {
        await insertCsvBatch(client, header, lines);
        lines = [];
      }
    }

    if (lines.length > 0 && header) {
      await insertCsvBatch(client, header, lines);
    }
  } finally {
    client.release();
  }
}

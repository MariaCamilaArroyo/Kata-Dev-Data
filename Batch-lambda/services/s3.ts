
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3 = new S3Client({ region: 'us-east-2' });

async function streamToString(stream: Readable): Promise<string> {
  const chunks: any[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

export async function listJsonFiles(bucket: string, prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix });
  const response = await s3.send(command);
  return response.Contents?.map(obj => obj.Key!).filter(key => key.endsWith('.json')) || [];
}

export async function readJsonFromS3(bucket: string, key: string): Promise<any[]> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);
  const body = await streamToString(response.Body as Readable);
  return JSON.parse(body);
}

export async function uploadJsonToS3(bucket: string, key: string, data: any): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: 'application/json'
  });
  await s3.send(command);
}

export async function uploadCsvToS3(bucket: string, key: string, data: any[]): Promise<void> {
  const header = 'client_name,card_amount,interest_rate,client_type\n';
  const rows = data.map(item =>
    `${item.nombre_cliente},${item.monto_tarjeta},${item.tasa_interes},${item.tipo_cliente}`
  );
  const csvContent = header + rows.join('\n');

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: csvContent,
    ContentType: 'text/csv'
  });

  await s3.send(command);
}

export async function deleteS3Object(bucket: string, key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getS3Stream(bucket: string, key: string): Promise<Readable> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3.send(command);
  return response.Body as Readable;
}

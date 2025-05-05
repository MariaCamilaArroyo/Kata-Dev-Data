import { S3Event } from 'aws-lambda';
import { readJsonFromS3, uploadJsonToS3 } from '../services/s3';
import { insertCampaigns } from '../services/db';

const BUCKET_NAME = 'staging-campaigns-bucket';
const ERRORS_PREFIX = 'errors/rds/';

export async function handleS3InsertExecution(event: S3Event): Promise<void> {
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  const data = await readJsonFromS3(bucket, key);

  try {
    await insertCampaigns(data);
  } catch (err) {
    const errorKey = key.replace('campaigns/', ERRORS_PREFIX);
    await uploadJsonToS3(bucket, errorKey, data);
  }
}

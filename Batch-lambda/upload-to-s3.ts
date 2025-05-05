import axios from 'axios';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import path from 'path';

const REGION = 'us-east-2';
const BUCKET_NAME = 'staging-campaigns-bucket';
const API_URL = 'http://localhost:5000/campaign-data';

const s3 = new S3Client({
  region: REGION,
  credentials: fromIni({ profile: 'default' })
});

const uploadCampaignData = async () => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `campaigns-batch-${timestamp}.json`;
    const localPath = path.join(__dirname, 'temp', fileName);

    writeFileSync(localPath, JSON.stringify(data, null, 2));

    const fileContent = readFileSync(localPath);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `input/${fileName}`,
      Body: fileContent,
      ContentType: 'application/json'
    });

    await s3.send(command);
    console.log(`File uploades: s3://${BUCKET_NAME}/input/${fileName}`);

    unlinkSync(localPath);
  } catch (error: any) {
    console.error(`There was an error: ${error.message}`);
  }
};

uploadCampaignData();

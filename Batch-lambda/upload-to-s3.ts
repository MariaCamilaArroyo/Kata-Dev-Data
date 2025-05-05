import axios from 'axios';
import { writeFileSync, unlinkSync } from 'fs';
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
    console.log(`📡 Consultando API: ${API_URL}`);
    const response = await axios.get(API_URL);
    const data = response.data;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `temp/campaigns-batch-${timestamp}.json`;
    const localPath = path.join(__dirname, fileName);

    writeFileSync(localPath, JSON.stringify(data, null, 2));
    console.log(`📁 Archivo generado: ${fileName}`);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `campaigns/${fileName}`,
      Body: JSON.stringify(data),
      ContentType: 'application/json'
    });

    await s3.send(command);
    console.log(`✅ Archivo subido a S3: s3://${BUCKET_NAME}/${fileName}`);

    unlinkSync(localPath);
    console.log(`🧹 Archivo local eliminado: ${fileName}`);
  } catch (error: any) {
    console.error(`❌ Error en el proceso: ${error.message}`);
  }
};

uploadCampaignData();

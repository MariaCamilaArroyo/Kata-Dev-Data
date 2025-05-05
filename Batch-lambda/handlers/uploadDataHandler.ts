import { listJsonFiles, readJsonFromS3, uploadJsonToS3, uploadCsvToS3, deleteS3Object } from '../services/s3';
import { validateCampaignData } from '../services/validator';

const BUCKET_NAME = 'staging-campaigns-bucket';
const INPUT_PREFIX = 'input/';
const CAMPAIGNS_PREFIX = 'campaigns/';
const ERRORS_PREFIX = 'errors/';

export async function uploadDataHandler(): Promise<void> {
  const files = await listJsonFiles(BUCKET_NAME, INPUT_PREFIX);

  if (files.length === 0) {
    console.log('No hay archivos para procesar.');
    return;
  }

  for (const fileKey of files) {
    console.log(`📂 Procesando archivo: ${fileKey}`);

    const data = await readJsonFromS3(BUCKET_NAME, fileKey);
    const { valid, invalid } = validateCampaignData(data);

    if (invalid.length > 0) {
      const errorFileKey = fileKey.replace(INPUT_PREFIX, ERRORS_PREFIX);
      await uploadJsonToS3(BUCKET_NAME, errorFileKey, invalid);
      console.warn(`⚠️ ${invalid.length} registros inválidos exportados a: ${errorFileKey}`);
    }

    if (valid.length > 0) {
      const csvFileKey = fileKey
        .replace(INPUT_PREFIX, CAMPAIGNS_PREFIX)
        .replace(/\.json$/i, '.csv');

      await uploadCsvToS3(BUCKET_NAME, csvFileKey, valid);
      console.log(`✅ ${valid.length} registros válidos exportados a: ${csvFileKey}`);
    }

    await deleteS3Object(BUCKET_NAME, fileKey);
    console.log(`🗑️ Archivo original eliminado: ${fileKey}`);
  }
}

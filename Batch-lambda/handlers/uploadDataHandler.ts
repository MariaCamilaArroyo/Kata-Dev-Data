import { listJsonFiles, readJsonFromS3, moveS3Object, uploadJsonToS3 } from '../services/s3';
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
    console.log(`Procesando archivo: ${fileKey}`);

    const data = await readJsonFromS3(BUCKET_NAME, fileKey);
    const { valid, invalid } = validateCampaignData(data);

    if (invalid.length > 0) {
      const errorFile = fileKey.replace(INPUT_PREFIX, ERRORS_PREFIX);
      await uploadJsonToS3(BUCKET_NAME, errorFile, invalid);
      console.warn(`⚠️ Se encontraron ${invalid.length} registros inválidos.`);
    }
    const newLocation = fileKey.replace(INPUT_PREFIX, CAMPAIGNS_PREFIX);
    await moveS3Object(BUCKET_NAME, fileKey, newLocation);

    console.log(`Archivo ${fileKey} procesado con éxito.`);
  }
}

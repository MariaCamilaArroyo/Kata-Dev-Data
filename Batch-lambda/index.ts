import { S3Event, ScheduledEvent } from 'aws-lambda';
import { uploadDataHandler } from './handlers/uploadDataHandler';
import { handleS3InsertExecution } from './handlers/handleS3InsertExecution';

export const handler = async (event: S3Event | ScheduledEvent) => {
  if ('source' in event && event.source === 'aws.events') {
    await uploadDataHandler();
    return;
  }

  if ('Records' in event && event.Records[0].eventSource === 'aws:s3') {
    await handleS3InsertExecution(event);
    return;
  }
  await uploadDataHandler();
  console.log('Proceso ejecutado correctamente');
};

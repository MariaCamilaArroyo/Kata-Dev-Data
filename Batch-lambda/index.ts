import { ScheduledEvent } from 'aws-lambda';
import { handleScheduledExecution } from './handlers/uploadDataHandler';

export const handler = async (event: ScheduledEvent) => {
  console.log('🚀 Ejecutando Lambda por cron...');
  await handleScheduledExecution();
};

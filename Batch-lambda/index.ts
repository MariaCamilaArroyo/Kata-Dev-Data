import { S3Event, ScheduledEvent, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { uploadDataHandler } from './handlers/uploadDataHandler';
import { handleS3InsertExecution } from './handlers/handleS3InsertExecution';
import { getAllCampaigns, getCampaignById } from './services/campaignService';

export const handler = async (
  event: ScheduledEvent | S3Event | APIGatewayProxyEvent
): Promise<APIGatewayProxyResult | void> => {
  if ('source' in event && event.source === 'aws.events') {
    await uploadDataHandler();
    return;
  }

  if ('Records' in event && event.Records[0].eventSource === 'aws:s3') {
    await handleS3InsertExecution(event);
    return;
  }

  if ('httpMethod' in event && event.httpMethod === 'GET') {
    try {
      const path = event.path;
      const id = event.pathParameters?.id || null;

      if (path === '/campaigns') {
        const page = parseInt(event.queryStringParameters?.page || '1');
        const limit = parseInt(event.queryStringParameters?.limit || '20');
        const result = await getAllCampaigns(page, limit);
        return {
          statusCode: 200,
          body: JSON.stringify(result),
        };
      }

      if (path.startsWith('/campaigns/') && id) {
        const result = await getCampaignById(id);
        return {
          statusCode: 200,
          body: JSON.stringify(result),
        };
      }

      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not Found' }),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error', detail: err }),
      };
    }
  }

  console.log('Proceso ejecutado correctamente');};

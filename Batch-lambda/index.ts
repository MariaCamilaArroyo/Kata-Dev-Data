import { Handler } from 'aws-lambda';

export const handler: Handler = async (event, context) => {
  console.log("Lambda ejecutada. Evento recibido !!!", JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Lambda ejecutada correctamente." })
  };
};

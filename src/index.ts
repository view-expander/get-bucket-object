import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  console.log('hoge', event)

  return {
    statusCode: 200,
    body: '',
  }
}

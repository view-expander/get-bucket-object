import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const s3 = new AWS.S3()

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const Bucket = process.env.BUCKET

    if (Bucket === undefined) {
      throw new Error('Bucket name is required')
    }

    if (!event.pathParameters?.key) {
      throw new Error('Object key is required')
    }

    const { key } = event.pathParameters
    const res = await s3
      .getObject({
        Bucket,
        Key: key,
      })
      .promise()

    console.log('hoge', res)

    return {
      statusCode: res.$response.httpResponse.statusCode,
      body: JSON.stringify({ key }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify(err.message),
    }
  }
}

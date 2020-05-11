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

    if (
      event.pathParameters?.key === undefined ||
      event.pathParameters.key === null
    ) {
      throw new Error('Object key is required')
    }

    const { key } = event.pathParameters
    const res = await s3
      .getObject({
        Bucket,
        Key: key,
      })
      .promise()

    if (res.ContentType === undefined) {
      throw new Error('Object has unknown Content-Type')
    }

    if (res.Body === undefined) {
      throw new Error('Object body undefined')
    }

    return {
      statusCode: res.$response.httpResponse.statusCode,
      body: JSON.stringify({
        body: Buffer.isBuffer(res.Body)
          ? res.Body.toString('base64')
          : (typeof res.Body === 'string'
              ? Buffer.from(res.Body, 'base64')
              : Buffer.from(res.Body)
            ).toString('base64'),
        contentType: res.ContentType,
      }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify(err.message),
    }
  }
}

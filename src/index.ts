import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import ImgixClient from 'imgix-core-js'

const SHARED_RESPONSE_HEADER = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
} as const

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (
      event.pathParameters?.key === undefined ||
      event.pathParameters.key === null
    ) {
      throw new Error('Object key is required')
    }

    if (process.env.IMGIX_DOMAIN === undefined) {
      throw new Error('the domain of imgix is required')
    }

    const { key } = event.pathParameters
    const size = event.queryStringParameters?.size
    const client = new ImgixClient({ domain: process.env.IMGIX_DOMAIN })
    const url = client.buildURL(
      `source/${key}`,
      size === 'thumb'
        ? {
            auto: 'format',
            fit: 'clip',
            h: 256,
            w: 256,
            q: 50,
          }
        : {
            auto: 'format',
          }
    )

    return {
      statusCode: 301,
      headers: {
        ...SHARED_RESPONSE_HEADER,
        Location: url,
      },
      body: JSON.stringify({ path: url }),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      headers: {
        ...SHARED_RESPONSE_HEADER,
      },
      body: JSON.stringify(err.message),
    }
  }
}

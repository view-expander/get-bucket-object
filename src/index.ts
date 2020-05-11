import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import axios from 'axios'
import ImgixClient from 'imgix-core-js'

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
    const client = new ImgixClient({ domain: process.env.IMGIX_DOMAIN })
    const url = client.buildURL(key)

    const { data, headers, status } = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'image/jpeg',
      },
    })

    return {
      statusCode: status,
      headers,
      isBase64Encoded: true,
      body: Buffer.from(data).toString('base64'),
    }
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify(err.message),
    }
  }
}

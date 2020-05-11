import * as AWS from 'aws-sdk'
import { handler } from '../src'

describe('handler()', () => {
  beforeEach(() => {
    // set environments
    process.env.BUCKET = undefined

    // mock aws-sdk
    jest
      .spyOn((AWS.S3 as any).services['2006-03-01'].prototype, 'getObject')
      .mockImplementation(() => ({
        promise: (): any => ({
          $response: {
            httpResponse: {
              statusCode: 200,
            },
          },
          Body: Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',
            'base64'
          ),
          ContentType: 'image/png',
        }),
      }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('be succeed', async () => {
    expect.assertions(1)

    // set environments
    process.env.BUCKET = 'TARGET_BUCKET_NAME'

    return expect(
      handler({
        pathParameters: { key: 'image.jpg' },
      } as any)
    ).resolves.toMatchSnapshot()
  })
})

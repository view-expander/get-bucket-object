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
          Body: undefined,
        }),
      }))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns dummy response', async () => {
    expect.assertions(1)

    // set environments
    process.env.BUCKET = 'TARGET_BUCKET_NAME'

    return expect(
      handler({
        pathParameters: { key: 'image.jpg' },
      } as any)
    ).resolves.toEqual({
      statusCode: 200,
      body: JSON.stringify({ key: 'image.jpg' }),
    })
  })
})

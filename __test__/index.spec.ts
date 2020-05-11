import { APIGatewayProxyEvent } from 'aws-lambda'
import { handler } from '../src'

describe('handler()', () => {
  it('returns dummy response', async () => {
    expect.assertions(1)

    return expect(handler({} as APIGatewayProxyEvent)).resolves.toEqual({
      statusCode: 200,
      body: '',
    })
  })
})

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { handler } from '../src'

describe('handler()', () => {
  let mock: MockAdapter

  beforeEach(() => {
    process.env.IMGIX_DOMAIN = undefined
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  it('will be succeed', async () => {
    expect.assertions(1)

    process.env.IMGIX_DOMAIN = 'subdomain.imgix.net'
    mock
      .onGet()
      .reply(
        200,
        Uint8Array.from(
          Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=',
            'base64'
          )
        ).buffer,
        {
          'Content-Type': 'image/png',
        }
      )

    return expect(
      handler({
        headers: {
          Accept: 'image.png',
        },
        pathParameters: { key: 'image.png' },
      } as any)
    ).resolves.toMatchSnapshot()
  })
})

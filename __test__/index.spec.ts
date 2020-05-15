import { handler } from '../src'

describe('handler()', () => {
  beforeEach(() => {
    process.env.IMGIX_DOMAIN = undefined
  })

  it('will be succeed', async () => {
    expect.assertions(1)

    process.env.IMGIX_DOMAIN = 'subdomain.imgix.net'

    return expect(
      handler({
        headers: {
          Accept: 'image.png',
        },
        body: JSON.stringify({ key: 'image.png' }),
      } as any)
    ).resolves.toMatchSnapshot()
  })
})

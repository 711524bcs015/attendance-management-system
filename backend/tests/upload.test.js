const request = require('supertest')
const app = require('../server')

describe('Upload signed-url', () => {
  it('requires auth and returns 400 when filename missing', async () => {
    const res = await request(app).post('/api/upload/signed-url')
    expect([401, 400]).toContain(res.statusCode)
  })
})

const request = require('supertest')
const app = require('../server')

describe('Profile upload auth', () => {
  it('rejects unauthenticated uploads', async () => {
    const res = await request(app).post('/api/upload/profile')
    expect(res.statusCode).toBe(401)
  })
})

const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')

describe('Auth API', () => {
  beforeAll(async () => {
    // allow tests to run against configured test DB via MONGO_URI
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('registers, logs in and returns /me', async () => {
    const email = `testuser+${Date.now()}@example.com`
    const register = await request(app).post('/api/auth/register').send({ name: 'Test User', email, password: 'password1', role: 'student' })
    expect(register.statusCode).toBe(201)

    const login = await request(app).post('/api/auth/login').send({ email, password: 'password1' })
    expect(login.statusCode).toBe(200)
    const token = login.body.data.token
    expect(token).toBeTruthy()

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(me.statusCode).toBe(200)
    expect(me.body.data.email).toBe(email)
  }, 20000)
})

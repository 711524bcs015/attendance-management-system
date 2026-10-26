const axios = require('axios')

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

const run = async () => {
  try {
    console.log('Checking health...')
    const h = await API.get('/health')
    console.log('Health:', h.data)

    console.log('Logging in as admin...')
    const login = await API.post('/auth/login', { email: 'admin@example.com', password: 'Admin@123' })
    const token = login.data.data.token
    console.log('Token:', !!token)
    API.defaults.headers.Authorization = `Bearer ${token}`

    console.log('Fetching admin dashboard...')
    const dash = await API.get('/dashboard/admin')
    console.log('Dashboard keys:', Object.keys(dash.data.data))

    console.log('Fetching students list...')
    const students = await API.get('/students')
    const studentCount = students.data.data.total
    if (studentCount < 1) throw new Error('No students found')
    console.log('Students count:', studentCount)

    console.log('Smoke tests passed')
  } catch (err) {
    console.error('Smoke test failed:', err.response ? err.response.data : err.message)
    process.exit(1)
  }
}

run()

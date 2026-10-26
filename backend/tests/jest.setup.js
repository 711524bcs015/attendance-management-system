const mongoose = require('mongoose')

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_management_test'

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close()
  }
})
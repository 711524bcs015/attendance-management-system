const path = require('path')
const fs = require('fs')

// Simple storage abstraction: local filesystem and S3
const STORAGE_MODE = process.env.STORAGE_MODE || 'local' // 'local' or 's3'

const localPathFor = (filename) => `/uploads/${filename}`

if (STORAGE_MODE === 's3') {
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
  const { getSignedUrl: getAwsSignedUrl } = require('@aws-sdk/s3-request-presigner')

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    } : undefined
  })

  const getSignedUrl = async ({ filename }) => {
    const Key = filename
    const Bucket = process.env.AWS_S3_BUCKET
    const command = new PutObjectCommand({ Bucket, Key })
    const url = await getAwsSignedUrl(s3, command, { expiresIn: 900 })
    return { url, method: 'PUT' }
  }

  module.exports = { getSignedUrl, localPathFor }
} else {
  const getSignedUrl = async ({ filename }) => {
    // For local, return a simple POST path that the server can accept via the multer route
    return { url: localPathFor(filename), method: 'POST' }
  }

  module.exports = { getSignedUrl, localPathFor }
}

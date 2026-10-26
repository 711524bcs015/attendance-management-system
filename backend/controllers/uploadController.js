const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const uploadProfile = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
    const urlPath = `/uploads/${req.file.filename}`
    return res.json({ success: true, data: { url: urlPath } })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

const serveFile = (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '..', 'uploads', filename)
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' })
    return res.sendFile(filePath)
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

const deleteFile = (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '..', 'uploads', filename)
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found' })
    fs.unlinkSync(filePath)
    return res.json({ success: true, message: 'File deleted' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

const uploadToS3 = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
    if (process.env.STORAGE_MODE !== 's3') return res.status(400).json({ success: false, message: 'S3 not enabled' })

    const Bucket = process.env.AWS_S3_BUCKET
    if (!Bucket) return res.status(500).json({ success: false, message: 'Bucket not configured' })

    const s3 = new S3Client({ region: process.env.AWS_REGION })
    const filePath = req.file.path
    const Body = fs.readFileSync(filePath)
    const Key = req.file.filename || `${Date.now()}-${req.file.originalname}`

    const cmd = new PutObjectCommand({ Bucket, Key, Body, ContentType: req.file.mimetype })
    await s3.send(cmd)

    // Optionally remove local temp file
    try { fs.unlinkSync(filePath) } catch (e) { /* ignore */ }

    const url = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`
    return res.json({ success: true, data: { url } })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { uploadProfile, serveFile, deleteFile, uploadToS3 }

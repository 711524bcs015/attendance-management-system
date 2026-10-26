const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')
const { uploadProfile, serveFile, deleteFile } = require('../controllers/uploadController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`)
  }
})

const upload = multer({ storage })

router.post('/profile', protect, upload.single('file'), uploadProfile)
router.get('/file/:filename', protect, serveFile)
router.delete('/file/:filename', protect, allowRoles('admin'), deleteFile)

// Signed URL endpoint for S3 or local stub
const { getSignedUrl } = require('../utils/storage')
router.post('/signed-url', protect, async (req, res) => {
  try {
    const { filename } = req.body
    if (!filename) return res.status(400).json({ success: false, message: 'filename required' })
    const signed = await getSignedUrl({ filename })
    return res.json({ success: true, data: signed })
  } catch (err) { return res.status(500).json({ success: false, message: err.message }) }
})

// server-side S3 upload handler (stores to S3 when STORAGE_MODE=s3)
const { uploadToS3 } = require('../controllers/uploadController')
router.post('/s3', protect, upload.single('file'), uploadToS3)

module.exports = router

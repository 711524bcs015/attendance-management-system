const express = require('express')
const router = express.Router()
const { pdfReport } = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.get('/attendance/pdf', protect, allowRoles('admin','faculty'), pdfReport)

module.exports = router

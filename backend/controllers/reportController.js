const PDFDocument = require('pdfkit')
const Attendance = require('../models/Attendance')

const pdfReport = async (req, res) => {
  try {
    const { start, end, student, subject } = req.query
    const query = {}
    if (student) query.student = student
    if (subject) query.subject = subject
    if (start || end) {
      query.date = {}
      if (start) query.date.$gte = new Date(start)
      if (end) query.date.$lte = new Date(end)
    }
    const records = await Attendance.find(query).populate('student subject faculty')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.pdf')

    const doc = new PDFDocument({ margin: 30 })
    doc.pipe(res)

    doc.fontSize(18).text('Attendance Report', { align: 'center' })
    doc.moveDown()

    records.forEach(r => {
      doc.fontSize(10).text(`${new Date(r.date).toLocaleDateString()} - ${r.student?.name || ''} (${r.student?.studentId || ''}) - ${r.subject?.subjectName || ''} - ${r.status}`)
    })

    doc.end()
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { pdfReport }

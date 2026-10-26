import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'

function toCSV(rows) {
  if (!rows || rows.length === 0) return ''
  const keys = Object.keys(rows[0])
  const lines = [keys.join(',')]
  for (const r of rows) lines.push(keys.map(k => `"${(r[k] ?? '').toString().replace(/"/g,'""')}"`).join(','))
  return lines.join('\n')
}

export default function Reports() {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({ start: '', end: '' })

  const fetch = async () => {
    try {
      const res = await api.get('/attendance', { params: {} })
      const rows = (res.data.data.records || res.data.data).map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        student: r.student?.name || r.student,
        studentId: r.student?.studentId || '',
        subject: r.subject?.subjectName || r.subject,
        status: r.status
      }))
      setRecords(rows)
    } catch (err) { console.error(err); alert('Failed to load reports') }
  }

  useEffect(() => { fetch() }, [])

  const downloadCSV = () => {
    const csv = toCSV(records)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'attendance-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const downloadPDF = async () => {
    try {
      const res = await api.get('/reports/attendance/pdf', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url; a.download = 'attendance-report.pdf'; a.click()
      URL.revokeObjectURL(url)
    } catch (err) { console.error(err); alert('PDF export failed') }
  }

  return (
    <div className="layout"><Sidebar /><div className="page">
      <p className="eyebrow">Insights / Export centre</p>
      <h2>Attendance reports</h2>
      <div className="report-actions">
        <button onClick={downloadCSV}>Download CSV</button>
        <button style={{ marginLeft: 8 }} onClick={downloadPDF}>Download PDF</button>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Student</th><th>Student ID</th><th>Subject</th><th>Status</th></tr></thead>
        <tbody>
          {records.map((r, idx) => (
            <tr key={idx}><td>{r.date}</td><td>{r.student}</td><td>{r.studentId}</td><td>{r.subject}</td><td>{r.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div></div>
  )
}

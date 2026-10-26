import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'

export default function AttendanceHistory() {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({ student: '', subject: '', date: '' })

  const fetch = async () => {
    try {
      const params = {}
      if (filters.student) params.student = filters.student
      if (filters.subject) params.subject = filters.subject
      if (filters.date) params.date = filters.date
      const res = await api.get('/attendance', { params })
      setRecords(res.data.data.records || res.data.data)
    } catch (err) {
      console.error(err)
      alert('Failed to load attendance')
    }
  }

  useEffect(() => { fetch() }, [])

  const handleFilter = () => fetch()

  return (
    <div className="layout"><Sidebar /><div className="page">
      <p className="eyebrow">Records / Daily activity</p>
      <h2>Attendance history</h2>
      <div className="filters">
        <input placeholder="Student ID or name" value={filters.student} onChange={e => setFilters(f => ({ ...f, student: e.target.value }))} />
        <input placeholder="Subject ID" value={filters.subject} onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))} />
        <input type="date" value={filters.date} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
        <button onClick={handleFilter}>Filter</button>
      </div>
      <table>
        <thead><tr><th>Date</th><th>Student</th><th>Subject</th><th>Faculty</th><th>Status</th></tr></thead>
        <tbody>
          {records.map(r => (
            <tr key={r._id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.student?.name || r.student}</td>
              <td>{r.subject?.subjectName || r.subject}</td>
              <td>{r.faculty?.name || r.faculty}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div></div>
  )
}

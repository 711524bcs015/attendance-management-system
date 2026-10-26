import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function MarkAttendance() {
  const { user } = useContext(AuthContext)
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0,10))
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/subjects').then(res => setSubjects(res.data.data)).catch(err => setError(err.response?.data?.message || 'Unable to load your subjects'))
  }, [])

  useEffect(() => {
    if (!selectedSubject) return
    api.get('/students').then(res => setStudents(res.data.data.students || res.data.data)).catch(err => console.error(err))
    setMarks({})
  }, [selectedSubject])

  const mark = (studentId, status) => setMarks(m => ({ ...m, [studentId]: status }))
  const markAll = (status) => setMarks(Object.fromEntries(students.map(student => [student._id, status])))

  const submit = async () => {
    if (!selectedSubject || students.length === 0) return setError('Select a subject with students before submitting.')
    setError(''); setMessage(''); setSaving(true)
    try {
      const payloads = students.map(s => ({ student: s._id, subject: selectedSubject, date, status: marks[s._id] || 'Absent' }))
      for (const p of payloads) {
        await api.post('/attendance', p)
      }
      setMessage(`Attendance submitted for ${students.length} students`)
    } catch (err) { setError(err.response?.data?.message || 'Error submitting attendance') }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
      <p className="eyebrow">Faculty workspace / Daily register</p><h2>Mark attendance</h2>
      <div className="attendance-toolbar">
        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map(s => <option value={s._id} key={s._id}>{s.subjectCode} - {s.subjectName}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} /><button type="button" onClick={() => markAll('Present')}>Mark all present</button><button type="button" className="secondary-button" onClick={() => markAll('Absent')}>Mark all absent</button>
      </div>
      {error && <div className="form-inline-error">{error}</div>}{message && <div className="form-success">{message}</div>}
      <table className="register-table">
        <thead><tr><th>Student ID</th><th>Name</th><th>Present</th><th>Absent</th></tr></thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}>
              <td>{s.studentId}</td>
              <td>{s.name}</td>
              <td><input type="radio" name={`r-${s._id}`} checked={marks[s._id] === 'Present'} onChange={() => mark(s._id, 'Present')} /></td>
              <td><input type="radio" name={`r-${s._id}`} checked={marks[s._id] !== 'Present'} onChange={() => mark(s._id, 'Absent')} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={submit} disabled={saving}>{saving ? 'Saving attendance...' : 'Submit attendance'}</button>
    </div>
  )
}

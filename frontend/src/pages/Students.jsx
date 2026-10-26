import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Students() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', email: '', phone: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadStudents = () => api.get('/students').then(res => setStudents(res.data.data.students || res.data.data)).catch(err => setError(err.response?.data?.message || 'Unable to load students'))

  useEffect(() => { loadStudents() }, [])

  const submit = async (event) => {
    event.preventDefault(); setMessage(''); setError(''); setSaving(true)
    try { await api.post('/students', form); setForm({ studentId: '', name: '', email: '', phone: '', password: '' }); setMessage('Student added successfully'); await loadStudents() }
    catch (err) { setError(err.response?.data?.message || 'Unable to add student') }
    finally { setSaving(false) }
  }

  return (
    <div className="page">
        <p className="eyebrow">Directory / Learners</p><h2>Students</h2>
        <form className="entry-form" onSubmit={submit}>
          <div className="form-heading"><h3>Add a student</h3><span>Required fields are marked by the browser</span></div>
          <div className="form-grid"><input required placeholder="Student ID *" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} /><input required placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input required type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /><input type="password" placeholder="Login password (optional)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <button disabled={saving}>{saving ? 'Adding...' : 'Add student'}</button>{message && <span className="form-success">{message}</span>}{error && <span className="form-inline-error">{error}</span>}
        </form>
      <table>
        <thead><tr><th>Student ID</th><th>Name</th><th>Email</th></tr></thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id}><td>{s.studentId}</td><td>{s.name}</td><td>{s.email}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

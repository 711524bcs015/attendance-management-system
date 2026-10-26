import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [faculty, setFaculty] = useState([])
  const [form, setForm] = useState({ subjectCode: '', subjectName: '', semester: '', faculty: '' }); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  const loadSubjects = () => api.get('/subjects').then(res => setSubjects(res.data.data)).catch(err => setError(err.response?.data?.message || 'Unable to load subjects'))
  useEffect(() => { loadSubjects(); api.get('/faculty').then(res => setFaculty(res.data.data)).catch(() => {}) }, [])
  const submit = async (event) => { event.preventDefault(); setMessage(''); setError(''); setSaving(true); try { await api.post('/subjects', { ...form, semester: form.semester ? Number(form.semester) : undefined, faculty: form.faculty || undefined }); setForm({ subjectCode: '', subjectName: '', semester: '', faculty: '' }); setMessage('Subject added successfully'); await loadSubjects() } catch (err) { setError(err.response?.data?.message || 'Unable to add subject') } finally { setSaving(false) } }
  return (
    <div className="page">
      <p className="eyebrow">Curriculum / Course catalogue</p><h2>Subjects</h2>
      <form className="entry-form" onSubmit={submit}><div className="form-heading"><h3>Add subject</h3><span>Assign a faculty member so they can take attendance</span></div><div className="form-grid"><input required placeholder="Subject code *" value={form.subjectCode} onChange={e => setForm({ ...form, subjectCode: e.target.value })} /><input required placeholder="Subject name *" value={form.subjectName} onChange={e => setForm({ ...form, subjectName: e.target.value })} /><input type="number" min="1" placeholder="Semester" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} /><select value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })}><option value="">Assign faculty (optional)</option>{faculty.map(member => <option key={member._id} value={member._id}>{member.name} ({member.facultyId})</option>)}</select></div><button disabled={saving}>{saving ? 'Adding...' : 'Add subject'}</button>{message && <span className="form-success">{message}</span>}{error && <span className="form-inline-error">{error}</span>}</form>
      <ul>
        {subjects.map(s => <li key={s._id}>{s.subjectCode} - {s.subjectName}</li>)}
      </ul>
    </div>
  )
}

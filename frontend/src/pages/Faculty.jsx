import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function FacultyList() {
  const [faculty, setFaculty] = useState([])
  const [form, setForm] = useState({ facultyId: '', name: '', email: '', phone: '', password: '' })
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false)
  const loadFaculty = () => api.get('/faculty').then(res => setFaculty(res.data.data)).catch(err => setError(err.response?.data?.message || 'Unable to load faculty'))
  useEffect(() => { loadFaculty() }, [])
  const submit = async (event) => { event.preventDefault(); setMessage(''); setError(''); setSaving(true); try { await api.post('/faculty', form); setForm({ facultyId: '', name: '', email: '', phone: '', password: '' }); setMessage('Faculty member added successfully'); await loadFaculty() } catch (err) { setError(err.response?.data?.message || 'Unable to add faculty') } finally { setSaving(false) } }
  return (
    <div className="page">
      <p className="eyebrow">Directory / Teaching team</p><h2>Faculty</h2>
      <form className="entry-form" onSubmit={submit}><div className="form-heading"><h3>Add faculty</h3><span>Create a faculty login at the same time</span></div><div className="form-grid"><input required placeholder="Faculty ID *" value={form.facultyId} onChange={e => setForm({ ...form, facultyId: e.target.value })} /><input required placeholder="Full name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input required type="email" placeholder="Email address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /><input type="password" placeholder="Login password (optional)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div><button disabled={saving}>{saving ? 'Adding...' : 'Add faculty'}</button>{message && <span className="form-success">{message}</span>}{error && <span className="form-inline-error">{error}</span>}</form>
      <ul>
        {faculty.map(f => <li key={f._id}>{f.name} ({f.facultyId})</li>)}
      </ul>
    </div>
  )
}

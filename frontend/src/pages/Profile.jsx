import React, { useState, useContext } from 'react'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function Profile() {
  const { user } = useContext(AuthContext)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return alert('Select a file')
    const fd = new FormData()
    fd.append('file', file)
    setLoading(true)
    try {
      const res = await api.post('/upload/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setUploadedUrl(res.data.data.url)
      alert('Uploaded')
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <h2>Profile</h2>
      <div>
        <div>Name: {user?.name}</div>
        <div>Email: {user?.email}</div>
      </div>
      <form onSubmit={submit} style={{ marginTop: 12 }}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload Profile Image'}</button>
      </form>
      {uploadedUrl && <div style={{ marginTop: 12 }}>Uploaded: <a href={uploadedUrl} target="_blank" rel="noreferrer">{uploadedUrl}</a></div>}
    </div>
  )
}

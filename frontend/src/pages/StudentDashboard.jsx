import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'

export default function StudentDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/dashboard/student').then(res => setData(res.data.data)).catch(err => console.error(err))
  }, [])

  return (
    <div className="layout">
      <Sidebar />
      <div className="page">
        <p className="eyebrow">Student portal / Live record</p>
        <h2>Your attendance, at a glance</h2>
        {data ? (
          <div>
            <div className="stat-grid">
              <StatCard title="Overall Attendance %" value={`${data.percentage}%`} />
              <StatCard title="Present Days" value={data.present} />
              <StatCard title="Total Working Days" value={data.total} />
            </div>
            <div className="chart-panel profile-strip"><h3>Profile</h3><div>{data.student?.name} <span className="muted">/ {data.student?.studentId}</span></div></div>
          </div>
        ) : (<p>Loading...</p>)}
      </div>
    </div>
  )
}

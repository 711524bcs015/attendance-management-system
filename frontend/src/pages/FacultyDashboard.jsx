import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import Sidebar from '../components/Sidebar'

export default function FacultyDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/dashboard/faculty').then(res => setData(res.data.data)).catch(err => console.error(err))
  }, [])

  return (
    <div className="layout">
      <Sidebar />
      <div className="page">
        <p className="eyebrow">Faculty portal / Live record</p>
        <h2>Your teaching overview</h2>
        {data ? (
          <div className="stat-grid">
            <StatCard title="Name" value={data.facultyName} />
            <StatCard title="Assigned Subjects" value={data.subjects?.length || 0} />
            <StatCard title="Today's Attendance" value={data.todaysAttendance} small={`${data.presentCount} present`} />
          </div>
        ) : (<p>Loading...</p>)}
      </div>
    </div>
  )
}

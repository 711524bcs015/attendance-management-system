import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import AttendanceTable from '../components/AttendanceTable'
import Sidebar from '../components/Sidebar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    api.get('/dashboard/admin').then(res => setData(res.data.data)).catch(err => console.error(err))
    api.get('/attendance', { params: { limit: 10 } }).then(res => setRecent(res.data.data.records || res.data.data)).catch(() => {})
  }, [])

  return (
    <div className="layout">
      <Sidebar />
      <div className="page">
        <p className="eyebrow">Overview / Administration</p>
        <h2>Good morning, Admin</h2>
        {data ? (
          <div>
            <div className="stat-grid">
              <StatCard title="Total Students" value={data.totalStudents} />
              <StatCard title="Total Faculty" value={data.totalFaculty} />
              <StatCard title="Total Subjects" value={data.totalSubjects} />
              <StatCard title="Today's Attendance" value={data.todaysAttendance} small={`${data.presentCount} present`} />
              <StatCard title="Average Attendance %" value={`${data.averageAttendance}%`} />
            </div>

            <div className="dashboard-charts">
              <div className="chart-panel">
                <h4>Attendance Overview (Last 7 days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.attendanceOverview}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="present" stroke="#22c55e" name="Present" />
                    <Line type="monotone" dataKey="absent" stroke="#ef4444" name="Absent" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-panel">
                <h4>Department-wise Students</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.departmentStudents}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-lower">
              <div className="chart-panel">
                <h4>Attendance Statistics</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.attendanceStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                      {data.attendanceStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#ef4444'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3>Recent Attendance</h3>
                <AttendanceTable records={recent} />
              </div>
            </div>
          </div>
        ) : (<p>Loading...</p>)}
      </div>
    </div>
  )
}

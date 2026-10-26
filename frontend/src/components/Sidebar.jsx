import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {
  const { user } = useContext(AuthContext)
  const home = user?.role === 'admin' ? '/admin' : user?.role === 'faculty' ? '/faculty' : '/student'
  return (
    <aside className="sidebar">
      <div className="sidebar-label">Workspace</div>
      <ul>
        <li><Link to={home}>Dashboard</Link></li>
        {user?.role === 'admin' && <><li><Link to="/students">Students</Link></li><li><Link to="/faculty/list">Faculty</Link></li><li><Link to="/subjects">Subjects</Link></li><li><Link to="/attendance-history">Attendance</Link></li><li><Link to="/reports">Reports</Link></li></>}
        {user?.role === 'faculty' && <li><Link to="/mark-attendance">Mark Attendance</Link></li>}
      </ul>
      <div className="sidebar-footer"><span className="live-dot" /> System operational</div>
    </aside>
  )
}

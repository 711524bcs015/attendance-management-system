import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AdminDashboard from '../pages/AdminDashboard'
import FacultyDashboard from '../pages/FacultyDashboard'
import StudentDashboard from '../pages/StudentDashboard'
import Students from '../pages/Students'
import FacultyList from '../pages/Faculty'
import Subjects from '../pages/Subjects'
import MarkAttendance from '../pages/MarkAttendance'
import AttendanceHistory from '../pages/AttendanceHistory'
import Reports from '../pages/Reports'
import Profile from '../pages/Profile'
import Home from '../pages/Home'
import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute role="admin"><Students /></ProtectedRoute>} />
      <Route path="/faculty/list" element={<ProtectedRoute role="admin"><FacultyList /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute role="admin"><Subjects /></ProtectedRoute>} />
      <Route path="/mark-attendance" element={<ProtectedRoute role="faculty"><MarkAttendance /></ProtectedRoute>} />
      <Route path="/attendance-history" element={<ProtectedRoute role="admin"><AttendanceHistory /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

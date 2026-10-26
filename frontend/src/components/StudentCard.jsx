import React from 'react'

export default function StudentCard({ student }) {
  return (
    <div className="student-card">
      <div className="sc-name">{student.name}</div>
      <div className="sc-meta">{student.studentId} • {student.email}</div>
    </div>
  )
}

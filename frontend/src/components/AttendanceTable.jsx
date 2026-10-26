import React from 'react'

export default function AttendanceTable({ records }) {
  return (
    <table className="attendance-table">
      <thead>
        <tr><th>Date</th><th>Student</th><th>Subject</th><th>Status</th></tr>
      </thead>
      <tbody>
        {records.map(r => (
          <tr key={r._id}>
            <td>{new Date(r.date).toLocaleDateString()}</td>
            <td>{r.student?.name || r.student}</td>
            <td>{r.subject?.subjectName || r.subject}</td>
            <td>{r.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

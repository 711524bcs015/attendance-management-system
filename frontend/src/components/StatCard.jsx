import React from 'react'

export default function StatCard({ title, value, small }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {small && <div className="stat-small">{small}</div>}
    </div>
  )
}

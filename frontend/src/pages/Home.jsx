import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">SAMS / Campus operations</p>
          <h1>Attendance that keeps your campus moving.</h1>
          <p className="hero-lede">A clear, connected workspace for faculty, students, and administrators to turn daily attendance into better decisions.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/login">Open workspace <span aria-hidden="true">-&gt;</span></Link>
            <Link className="text-link" to="/register">Create an account</Link>
          </div>
        </div>
        <div className="hero-panel" aria-label="Attendance overview preview">
          <div className="panel-topline"><span className="live-dot" /> Live campus view <span className="panel-date">Today</span></div>
          <div className="hero-number">92.4<span>%</span></div>
          <p className="muted">Average attendance this week</p>
          <div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="hero-panel-footer"><span>Present <b>1,284</b></span><span>Absent <b className="orange-text">106</b></span></div>
        </div>
      </section>
      <section className="home-features">
        <div><span className="feature-index">01</span><h3>One daily rhythm</h3><p>Faculty mark attendance in seconds and students always know where they stand.</p></div>
        <div><span className="feature-index">02</span><h3>Useful by default</h3><p>Live dashboards turn raw records into attendance patterns your team can act on.</p></div>
        <div><span className="feature-index">03</span><h3>Ready for reports</h3><p>Keep a reliable history and export clean CSV or PDF reports whenever needed.</p></div>
      </section>
    </main>
  )
}
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link className="brand" to="/"><span className="brand-mark">S</span><span>SAMS</span></Link>
        {user && <Link to="/profile">Profile</Link>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.name}</span>
            <button className="button button-ghost" onClick={logout}>Log out</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  )
}

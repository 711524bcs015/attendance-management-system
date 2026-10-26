import React from 'react'
import AppRouter from './router/AppRouter'
import Navbar from './components/Navbar'
import './styles/app.css'

export default function App() {
  return (
    <div>
      <Navbar />
      <AppRouter />
    </div>
  )
}

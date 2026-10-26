import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [captcha, setCaptcha] = useState(() => createCaptcha())
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (Number(captchaAnswer) !== captcha.answer) { setError('Captcha answer is incorrect. Please try again.'); setCaptcha(createCaptcha()); setCaptchaAnswer(''); return }
    setLoading(true)
    try {
      const user = await login(email, password)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'faculty') navigate('/faculty')
      else navigate('/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to connect to the server. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <div className="auth-heading">
          <p className="eyebrow">Attendance Management</p>
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
        <div className="captcha-row"><div className="captcha-question" aria-label="Captcha question">{captcha.question} = ?</div><button type="button" className="captcha-refresh" onClick={() => { setCaptcha(createCaptcha()); setCaptchaAnswer('') }} aria-label="Refresh captcha">Refresh</button></div>
        <label htmlFor="captcha">Security answer</label>
        <input id="captcha" inputMode="numeric" placeholder="Enter the answer" required value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)} />
        <button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}

function createCaptcha() {
  const first = Math.floor(Math.random() * 8) + 2
  const second = Math.floor(Math.random() * 8) + 1
  return { question: `${first} + ${second}`, answer: first + second }
}

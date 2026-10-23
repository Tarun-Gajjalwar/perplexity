import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../auth.slice'

/* ── tiny inline keyframes injected once ── */
const injectStyles = () => {
  if (document.getElementById('register-styles')) return
  const style = document.createElement('style')
  style.id = 'register-styles'
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    .reg-root * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

    @keyframes reg-float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-18px) rotate(2deg); }
      66%       { transform: translateY(-8px) rotate(-1deg); }
    }
    @keyframes reg-pulse-ring {
      0%   { box-shadow: 0 0 0 0 rgba(49,184,198,0.4); }
      70%  { box-shadow: 0 0 0 14px rgba(49,184,198,0); }
      100% { box-shadow: 0 0 0 0 rgba(49,184,198,0); }
    }
    @keyframes reg-fade-up {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes reg-shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes reg-spin-slow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .reg-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      animation: reg-float 8s ease-in-out infinite;
    }
    .reg-blob-1 {
      width: 340px; height: 340px;
      background: radial-gradient(circle, rgba(49,184,198,0.18) 0%, transparent 70%);
      top: -80px; left: -80px;
      animation-delay: 0s;
    }
    .reg-blob-2 {
      width: 260px; height: 260px;
      background: radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%);
      bottom: -60px; right: -60px;
      animation-delay: -3s;
    }
    .reg-blob-3 {
      width: 180px; height: 180px;
      background: radial-gradient(circle, rgba(49,184,198,0.10) 0%, transparent 70%);
      top: 50%; left: 50%;
      animation-delay: -6s;
    }

    .reg-logo-ring {
      animation: reg-pulse-ring 2.5s ease-out infinite;
    }
    .reg-logo-spin {
      animation: reg-spin-slow 12s linear infinite;
    }

    .reg-feature-card {
      animation: reg-fade-up 0.6s ease both;
    }
    .reg-feature-card:nth-child(1) { animation-delay: 0.1s; }
    .reg-feature-card:nth-child(2) { animation-delay: 0.25s; }
    .reg-feature-card:nth-child(3) { animation-delay: 0.4s; }

    .reg-form-wrap {
      animation: reg-fade-up 0.5s ease both;
    }

    .reg-input {
      width: 100%;
      background: rgba(9,9,11,0.7);
      border: 1.5px solid rgba(63,63,70,0.8);
      border-radius: 12px;
      padding: 12px 16px;
      color: #f4f4f5;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .reg-input::placeholder { color: #52525b; }
    .reg-input:focus {
      border-color: #31b8c6;
      box-shadow: 0 0 0 3px rgba(49,184,198,0.2);
    }
    .reg-input:disabled { opacity: 0.55; cursor: not-allowed; }

    .reg-btn {
      width: 100%;
      padding: 13px 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #31b8c6 0%, #1d9eab 100%);
      color: #09090b;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.02em;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .reg-btn::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%);
      background-size: 200% 100%;
      animation: reg-shimmer 2.5s linear infinite;
    }
    .reg-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(49,184,198,0.35); }
    .reg-btn:active:not(:disabled) { transform: translateY(0); }
    .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .reg-divider {
      display: flex; align-items: center; gap: 12px; color: #52525b; font-size: 0.8rem;
    }
    .reg-divider::before, .reg-divider::after {
      content: ''; flex: 1; height: 1px; background: rgba(63,63,70,0.6);
    }
  `
  document.head.appendChild(style)
}



const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showPass, setShowPass] = useState(false)

  const dispatch = useDispatch()
  const { handleRegister } = useAuth()
  const loading = useSelector((state) => state.auth.loading)
  const error   = useSelector((state) => state.auth.error)

  useEffect(() => {
    injectStyles()
    dispatch(setError(null))
  }, [dispatch])

  const submitForm = async (event) => {
    event.preventDefault()
    setSuccessMessage('')
    const payload = { username, email, password }
    const res = await handleRegister(payload)
    if (res?.success) {
      setSuccessMessage(res.data?.message || 'Registration successful! You can now proceed to login.')
      setUsername('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div
      className="reg-root"
      style={{
        minHeight: '100dvh',
        background: '#09090b',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* ── FORM PANEL ── */}
      <div
        style={{
          flex:'1 1 0', minWidth:0, display:'flex',
          alignItems:'center', justifyContent:'center',
          padding:'24px 16px',
          position:'relative', overflow:'hidden',
        }}
      >
        {/* subtle glow behind form */}
        <div style={{
          position:'absolute', width:480, height:480, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(49,184,198,0.07) 0%, transparent 70%)',
          pointerEvents:'none', top:'50%', left:'50%',
          transform:'translate(-50%,-50%)',
        }} />

        <div
          className="reg-form-wrap"
          style={{
            width:'100%', maxWidth:'440px',
            background:'rgba(20,20,23,0.85)',
            border:'1px solid rgba(63,63,70,0.7)',
            borderRadius:'20px',
            padding:'36px 32px',
            backdropFilter:'blur(20px)',
            boxShadow:'0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(49,184,198,0.08)',
            position:'relative', zIndex:1,
          }}
        >
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:'linear-gradient(135deg, #31b8c6, #1d9eab)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color:'#f4f4f5', fontWeight:700, fontSize:'1.1rem' }}>Perplexity</span>
          </div>

          {/* Heading */}
          <div style={{ marginBottom:'28px' }}>
            <h1 style={{
              fontSize:'1.75rem', fontWeight:800, letterSpacing:'-0.03em',
              color:'#f4f4f5', marginBottom:'6px',
            }}>
              Create your account
            </h1>
            <p style={{ color:'#71717a', fontSize:'0.875rem' }}>
              Start exploring answers. Free forever.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom:'20px', padding:'12px 14px',
              borderRadius:'10px', fontSize:'0.85rem',
              background:'rgba(127,29,29,0.3)',
              border:'1px solid rgba(239,68,68,0.35)',
              color:'#fca5a5',
              display:'flex', alignItems:'flex-start', gap:'8px',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ flexShrink:0, marginTop:'1px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div style={{
              marginBottom:'20px', padding:'12px 14px',
              borderRadius:'10px', fontSize:'0.85rem',
              background:'rgba(6,78,59,0.3)',
              border:'1px solid rgba(16,185,129,0.35)',
              color:'#6ee7b7',
            }}>
              <p>{successMessage}</p>
              <Link to="/login" style={{
                marginTop:'8px', display:'inline-block', fontWeight:600,
                color:'#31b8c6', textDecoration:'underline', fontSize:'0.85rem',
              }}>
                Proceed to Login →
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submitForm} style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {/* Username */}
            <div>
              <label htmlFor="username" style={{ display:'block', color:'#a1a1aa', fontSize:'0.8rem', fontWeight:500, marginBottom:'6px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
                Username
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#52525b' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                  </svg>
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Pick a cool username"
                  required
                  disabled={loading}
                  className="reg-input"
                  style={{ paddingLeft:'42px' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display:'block', color:'#a1a1aa', fontSize:'0.8rem', fontWeight:500, marginBottom:'6px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
                Email
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#52525b' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  className="reg-input"
                  style={{ paddingLeft:'42px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display:'block', color:'#a1a1aa', fontSize:'0.8rem', fontWeight:500, marginBottom:'6px', letterSpacing:'0.03em', textTransform:'uppercase' }}>
                Password
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#52525b' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  disabled={loading}
                  className="reg-input"
                  style={{ paddingLeft:'42px', paddingRight:'44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#52525b', padding:4,
                  }}
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <p style={{ color:'#52525b', fontSize:'0.75rem', lineHeight:1.6 }}>
              By registering, you agree to our{' '}
              <span style={{ color:'#31b8c6', cursor:'pointer' }}>Terms of Service</span>{' '}
              and{' '}
              <span style={{ color:'#31b8c6', cursor:'pointer' }}>Privacy Policy</span>.
            </p>

            {/* Submit */}
            <button type="submit" disabled={loading} className="reg-btn" style={{ marginTop:'4px' }}>
              {loading ? (
                <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                    style={{ animation:'reg-spin-slow 0.8s linear infinite' }}>
                    <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
                  </svg>
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="reg-divider" style={{ margin:'24px 0' }}>or</div>

          {/* Login link */}
          <p style={{ textAlign:'center', color:'#71717a', fontSize:'0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#31b8c6', fontWeight:600, textDecoration:'none' }}
              onMouseEnter={e => e.target.style.textDecoration='underline'}
              onMouseLeave={e => e.target.style.textDecoration='none'}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { setError } from '../auth.slice'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()
  const { handleRegister } = useAuth()
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  useEffect(() => {
    dispatch(setError(null))
  }, [dispatch])

  const submitForm = async (event) => {
    event.preventDefault()
    setSuccessMessage('')

    const payload = {
      username,
      email,
      password,
    }

    const res = await handleRegister(payload)
    if (res?.success) {
      setSuccessMessage(res.data?.message || 'Registration successful! You can now proceed to login.')
      setUsername('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <section className="min-h-screen min-h-[100dvh] bg-zinc-950 px-4 py-6 sm:py-10 flex items-center justify-center text-zinc-100">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#31b8c6]">
            Create Account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300">
            Register with your username, email, and password.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs sm:text-sm text-red-300">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg border border-emerald-500/50 bg-emerald-950/40 p-3 text-xs sm:text-sm text-emerald-300">
              <p>{successMessage}</p>
              <Link to="/login" className="mt-2 inline-block font-semibold text-[#31b8c6] underline hover:text-[#45c7d4]">
                Proceed to Login →
              </Link>
            </div>
          )}

          <form onSubmit={submitForm} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-zinc-200">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)] disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-zinc-200">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)] disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-zinc-200">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)] disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl bg-[#31b8c6] px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs sm:text-sm text-zinc-300">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router'
import { setError } from '../auth.slice'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const error = useSelector(state => state.auth.error)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
        dispatch(setError(null))
    }, [dispatch])

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        const res = await handleLogin(payload)
        if (res?.success) {
            navigate("/")
        }

    }

    if (!loading && user) {
        return <Navigate to="/" replace />
    }

    return (
        <section className="min-h-screen min-h-[100dvh] bg-zinc-950 px-4 py-6 sm:py-10 flex items-center justify-center text-zinc-100">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-[#31b8c6]/40 bg-zinc-900/80 p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#31b8c6]">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-zinc-300">
                        Sign in with your email and password.
                    </p>

                    {error && (
                        <div className="mt-4 rounded-lg border border-red-500/50 bg-red-950/40 p-3 text-xs sm:text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitForm} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
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
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
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
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-zinc-100 outline-none ring-0 transition focus:border-[#31b8c6] focus:shadow-[0_0_0_3px_rgba(49,184,198,0.25)]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full cursor-pointer rounded-xl bg-[#31b8c6] px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-zinc-950 transition hover:bg-[#45c7d4] focus:outline-none focus:shadow-[0_0_0_3px_rgba(49,184,198,0.35)] disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs sm:text-sm text-zinc-300">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-[#31b8c6] transition hover:text-[#45c7d4]">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login
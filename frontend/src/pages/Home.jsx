import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Home() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/health')
      .then((res) => setStatus(res.data))
      .catch(() => setError('Backend not reachable — start the Spring Boot server.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">

      {/* Glowing background blob */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        rounded-full bg-brand-700/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-2xl">

        {/* Logo / Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                         bg-brand-900/60 border border-brand-700/50 text-brand-300
                         text-xs font-semibold tracking-widest uppercase">
          🚌 TransitOps
        </span>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-br
                       from-white via-gray-200 to-gray-400 bg-clip-text text-transparent
                       leading-tight">
          Hello TransitOps
        </h1>

        <p className="text-gray-400 text-lg max-w-md">
          Monorepo scaffold is ready. React 18 + Vite frontend connected to the
          Spring Boot 3 backend via <code className="text-brand-400">/api</code>.
        </p>

        {/* Status Card */}
        <div className="card w-full max-w-sm text-left">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3 font-semibold">
            Backend Health
          </p>

          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              Pinging backend…
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400 mt-1 shrink-0" />
              {error}
            </div>
          )}

          {status && (
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {status.message} &mdash; status: {status.status}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="http://localhost:8080/api/health" target="_blank" rel="noreferrer"
             className="btn-primary">
            API Health ↗
          </a>
          <a href="/docs/API.md" target="_blank" rel="noreferrer"
             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                        border border-gray-700 hover:border-gray-500 text-gray-300
                        hover:text-white font-semibold text-sm transition-all duration-200">
            API Docs ↗
          </a>
        </div>

      </div>
    </main>
  )
}

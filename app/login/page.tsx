'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || '로그인에 실패했습니다')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'rgb(10 10 15)' }}
    >
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(139,92,246,0.06) 0%, transparent 60%)',
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{
          background: 'rgb(14 14 24)',
          border: '1px solid rgb(35 35 58)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{
              background: 'rgb(139 92 246 / 0.1)',
              border: '1px solid rgb(139 92 246 / 0.2)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'rgb(167 139 250)' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'rgb(230 228 255)' }}
          >
            아이디어 보관함
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: 'rgb(100 100 140)' }}
          >
            비밀번호를 입력해주세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgb(20 20 35)',
                color: 'rgb(220 220 245)',
                border: error ? '1px solid rgb(239 68 68 / 0.5)' : '1px solid rgb(40 40 65)',
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = 'rgb(139 92 246 / 0.5)'
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = 'rgb(40 40 65)'
              }}
            />
            {error && (
              <p className="text-[12px] mt-2" style={{ color: 'rgb(239 68 68)' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: loading || !password ? 'rgb(30 30 50)' : 'rgb(139 92 246)',
              color: loading || !password ? 'rgb(80 80 110)' : 'white',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

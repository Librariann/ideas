'use client'

import { useState, useEffect } from 'react'

interface TopPick {
  id: number
  name: string
  difficulty: number
  feasibility: number
  opportunity: number
  one_liner: string | null
  bookmarked: boolean
}

interface TopPicksProps {
  onIdeaClick?: (id: number) => void
}

export default function TopPicks({ onIdeaClick }: TopPicksProps) {
  const [picks, setPicks] = useState<TopPick[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPicks() {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        setPicks(data.topPicks || [])
      } catch (err) {
        console.error('Failed to fetch top picks:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPicks()
  }, [])

  if (loading) {
    return (
      <div className="mb-6 rounded-xl p-5" style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}>
        <div className="flex items-center gap-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 h-24 rounded-lg" style={{ background: 'rgb(20 20 35)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (picks.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[13px] font-medium" style={{ color: 'rgb(167 139 250)' }}>
          💎 지금 해볼만한 아이디어
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgb(139 92 246 / 0.12)', color: 'rgb(139 92 246)' }}>
          TOP {picks.length}
        </span>
        <span className="text-[11px] ml-auto" style={{ color: 'rgb(70 70 100)' }}>
          사업성 높고 난이도 낮은 순
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {picks.map((pick, i) => (
          <div
            key={pick.id}
            className="flex-shrink-0 w-[260px] rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'rgb(14 14 24)',
              border: '1px solid rgb(35 35 58)',
            }}
            onClick={() => onIdeaClick?.(pick.id)}
          >
            {/* Rank + name */}
            <div className="flex items-start gap-2.5 mb-2">
              <span
                className="text-[13px] font-bold w-6 h-6 flex items-center justify-center rounded-md shrink-0"
                style={{
                  background: i === 0 ? 'rgb(234 179 8 / 0.15)' : 'rgb(139 92 246 / 0.1)',
                  color: i === 0 ? 'rgb(234 179 8)' : 'rgb(139 92 246)',
                  border: i === 0 ? '1px solid rgb(234 179 8 / 0.3)' : '1px solid rgb(139 92 246 / 0.2)',
                }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: 'rgb(220 220 245)' }}>
                  {pick.name}
                </p>
              </div>
              {pick.bookmarked && <span className="text-[11px] shrink-0">⭐</span>}
            </div>

            {/* One-liner */}
            {pick.one_liner && (
              <p className="text-[11px] leading-relaxed line-clamp-2 mb-3" style={{ color: 'rgb(130 130 170)' }}>
                {pick.one_liner}
              </p>
            )}

            {/* Score bars */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-10 shrink-0" style={{ color: 'rgb(90 90 125)' }}>사업성</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pick.feasibility * 10}%`,
                      background: 'rgb(34 197 94)',
                    }}
                  />
                </div>
                <span className="w-4 text-right" style={{ color: 'rgb(130 130 170)' }}>{pick.feasibility}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="w-10 shrink-0" style={{ color: 'rgb(90 90 125)' }}>난이도</span>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pick.difficulty * 10}%`,
                      background: pick.difficulty >= 8 ? 'rgb(239 68 68)' : pick.difficulty >= 5 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                    }}
                  />
                </div>
                <span className="w-4 text-right" style={{ color: 'rgb(130 130 170)' }}>{pick.difficulty}</span>
              </div>
            </div>

            {/* Opportunity badge */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: pick.opportunity > 0 ? 'rgb(34 197 94 / 0.1)' : 'rgb(234 179 8 / 0.1)',
                  color: pick.opportunity > 0 ? 'rgb(34 197 94)' : 'rgb(234 179 8)',
                  border: `1px solid ${pick.opportunity > 0 ? 'rgb(34 197 94 / 0.2)' : 'rgb(234 179 8 / 0.2)'}`,
                }}
              >
                기회점수 {pick.opportunity > 0 ? '+' : ''}{pick.opportunity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

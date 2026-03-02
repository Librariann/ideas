'use client'

import { useState, useEffect } from 'react'

interface Stats {
  total: number
  archived: number
  bookmarked: number
  avgDifficulty: number
  avgFeasibility: number
  tagDistribution: { tag: string; count: number }[]
  monthlyTrend: { month: string; count: number }[]
}

export default function StatsView() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm" style={{ color: 'rgb(100 100 140)' }}>통계 로딩 중...</div>
      </div>
    )
  }

  if (!stats) return null

  const maxTagCount = Math.max(...stats.tagDistribution.map((t) => t.count), 1)
  const maxMonthCount = Math.max(...stats.monthlyTrend.map((m) => m.count), 1)
  const active = stats.total - stats.archived

  return (
    <div className="flex flex-col gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '전체', value: stats.total, color: 'rgb(139 92 246)' },
          { label: '활성', value: active, color: 'rgb(34 197 94)' },
          { label: '보관됨', value: stats.archived, color: 'rgb(100 100 140)' },
          { label: '즐겨찾기', value: stats.bookmarked, color: 'rgb(234 179 8)' },
        ].map((card) => (
          <div
            key={card.label}
            className="px-4 py-4 rounded-xl"
            style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
          >
            <div className="text-[11px] mb-1" style={{ color: 'rgb(100 100 140)' }}>{card.label}</div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Average scores */}
      <div
        className="px-5 py-4 rounded-xl"
        style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
      >
        <div className="text-[12px] font-medium mb-4" style={{ color: 'rgb(160 155 210)' }}>평균 점수</div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[12px] w-20 shrink-0" style={{ color: 'rgb(110 110 150)' }}>구현 난이도</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${stats.avgDifficulty * 10}%`,
                  background: stats.avgDifficulty >= 7 ? 'rgb(239 68 68)' : stats.avgDifficulty >= 4 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                }}
              />
            </div>
            <span className="text-[13px] font-medium tabular-nums w-8 text-right" style={{ color: 'rgb(200 195 240)' }}>
              {stats.avgDifficulty}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] w-20 shrink-0" style={{ color: 'rgb(110 110 150)' }}>사업 타당성</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${stats.avgFeasibility * 10}%`,
                  background: stats.avgFeasibility >= 7 ? 'rgb(34 197 94)' : stats.avgFeasibility >= 4 ? 'rgb(234 179 8)' : 'rgb(239 68 68)',
                }}
              />
            </div>
            <span className="text-[13px] font-medium tabular-nums w-8 text-right" style={{ color: 'rgb(200 195 240)' }}>
              {stats.avgFeasibility}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag distribution */}
        <div
          className="px-5 py-4 rounded-xl"
          style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
        >
          <div className="text-[12px] font-medium mb-4" style={{ color: 'rgb(160 155 210)' }}>태그 분포</div>
          <div className="flex flex-col gap-2">
            {stats.tagDistribution.map((t) => (
              <div key={t.tag} className="flex items-center gap-2">
                <span className="text-[11px] w-24 truncate shrink-0" style={{ color: 'rgb(130 120 180)' }}>
                  #{t.tag}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(t.count / maxTagCount) * 100}%`,
                      background: 'rgb(139 92 246)',
                    }}
                  />
                </div>
                <span className="text-[11px] tabular-nums w-6 text-right" style={{ color: 'rgb(110 110 150)' }}>
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly trend */}
        <div
          className="px-5 py-4 rounded-xl"
          style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
        >
          <div className="text-[12px] font-medium mb-4" style={{ color: 'rgb(160 155 210)' }}>월별 추이</div>
          <div className="flex items-end gap-2" style={{ height: '180px' }}>
            {stats.monthlyTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[10px] tabular-nums" style={{ color: 'rgb(130 130 170)' }}>{m.count}</span>
                <div
                  className="w-full rounded-t-sm min-h-[4px]"
                  style={{
                    height: `${(m.count / maxMonthCount) * 140}px`,
                    background: 'rgb(139 92 246)',
                    opacity: 0.7,
                  }}
                />
                <span className="text-[9px]" style={{ color: 'rgb(80 80 115)' }}>
                  {m.month.slice(5)}월
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

interface MatrixIdea {
  id: number
  name: string
  difficulty: number
  feasibility: number
  bookmarked: boolean
}

export default function ScatterMatrix() {
  const [data, setData] = useState<MatrixIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/stats')
        const stats = await res.json()
        setData(stats.scoreDistribution || [])
      } catch (err) {
        console.error('Failed to fetch matrix data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm" style={{ color: 'rgb(100 100 140)' }}>매트릭스 로딩 중...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm" style={{ color: 'rgb(100 100 140)' }}>점수 데이터가 있는 아이디어가 없습니다</div>
      </div>
    )
  }

  const padding = { top: 40, right: 30, bottom: 50, left: 55 }
  const width = 700
  const height = 500
  const plotW = width - padding.left - padding.right
  const plotH = height - padding.top - padding.bottom

  const toX = (difficulty: number) => padding.left + ((difficulty - 1) / 9) * plotW
  const toY = (feasibility: number) => padding.top + plotH - ((feasibility - 1) / 9) * plotH

  const hovered = data.find((d) => d.id === hoveredId)

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px]" style={{ color: 'rgb(110 110 150)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgb(139 92 246)' }} />
          <span>일반</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgb(234 179 8)' }} />
          <span>즐겨찾기</span>
        </div>
        <div className="ml-auto" style={{ color: 'rgb(80 80 110)' }}>
          X: 구현 난이도 (낮을수록 쉬움) · Y: 사업 타당성 (높을수록 좋음)
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: '500px' }}>
          {/* Quadrant backgrounds */}
          <rect x={padding.left} y={padding.top} width={plotW / 2} height={plotH / 2} fill="rgb(15 25 15)" opacity={0.3} />
          <rect x={padding.left + plotW / 2} y={padding.top} width={plotW / 2} height={plotH / 2} fill="rgb(25 20 10)" opacity={0.3} />
          <rect x={padding.left} y={padding.top + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgb(20 20 30)" opacity={0.2} />
          <rect x={padding.left + plotW / 2} y={padding.top + plotH / 2} width={plotW / 2} height={plotH / 2} fill="rgb(30 15 15)" opacity={0.3} />

          {/* Quadrant labels */}
          <text x={padding.left + plotW * 0.25} y={padding.top + 20} textAnchor="middle" fill="rgb(60 90 60)" fontSize={11} fontWeight={500}>
            💎 쉬움 + 높은 사업성
          </text>
          <text x={padding.left + plotW * 0.75} y={padding.top + 20} textAnchor="middle" fill="rgb(100 80 40)" fontSize={11} fontWeight={500}>
            ⚠️ 어려움 + 높은 사업성
          </text>
          <text x={padding.left + plotW * 0.25} y={padding.top + plotH - 8} textAnchor="middle" fill="rgb(70 70 100)" fontSize={11} fontWeight={500}>
            🤔 쉬움 + 낮은 사업성
          </text>
          <text x={padding.left + plotW * 0.75} y={padding.top + plotH - 8} textAnchor="middle" fill="rgb(100 50 50)" fontSize={11} fontWeight={500}>
            ❌ 어려움 + 낮은 사업성
          </text>

          {/* Grid lines */}
          {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
            <g key={`grid-${v}`}>
              <line x1={toX(v)} y1={padding.top} x2={toX(v)} y2={padding.top + plotH} stroke="rgb(30 30 50)" strokeWidth={0.5} />
              <line x1={padding.left} y1={toY(v)} x2={padding.left + plotW} y2={toY(v)} stroke="rgb(30 30 50)" strokeWidth={0.5} />
              <text x={toX(v)} y={padding.top + plotH + 18} textAnchor="middle" fill="rgb(80 80 115)" fontSize={11}>{v}</text>
              <text x={padding.left - 10} y={toY(v) + 4} textAnchor="end" fill="rgb(80 80 115)" fontSize={11}>{v}</text>
            </g>
          ))}

          {/* Center cross */}
          <line x1={toX(5.5)} y1={padding.top} x2={toX(5.5)} y2={padding.top + plotH} stroke="rgb(50 50 80)" strokeWidth={1} strokeDasharray="4 4" />
          <line x1={padding.left} y1={toY(5.5)} x2={padding.left + plotW} y2={toY(5.5)} stroke="rgb(50 50 80)" strokeWidth={1} strokeDasharray="4 4" />

          {/* Axis labels */}
          <text x={padding.left + plotW / 2} y={height - 5} textAnchor="middle" fill="rgb(100 100 140)" fontSize={12}>
            구현 난이도 →
          </text>
          <text x={14} y={padding.top + plotH / 2} textAnchor="middle" fill="rgb(100 100 140)" fontSize={12} transform={`rotate(-90, 14, ${padding.top + plotH / 2})`}>
            사업 타당성 →
          </text>

          {/* Data points */}
          {data.map((d) => (
            <g key={d.id}>
              <circle
                cx={toX(d.difficulty)}
                cy={toY(d.feasibility)}
                r={hoveredId === d.id ? 9 : 6}
                fill={d.bookmarked ? 'rgb(234 179 8)' : 'rgb(139 92 246)'}
                opacity={hoveredId === null || hoveredId === d.id ? 0.85 : 0.3}
                stroke={hoveredId === d.id ? 'white' : 'none'}
                strokeWidth={2}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div
          className="text-[13px] px-4 py-3 rounded-lg"
          style={{ background: 'rgb(20 20 35)', border: '1px solid rgb(45 45 70)', color: 'rgb(200 200 230)' }}
        >
          <span className="font-medium">{hovered.name}</span>
          <span className="ml-3" style={{ color: 'rgb(120 120 160)' }}>
            난이도 {hovered.difficulty} · 사업성 {hovered.feasibility}
          </span>
          {hovered.bookmarked && <span className="ml-2">⭐</span>}
        </div>
      )}
    </div>
  )
}

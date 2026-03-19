'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { GameIdea } from '@/lib/types'

const TEAL = 'rgb(20 184 166)'
const TEAL_MUTED = 'rgb(94 234 212 / 0.7)'

interface GameIdeaCardProps {
  idea: GameIdea
  index: number
  onClick: (idea: GameIdea) => void
}

function getGenreColor(genre: string | undefined): string {
  if (!genre) return TEAL
  const g = genre.toLowerCase()
  if (g.includes('퍼즐')) return 'rgb(99 179 237)'
  if (g.includes('로그라이크') || g.includes('로그라이트')) return 'rgb(251 146 60)'
  if (g.includes('디펜스') || g.includes('전략')) return 'rgb(154 103 247)'
  if (g.includes('시뮬레이션')) return 'rgb(52 211 153)'
  if (g.includes('어드벤처') || g.includes('액션')) return 'rgb(251 113 133)'
  if (g.includes('호러') || g.includes('서바이벌')) return 'rgb(239 68 68)'
  return TEAL
}

export default function GameIdeaCard({ idea, index, onClick }: GameIdeaCardProps) {
  const genre = idea.notes?.genre
  const steamTags = idea.notes?.steam?.tags || []
  const accentColor = getGenreColor(genre)
  const createdDate = format(new Date(idea.created_at), 'yy.MM.dd', { locale: ko })

  const genreLabel = genre ? genre.split('(')[0].replace(/\+.*/, '').trim() : null

  return (
    <article
      className="card-hover animate-fade-in cursor-pointer rounded-xl border p-5 flex flex-col gap-3 relative overflow-hidden group"
      style={{
        background: 'rgb(13 18 20)',
        borderColor: 'rgb(28 42 40)',
        animationDelay: `${Math.min(index * 40, 400)}ms`,
        animationFillMode: 'both',
      }}
      onClick={() => onClick(idea)}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2
            className="font-semibold text-[15px] leading-snug truncate"
            style={{ color: 'rgb(220 240 235)' }}
          >
            {idea.idea_name_ko}
          </h2>
          {idea.idea_name_en && (
            <p
              className="text-[12px] mt-0.5 truncate"
              style={{ color: 'rgb(90 120 115)' }}
            >
              {idea.idea_name_en}
            </p>
          )}
        </div>
        <span
          className="text-[11px] shrink-0 mt-0.5"
          style={{ color: 'rgb(70 100 95)' }}
        >
          {createdDate}
        </span>
      </div>

      {genreLabel && (
        <div>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full"
            style={{
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
              border: `1px solid color-mix(in srgb, ${accentColor} 28%, transparent)`,
            }}
          >
            {genreLabel}
          </span>
        </div>
      )}

      {idea.one_liner && (
        <p
          className="text-[13px] leading-relaxed line-clamp-3 flex-1"
          style={{ color: 'rgb(140 165 160)' }}
        >
          {idea.one_liner}
        </p>
      )}

      {(idea.gameplay_novelty_score != null || idea.marketability_score != null || idea.production_scope_score != null) && (
        <div className="flex flex-col gap-1.5 text-[11px]">
          {idea.gameplay_novelty_score != null && (
            <div className="flex items-center gap-1.5">
              <span className="w-10 shrink-0" style={{ color: 'rgb(80 110 105)' }}>참신도</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(20 35 32)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${idea.gameplay_novelty_score * 10}%`, background: TEAL }}
                />
              </div>
              <span style={{ color: 'rgb(100 140 135)' }}>{idea.gameplay_novelty_score}</span>
            </div>
          )}
          {idea.marketability_score != null && (
            <div className="flex items-center gap-1.5">
              <span className="w-10 shrink-0" style={{ color: 'rgb(80 110 105)' }}>시장성</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(20 35 32)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${idea.marketability_score * 10}%`,
                    background: idea.marketability_score >= 7 ? 'rgb(34 197 94)' : idea.marketability_score >= 4 ? 'rgb(234 179 8)' : 'rgb(239 68 68)',
                  }}
                />
              </div>
              <span style={{ color: 'rgb(100 140 135)' }}>{idea.marketability_score}</span>
            </div>
          )}
          {idea.production_scope_score != null && (
            <div className="flex items-center gap-1.5">
              <span className="w-10 shrink-0" style={{ color: 'rgb(80 110 105)' }}>제작범위</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(20 35 32)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${idea.production_scope_score * 10}%`,
                    background: idea.production_scope_score >= 8 ? 'rgb(239 68 68)' : idea.production_scope_score >= 5 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                  }}
                />
              </div>
              <span style={{ color: 'rgb(100 140 135)' }}>{idea.production_scope_score}</span>
            </div>
          )}
        </div>
      )}

      <div
        className="flex items-center justify-between gap-2 mt-auto pt-2"
        style={{ borderTop: '1px solid rgb(22 38 35)' }}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {steamTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgb(14 28 26)',
                color: TEAL_MUTED,
                border: '1px solid rgb(20 184 166 / 0.18)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {idea.engine_tools && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: 'rgb(16 22 20)',
              color: 'rgb(80 120 110)',
              border: '1px solid rgb(30 50 45)',
            }}
          >
            {idea.engine_tools.split(' ')[0]}
          </span>
        )}
      </div>
    </article>
  )
}

'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Idea } from '@/lib/types'

interface IdeaCardProps {
  idea: Idea
  index: number
  onClick: (idea: Idea) => void
}

function getCategoryColor(tags: string[] | undefined): string {
  if (!tags || tags.length === 0) return 'rgb(100 100 130)'
  const tag = tags[0].toLowerCase()
  if (tag.includes('devtool') || tag.includes('github') || tag.includes('code')) return 'rgb(99 179 237)'
  if (tag.includes('ai') || tag.includes('llm') || tag.includes('openai')) return 'rgb(154 103 247)'
  if (tag.includes('saas') || tag.includes('product')) return 'rgb(72 187 120)'
  if (tag.includes('finance') || tag.includes('money') || tag.includes('account')) return 'rgb(246 173 85)'
  if (tag.includes('meeting') || tag.includes('productivity')) return 'rgb(252 129 74)'
  return 'rgb(139 92 246)'
}

export default function IdeaCard({ idea, index, onClick }: IdeaCardProps) {
  const tags = idea.notes?.tags || []
  const accentColor = getCategoryColor(tags)
  const createdDate = format(new Date(idea.created_at), 'yy.MM.dd', { locale: ko })

  return (
    <article
      className="card-hover animate-fade-in cursor-pointer rounded-xl border p-5 flex flex-col gap-3 relative overflow-hidden group"
      style={{
        background: idea.archived ? 'rgb(13 13 20)' : 'rgb(16 16 26)',
        borderColor: idea.archived ? 'rgb(28 28 42)' : 'rgb(35 35 55)',
        opacity: idea.archived ? 0.6 : 1,
        animationDelay: `${Math.min(index * 40, 400)}ms`,
        animationFillMode: 'both',
      }}
      onClick={() => onClick(idea)}
    >
      {/* Gradient accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h2
            className="font-semibold text-[15px] leading-snug truncate"
            style={{ color: 'rgb(220 220 245)' }}
          >
            {idea.idea_name_ko}
          </h2>
          {idea.idea_name_en && (
            <p
              className="text-[12px] mt-0.5 truncate"
              style={{ color: 'rgb(110 110 150)' }}
            >
              {idea.idea_name_en}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          {idea.archived && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded"
              style={{
                background: 'rgb(60 60 80 / 0.5)',
                color: 'rgb(120 120 150)',
              }}
            >
              보관됨
            </span>
          )}
          <span
            className="text-[11px]"
            style={{ color: 'rgb(80 80 110)' }}
          >
            {createdDate}
          </span>
        </div>
      </div>

      {/* One-liner */}
      {idea.one_liner && (
        <p
          className="text-[13px] leading-relaxed line-clamp-3 flex-1"
          style={{ color: 'rgb(150 150 185)' }}
        >
          {idea.one_liner}
        </p>
      )}

      {/* Scores */}
      {(idea.implementation_difficulty_score != null || idea.business_feasibility_score != null) && (
        <div className="flex items-center gap-3 text-[11px]">
          {idea.implementation_difficulty_score != null && (
            <div className="flex items-center gap-1.5 flex-1">
              <span style={{ color: 'rgb(100 100 140)' }}>난이도</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${idea.implementation_difficulty_score * 10}%`,
                    background: idea.implementation_difficulty_score >= 8 ? 'rgb(239 68 68)' : idea.implementation_difficulty_score >= 5 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                  }}
                />
              </div>
              <span style={{ color: 'rgb(130 130 170)' }}>{idea.implementation_difficulty_score}</span>
            </div>
          )}
          {idea.business_feasibility_score != null && (
            <div className="flex items-center gap-1.5 flex-1">
              <span style={{ color: 'rgb(100 100 140)' }}>사업성</span>
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${idea.business_feasibility_score * 10}%`,
                    background: idea.business_feasibility_score >= 7 ? 'rgb(34 197 94)' : idea.business_feasibility_score >= 4 ? 'rgb(234 179 8)' : 'rgb(239 68 68)',
                  }}
                />
              </div>
              <span style={{ color: 'rgb(130 130 170)' }}>{idea.business_feasibility_score}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2" style={{ borderTop: '1px solid rgb(28 28 45)' }}>
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgb(25 25 45)',
                color: 'rgb(130 120 180)',
                border: '1px solid rgb(40 40 70)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Model badge */}
        {idea.model_used && (
          <span
            className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
            style={{
              background: 'rgb(20 20 38)',
              color: 'rgb(100 90 150)',
              border: '1px solid rgb(35 35 60)',
            }}
          >
            {idea.model_used.split('/').pop()?.split('-')[0]}
          </span>
        )}
      </div>
    </article>
  )
}

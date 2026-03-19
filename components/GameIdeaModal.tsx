'use client'

import { useEffect, useCallback, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { GameIdea } from '@/lib/types'

const TEAL = 'rgb(20 184 166)'
const TEAL_LIGHT = 'rgb(94 234 212)'

interface GameIdeaModalProps {
  idea: GameIdea
  onClose: () => void
}

export default function GameIdeaModal({ idea, onClose }: GameIdeaModalProps) {
  const steamTags = idea.notes?.steam?.tags || []
  const genre = idea.notes?.genre
  const platform = idea.notes?.platform
  const coreMechanic = idea.notes?.core_mechanic
  const capsuleShort = idea.notes?.steam?.capsule_short
  const [contentMd, setContentMd] = useState<string | null>(null)
  const [loadingContent, setLoadingContent] = useState(true)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  useEffect(() => {
    let cancelled = false
    async function fetchContent() {
      try {
        const res = await fetch(`/api/game-ideas/${idea.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled) {
          setContentMd(data.content_md || '')
        }
      } catch (err) {
        console.error('Failed to fetch game idea detail:', err)
        if (!cancelled) setContentMd('')
      } finally {
        if (!cancelled) setLoadingContent(false)
      }
    }
    fetchContent()
    return () => { cancelled = true }
  }, [idea.id])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(3, 10, 10, 0.88)', backdropFilter: 'blur(8px)' }}
      />

      <div
        className="animate-slide-up relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'rgb(10 16 18)',
          border: '1px solid rgb(30 55 50)',
          boxShadow: `0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px ${TEAL}14`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex-shrink-0 px-6 pt-6 pb-4"
          style={{ borderBottom: '1px solid rgb(22 42 38)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  background: `${TEAL}18`,
                  color: TEAL_LIGHT,
                  border: `1px solid ${TEAL}30`,
                }}
              >
                {format(new Date(idea.created_at), 'yyyy년 MM월 dd일', { locale: ko })}
              </span>
              {idea.model_used && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(18 30 28)',
                    color: 'rgb(70 110 105)',
                    border: '1px solid rgb(28 50 45)',
                  }}
                >
                  {idea.model_used}
                </span>
              )}
              {platform && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(18 30 28)',
                    color: 'rgb(70 110 105)',
                    border: '1px solid rgb(28 50 45)',
                  }}
                >
                  {platform}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{
                background: 'rgb(18 30 28)',
                color: 'rgb(80 120 115)',
              }}
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: 'rgb(210 238 235)' }}
          >
            {idea.idea_name_ko}
          </h2>
          {idea.idea_name_en && (
            <p
              className="text-sm mt-1"
              style={{ color: 'rgb(80 115 110)' }}
            >
              {idea.idea_name_en}
            </p>
          )}

          {genre && (
            <div className="mt-2">
              <span
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  background: `${TEAL}14`,
                  color: TEAL,
                  border: `1px solid ${TEAL}28`,
                }}
              >
                {genre}
              </span>
            </div>
          )}

          {steamTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {steamTags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(14 28 26)',
                    color: 'rgb(94 234 212 / 0.6)',
                    border: '1px solid rgb(20 184 166 / 0.18)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {(idea.gameplay_novelty_score != null || idea.marketability_score != null || idea.production_scope_score != null) && (
            <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid rgb(22 42 38)' }}>
              {idea.gameplay_novelty_score != null && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] shrink-0" style={{ color: 'rgb(70 110 105)' }}>참신도</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(18 35 32)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${idea.gameplay_novelty_score * 10}%`, background: TEAL }}
                    />
                  </div>
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: TEAL_LIGHT, minWidth: '2ch', textAlign: 'right' }}>
                    {idea.gameplay_novelty_score}
                  </span>
                </div>
              )}
              {idea.marketability_score != null && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] shrink-0" style={{ color: 'rgb(70 110 105)' }}>시장성</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(18 35 32)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${idea.marketability_score * 10}%`,
                        background: idea.marketability_score >= 7 ? 'rgb(34 197 94)' : idea.marketability_score >= 4 ? 'rgb(234 179 8)' : 'rgb(239 68 68)',
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: TEAL_LIGHT, minWidth: '2ch', textAlign: 'right' }}>
                    {idea.marketability_score}
                  </span>
                </div>
              )}
              {idea.production_scope_score != null && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] shrink-0" style={{ color: 'rgb(70 110 105)' }}>제작범위</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(18 35 32)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${idea.production_scope_score * 10}%`,
                        background: idea.production_scope_score >= 8 ? 'rgb(239 68 68)' : idea.production_scope_score >= 5 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: TEAL_LIGHT, minWidth: '2ch', textAlign: 'right' }}>
                    {idea.production_scope_score}
                  </span>
                </div>
              )}
            </div>
          )}

          {(idea.engine_tools || capsuleShort || coreMechanic) && (
            <div className="mt-4 flex flex-col gap-2">
              {capsuleShort && (
                <p
                  className="text-[12px] italic leading-relaxed"
                  style={{ color: 'rgb(100 150 145)' }}
                >
                  &ldquo;{capsuleShort}&rdquo;
                </p>
              )}
              {coreMechanic && (
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: 'rgb(90 130 125)' }}
                >
                  {coreMechanic}
                </p>
              )}
              {idea.engine_tools && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px]" style={{ color: 'rgb(60 95 90)' }}>엔진/도구</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: 'rgb(16 30 28)', color: 'rgb(80 130 120)', border: '1px solid rgb(28 50 45)' }}>
                    {idea.engine_tools}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingContent ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 rounded" style={{ background: 'rgb(20 38 35)', width: '90%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(20 38 35)', width: '75%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(20 38 35)', width: '85%' }} />
              <div className="h-4 rounded mt-2" style={{ background: 'rgb(20 38 35)', width: '60%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(20 38 35)', width: '80%' }} />
            </div>
          ) : contentMd ? (
            <div className="prose-idea">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {contentMd}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'rgb(70 110 105)' }}>
              내용이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

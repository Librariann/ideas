'use client'

import { useEffect, useCallback, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import type { Idea } from '@/lib/types'

interface IdeaModalProps {
  idea: Idea
  onClose: () => void
}

export default function IdeaModal({ idea, onClose }: IdeaModalProps) {
  const tags = idea.notes?.tags || []
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
        const res = await fetch(`/api/ideas/${idea.id}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!cancelled) {
          setContentMd(data.content_md || '')
        }
      } catch (err) {
        console.error('Failed to fetch idea detail:', err)
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
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(5, 5, 15, 0.85)', backdropFilter: 'blur(8px)' }}
      />

      {/* Modal */}
      <div
        className="animate-slide-up relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'rgb(14 14 24)',
          border: '1px solid rgb(40 40 65)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 px-6 pt-6 pb-4"
          style={{ borderBottom: '1px solid rgb(28 28 45)' }}
        >
          {/* Close + meta row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[11px] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgb(139 92 246 / 0.12)',
                  color: 'rgb(167 139 250)',
                  border: '1px solid rgb(139 92 246 / 0.2)',
                }}
              >
                {format(new Date(idea.created_at), 'yyyy년 MM월 dd일', { locale: ko })}
              </span>
              {idea.model_used && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(25 25 45)',
                    color: 'rgb(100 100 140)',
                    border: '1px solid rgb(40 40 65)',
                  }}
                >
                  {idea.model_used}
                </span>
              )}
              {idea.archived && (
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(60 60 80 / 0.3)',
                    color: 'rgb(140 140 165)',
                    border: '1px solid rgb(60 60 80 / 0.5)',
                  }}
                >
                  보관됨
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{
                background: 'rgb(25 25 42)',
                color: 'rgb(120 120 160)',
              }}
              aria-label="닫기"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Title */}
          <h2
            className="text-xl font-bold leading-tight"
            style={{ color: 'rgb(230 228 255)' }}
          >
            {idea.idea_name_ko}
          </h2>
          {idea.idea_name_en && (
            <p
              className="text-sm mt-1"
              style={{ color: 'rgb(110 110 155)' }}
            >
              {idea.idea_name_en}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgb(25 22 50)',
                    color: 'rgb(140 120 200)',
                    border: '1px solid rgb(50 40 90)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Scores */}
          {(idea.implementation_difficulty_score != null || idea.business_feasibility_score != null) && (
            <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: '1px solid rgb(28 28 45)' }}>
              {idea.implementation_difficulty_score != null && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] shrink-0" style={{ color: 'rgb(110 110 150)' }}>구현 난이도</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${idea.implementation_difficulty_score * 10}%`,
                        background: idea.implementation_difficulty_score >= 8 ? 'rgb(239 68 68)' : idea.implementation_difficulty_score >= 5 ? 'rgb(234 179 8)' : 'rgb(34 197 94)',
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: 'rgb(160 155 210)', minWidth: '2ch', textAlign: 'right' }}>{idea.implementation_difficulty_score}</span>
                </div>
              )}
              {idea.business_feasibility_score != null && (
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] shrink-0" style={{ color: 'rgb(110 110 150)' }}>사업 타당성</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgb(25 25 45)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${idea.business_feasibility_score * 10}%`,
                        background: idea.business_feasibility_score >= 7 ? 'rgb(34 197 94)' : idea.business_feasibility_score >= 4 ? 'rgb(234 179 8)' : 'rgb(239 68 68)',
                      }}
                    />
                  </div>
                  <span className="text-[12px] font-medium tabular-nums" style={{ color: 'rgb(160 155 210)', minWidth: '2ch', textAlign: 'right' }}>{idea.business_feasibility_score}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingContent ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 rounded" style={{ background: 'rgb(30 30 50)', width: '90%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(30 30 50)', width: '75%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(30 30 50)', width: '85%' }} />
              <div className="h-4 rounded mt-2" style={{ background: 'rgb(30 30 50)', width: '60%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(30 30 50)', width: '80%' }} />
              <div className="h-4 rounded" style={{ background: 'rgb(30 30 50)', width: '70%' }} />
            </div>
          ) : contentMd ? (
            <div className="prose-idea">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
              >
                {contentMd}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'rgb(100 100 140)' }}>
              내용이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

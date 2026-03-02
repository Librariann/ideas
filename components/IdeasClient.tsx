'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import IdeaCard from './IdeaCard'
import IdeaModal from './IdeaModal'
import SearchBar from './SearchBar'
import TagFilter from './TagFilter'
import SortSelect from './SortSelect'
import ScatterMatrix from './ScatterMatrix'
import StatsView from './StatsView'
import type { Idea } from '@/lib/types'

type ViewMode = 'cards' | 'matrix' | 'stats'

interface IdeasClientProps {
  initialIdeas: Idea[]
  initialTotal: number
  tags: string[]
}

export default function IdeasClient({ initialIdeas, initialTotal, tags }: IdeasClientProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [archivedFilter, setArchivedFilter] = useState<'all' | 'false' | 'true'>('all')
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('cards')
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialTotal > initialIdeas.length)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchIdeas = useCallback(async (s: string, tag: string, p: number, archived: string, sortBy: string, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (s) params.set('search', s)
      if (tag) params.set('tag', tag)
      if (archived !== 'all') params.set('archived', archived)
      if (sortBy !== 'newest') params.set('sort', sortBy)
      params.set('page', String(p))
      params.set('limit', '24')

      const res = await fetch(`/api/ideas?${params}`)
      const data = await res.json()

      if (append) {
        setIdeas((prev) => [...prev, ...data.ideas])
      } else {
        setIdeas(data.ideas)
      }
      setTotal(data.total)
      setHasMore(data.ideas.length === 24 && (append ? ideas.length + data.ideas.length : data.ideas.length) < data.total)
    } catch (err) {
      console.error('Failed to fetch ideas:', err)
    } finally {
      setLoading(false)
    }
  }, [ideas.length])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchIdeas(search, selectedTag, 1, archivedFilter, sort, false)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTag, archivedFilter, sort])

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    setPage(1)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchIdeas(search, selectedTag, nextPage, archivedFilter, sort, true)
  }

  const handleBookmark = async (id: number) => {
    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, bookmarked: updated.bookmarked } : idea)))
    } catch (err) {
      console.error('Failed to toggle bookmark:', err)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedTag('')
    setArchivedFilter('all')
    setSort('newest')
  }

  const hasActiveFilters = search || selectedTag || archivedFilter !== 'all' || sort !== 'newest'

  return (
    <>
      {/* View mode tabs */}
      <div
        className="mb-5 flex items-center gap-1 p-1 rounded-lg"
        style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
      >
        {([
          { value: 'cards' as const, label: '카드 뷰', icon: '▦' },
          { value: 'matrix' as const, label: '매트릭스', icon: '⊞' },
          { value: 'stats' as const, label: '통계', icon: '◔' },
        ]).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setViewMode(tab.value)}
            className="flex-1 px-4 py-2 text-[13px] font-medium rounded-md transition-all flex items-center justify-center gap-1.5"
            style={{
              background: viewMode === tab.value ? 'rgb(139 92 246 / 0.15)' : 'transparent',
              color: viewMode === tab.value ? 'rgb(167 139 250)' : 'rgb(90 90 125)',
              border: viewMode === tab.value ? '1px solid rgb(139 92 246 / 0.25)' : '1px solid transparent',
            }}
          >
            <span className="text-[12px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matrix / Stats views */}
      {viewMode === 'matrix' && <ScatterMatrix />}
      {viewMode === 'stats' && <StatsView />}

      {/* Cards view */}
      {viewMode === 'cards' && (
        <>
          {/* Archived tabs */}
          <div
            className="mb-4 flex items-center gap-1 p-1 rounded-lg"
            style={{ background: 'rgb(14 14 24)', border: '1px solid rgb(30 30 50)' }}
          >
            {([
              { value: 'all' as const, label: '전체' },
              { value: 'false' as const, label: '활성' },
              { value: 'true' as const, label: '보관됨' },
            ]).map((tab) => (
              <button
                key={tab.value}
                onClick={() => { setArchivedFilter(tab.value); setPage(1) }}
                className="flex-1 px-4 py-2 text-[13px] font-medium rounded-md transition-all"
                style={{
                  background: archivedFilter === tab.value ? 'rgb(139 92 246 / 0.15)' : 'transparent',
                  color: archivedFilter === tab.value ? 'rgb(167 139 250)' : 'rgb(90 90 125)',
                  border: archivedFilter === tab.value ? '1px solid rgb(139 92 246 / 0.25)' : '1px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} total={total} />
              </div>
              <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1) }} />
            </div>
            <TagFilter tags={tags} selected={selectedTag} onSelect={handleTagSelect} />
          </div>

          {/* Stats bar */}
          <div
            className="mb-5 flex items-center justify-between text-xs"
            style={{ color: 'rgb(80 80 115)' }}
          >
            <span>
              {loading ? '검색 중...' : `총 ${total}개의 아이디어`}
              {(search || selectedTag) && !loading && ` 검색됨`}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: 'rgb(139 92 246)' }}
              >
                필터 초기화
              </button>
            )}
          </div>

          {/* Grid */}
          {ideas.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgb(20 20 38)', border: '1px solid rgb(35 35 60)' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: 'rgb(80 80 120)' }}>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M19 19l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ color: 'rgb(100 100 140)' }}>검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ideas.map((idea, i) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={i}
                  onClick={setSelectedIdea}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: loading ? 'rgb(22 22 38)' : 'rgb(139 92 246 / 0.12)',
                  color: loading ? 'rgb(80 80 110)' : 'rgb(167 139 250)',
                  border: `1px solid ${loading ? 'rgb(32 32 52)' : 'rgb(139 92 246 / 0.25)'}`,
                }}
              >
                {loading ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedIdea && (
        <IdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </>
  )
}

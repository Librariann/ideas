'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import GameIdeaCard from './GameIdeaCard'
import GameIdeaModal from './GameIdeaModal'
import SearchBar from './SearchBar'
import TagFilter from './TagFilter'
import SortSelect from './SortSelect'
import type { GameIdea } from '@/lib/types'

const GAME_SORT_OPTIONS = [
  { value: 'newest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'novelty-desc', label: '참신도 높은순' },
  { value: 'novelty-asc', label: '참신도 낮은순' },
  { value: 'market-desc', label: '시장성 높은순' },
  { value: 'market-asc', label: '시장성 낮은순' },
  { value: 'scope-asc', label: '제작범위 작은순' },
  { value: 'scope-desc', label: '제작범위 큰순' },
]

interface GameIdeasClientProps {
  initialIdeas: GameIdea[]
  initialTotal: number
  tags: string[]
}

export default function GameIdeasClient({ initialIdeas, initialTotal, tags }: GameIdeasClientProps) {
  const [ideas, setIdeas] = useState<GameIdea[]>(initialIdeas)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [sort, setSort] = useState('newest')
  const [selectedIdea, setSelectedIdea] = useState<GameIdea | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialTotal > initialIdeas.length)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchIdeas = useCallback(async (s: string, tag: string, p: number, sortBy: string, append = false) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (s) params.set('search', s)
      if (tag) params.set('tag', tag)
      if (sortBy !== 'newest') params.set('sort', sortBy)
      params.set('page', String(p))
      params.set('limit', '24')

      const res = await fetch(`/api/game-ideas?${params}`)
      const data = await res.json()

      if (append) {
        setIdeas((prev) => [...prev, ...data.ideas])
      } else {
        setIdeas(data.ideas)
      }
      setTotal(data.total)
      setHasMore(data.ideas.length === 24 && (append ? ideas.length + data.ideas.length : data.ideas.length) < data.total)
    } catch (err) {
      console.error('Failed to fetch game ideas:', err)
    } finally {
      setLoading(false)
    }
  }, [ideas.length])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetchIdeas(search, selectedTag, 1, sort, false)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTag, sort])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchIdeas(search, selectedTag, nextPage, sort, true)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedTag('')
    setSort('newest')
  }

  const hasActiveFilters = search || selectedTag || sort !== 'newest'

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} total={total} />
          </div>
          <SortSelect value={sort} onChange={(v) => { setSort(v); setPage(1) }} options={GAME_SORT_OPTIONS} />
        </div>
        <TagFilter tags={tags} selected={selectedTag} onSelect={(tag) => { setSelectedTag(tag); setPage(1) }} />
      </div>

      <div
        className="mb-5 flex items-center justify-between text-xs"
        style={{ color: 'rgb(70 110 105)' }}
      >
        <span>
          {loading ? '검색 중...' : `총 ${total}개의 게임 아이디어`}
          {(search || selectedTag) && !loading && ` 검색됨`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: 'rgb(20 184 166)' }}
          >
            필터 초기화
          </button>
        )}
      </div>

      {ideas.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgb(14 22 20)', border: '1px solid rgb(28 50 45)' }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: 'rgb(50 100 90)' }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M19 19l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ color: 'rgb(70 110 105)' }}>검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ideas.map((idea, i) => (
            <GameIdeaCard
              key={idea.id}
              idea={idea}
              index={i}
              onClick={setSelectedIdea}
            />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: loading ? 'rgb(16 26 24)' : 'rgb(20 184 166 / 0.12)',
              color: loading ? 'rgb(60 100 95)' : 'rgb(94 234 212)',
              border: `1px solid ${loading ? 'rgb(24 45 42)' : 'rgb(20 184 166 / 0.25)'}`,
            }}
          >
            {loading ? '불러오는 중...' : '더 보기'}
          </button>
        </div>
      )}

      {selectedIdea && (
        <GameIdeaModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}
    </>
  )
}

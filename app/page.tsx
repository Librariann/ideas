export const dynamic = 'force-dynamic'

import { query } from '@/lib/db'
import type { Idea } from '@/lib/types'
import IdeasClient from '@/components/IdeasClient'

async function getInitialData() {
  const [ideasResult, countResult, tagsResult] = await Promise.all([
    query<Idea>(
      `SELECT id, created_at, idea_name_ko, idea_name_en, one_liner, cadence_hours, model_used, notes, implementation_difficulty_score, business_feasibility_score, archived
       FROM toy_project_ideas
       ORDER BY archived ASC, created_at DESC
       LIMIT 24`
    ),
    query<{ count: string }>('SELECT COUNT(*) as count FROM toy_project_ideas'),
    query<{ tag: string }>(
      `SELECT DISTINCT jsonb_array_elements_text(notes->'tags') as tag
       FROM toy_project_ideas
       WHERE notes->'tags' IS NOT NULL
       ORDER BY tag`
    ).catch(() => [] as { tag: string }[]),
  ])

  return {
    ideas: ideasResult,
    total: parseInt(countResult[0]?.count || '0'),
    tags: tagsResult.map((r) => r.tag).filter(Boolean),
  }
}

export default async function Home() {
  const { ideas, total, tags } = await getInitialData()

  return (
    <div
      className="min-h-screen"
      style={{ background: 'rgb(10 10 15)' }}
    >
      {/* Background noise texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.08) 0%, transparent 60%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-4"
                style={{
                  background: 'rgb(139 92 246 / 0.1)',
                  border: '1px solid rgb(139 92 246 / 0.2)',
                  color: 'rgb(167 139 250)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'rgb(167 139 250)' }}
                />
                {total}개 아이디어 수집됨
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{
                  color: 'rgb(240 238 255)',
                  letterSpacing: '-0.02em',
                }}
              >
                아이디어 보관함
              </h1>
              <p
                className="mt-2 text-sm"
                style={{ color: 'rgb(100 100 140)' }}
              >
                축적된 생각들, 언젠가 현실이 될 씨앗들
              </p>
            </div>
          </div>
        </header>

        {/* Client component for interactivity */}
        <IdeasClient
          initialIdeas={ideas}
          initialTotal={total}
          tags={tags}
        />
      </div>

      {/* Footer */}
      <footer
        className="mt-20 py-8 text-center text-xs"
        style={{
          borderTop: '1px solid rgb(22 22 38)',
          color: 'rgb(60 60 90)',
        }}
      >
        ideas vault &mdash; built with Next.js
      </footer>
    </div>
  )
}

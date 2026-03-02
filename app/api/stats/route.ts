import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalResult,
      archivedResult,
      bookmarkedResult,
      avgScoresResult,
      tagDistResult,
      monthlyResult,
      scoreDistResult,
      topPicksResult,
    ] = await Promise.all([
      query<{ count: string }>('SELECT COUNT(*) as count FROM toy_project_ideas'),
      query<{ count: string }>('SELECT COUNT(*) as count FROM toy_project_ideas WHERE archived = true'),
      query<{ count: string }>('SELECT COUNT(*) as count FROM toy_project_ideas WHERE bookmarked = true'),
      query<{ avg_difficulty: string; avg_feasibility: string }>(
        `SELECT
          ROUND(AVG(implementation_difficulty_score)::numeric, 1) as avg_difficulty,
          ROUND(AVG(business_feasibility_score)::numeric, 1) as avg_feasibility
         FROM toy_project_ideas
         WHERE implementation_difficulty_score IS NOT NULL`
      ),
      query<{ tag: string; count: string }>(
        `SELECT tag, COUNT(*) as count
         FROM (
           SELECT jsonb_array_elements_text(notes->'tags') as tag
           FROM toy_project_ideas
           WHERE notes->'tags' IS NOT NULL
         ) t
         GROUP BY tag
         ORDER BY count DESC
         LIMIT 15`
      ),
      query<{ month: string; count: string }>(
        `SELECT to_char(created_at, 'YYYY-MM') as month, COUNT(*) as count
         FROM toy_project_ideas
         GROUP BY month
         ORDER BY month DESC
         LIMIT 12`
      ),
      query<{ difficulty: number; feasibility: number; id: number; name: string; bookmarked: boolean }>(
        `SELECT id, idea_name_ko as name, implementation_difficulty_score as difficulty,
                business_feasibility_score as feasibility, bookmarked
         FROM toy_project_ideas
         WHERE implementation_difficulty_score IS NOT NULL
           AND business_feasibility_score IS NOT NULL
         ORDER BY created_at DESC`
      ),
      query<{ id: number; name: string; difficulty: number; feasibility: number; opportunity: number; one_liner: string | null; bookmarked: boolean }>(
        `SELECT id, idea_name_ko as name, implementation_difficulty_score as difficulty,
                business_feasibility_score as feasibility,
                (business_feasibility_score - implementation_difficulty_score) as opportunity,
                one_liner, bookmarked
         FROM toy_project_ideas
         WHERE implementation_difficulty_score IS NOT NULL
           AND business_feasibility_score IS NOT NULL
           AND archived = false
         ORDER BY opportunity DESC, business_feasibility_score DESC
         LIMIT 5`
      ),
    ])

    return NextResponse.json({
      total: parseInt(totalResult[0]?.count || '0'),
      archived: parseInt(archivedResult[0]?.count || '0'),
      bookmarked: parseInt(bookmarkedResult[0]?.count || '0'),
      avgDifficulty: parseFloat(avgScoresResult[0]?.avg_difficulty || '0'),
      avgFeasibility: parseFloat(avgScoresResult[0]?.avg_feasibility || '0'),
      tagDistribution: tagDistResult.map((r) => ({ tag: r.tag, count: parseInt(r.count) })),
      monthlyTrend: monthlyResult.map((r) => ({ month: r.month, count: parseInt(r.count) })).reverse(),
      scoreDistribution: scoreDistResult,
      topPicks: topPicksResult,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

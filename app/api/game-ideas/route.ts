import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { GameIdea } from '@/lib/types'

const SORT_OPTIONS: Record<string, string> = {
  newest: 'created_at DESC',
  oldest: 'created_at ASC',
  'novelty-desc': 'gameplay_novelty_score DESC NULLS LAST, created_at DESC',
  'novelty-asc': 'gameplay_novelty_score ASC NULLS LAST, created_at DESC',
  'market-desc': 'marketability_score DESC NULLS LAST, created_at DESC',
  'market-asc': 'marketability_score ASC NULLS LAST, created_at DESC',
  'scope-asc': 'production_scope_score ASC NULLS LAST, created_at DESC',
  'scope-desc': 'production_scope_score DESC NULLS LAST, created_at DESC',
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '24')
    const offset = (page - 1) * limit

    let whereClause = 'WHERE 1=1'
    const params: unknown[] = []
    let paramIndex = 1

    if (search) {
      whereClause += ` AND (idea_name_ko ILIKE $${paramIndex} OR idea_name_en ILIKE $${paramIndex} OR one_liner ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (tag) {
      whereClause += ` AND notes->'steam'->'tags' @> $${paramIndex}::jsonb`
      params.push(JSON.stringify([tag]))
      paramIndex++
    }

    const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM indie_game_ideas ${whereClause}`,
      params
    )
    const total = parseInt(countResult[0]?.count || '0')

    const ideas = await query<GameIdea>(
      `SELECT id, created_at, idea_name_ko, idea_name_en, one_liner, cadence_hours, model_used, notes, gameplay_novelty_score, production_scope_score, marketability_score, engine_tools
       FROM indie_game_ideas
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    )

    return NextResponse.json({ ideas, total, page, limit })
  } catch (error) {
    console.error('Error fetching game ideas:', error)
    return NextResponse.json({ error: 'Failed to fetch game ideas' }, { status: 500 })
  }
}

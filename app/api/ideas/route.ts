import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { Idea } from '@/lib/types'

const SORT_OPTIONS: Record<string, string> = {
  newest: 'archived ASC, created_at DESC',
  oldest: 'archived ASC, created_at ASC',
  'difficulty-asc': 'archived ASC, implementation_difficulty_score ASC NULLS LAST, created_at DESC',
  'difficulty-desc': 'archived ASC, implementation_difficulty_score DESC NULLS LAST, created_at DESC',
  'feasibility-asc': 'archived ASC, business_feasibility_score ASC NULLS LAST, created_at DESC',
  'feasibility-desc': 'archived ASC, business_feasibility_score DESC NULLS LAST, created_at DESC',
  bookmarked: 'bookmarked DESC, archived ASC, created_at DESC',
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const tag = searchParams.get('tag') || ''
    const archived = searchParams.get('archived') || 'all'
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
      whereClause += ` AND notes->'tags' @> $${paramIndex}::jsonb`
      params.push(JSON.stringify([tag]))
      paramIndex++
    }

    if (archived === 'true') {
      whereClause += ` AND archived = true`
    } else if (archived === 'false') {
      whereClause += ` AND archived = false`
    }

    const orderBy = SORT_OPTIONS[sort] || SORT_OPTIONS.newest

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM toy_project_ideas ${whereClause}`,
      params
    )
    const total = parseInt(countResult[0]?.count || '0')

    const ideas = await query<Idea>(
      `SELECT id, created_at, idea_name_ko, idea_name_en, one_liner, cadence_hours, model_used, notes, implementation_difficulty_score, business_feasibility_score, archived, bookmarked
       FROM toy_project_ideas
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    )

    return NextResponse.json({ ideas, total, page, limit })
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 })
  }
}

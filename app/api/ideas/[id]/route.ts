import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { Idea } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ideas = await query<Idea>(
      `SELECT * FROM toy_project_ideas WHERE id = $1`,
      [parseInt(id)]
    )

    if (ideas.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    return NextResponse.json(ideas[0])
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json({ error: 'Failed to fetch idea' }, { status: 500 })
  }
}

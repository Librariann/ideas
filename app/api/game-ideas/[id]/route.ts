import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import type { GameIdea } from '@/lib/types'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const ideas = await query<GameIdea>(
      `SELECT * FROM indie_game_ideas WHERE id = $1`,
      [parseInt(id)]
    )

    if (ideas.length === 0) {
      return NextResponse.json({ error: 'Game idea not found' }, { status: 404 })
    }

    return NextResponse.json(ideas[0])
  } catch (error) {
    console.error('Error fetching game idea:', error)
    return NextResponse.json({ error: 'Failed to fetch game idea' }, { status: 500 })
  }
}

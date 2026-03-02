import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const result = await query<{ tag: string }>(
      `SELECT DISTINCT jsonb_array_elements_text(notes->'tags') as tag
       FROM toy_project_ideas
       WHERE notes->'tags' IS NOT NULL
       ORDER BY tag`
    )
    const tags = result.map((r) => r.tag)
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

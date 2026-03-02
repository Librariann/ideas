import { NextRequest, NextResponse } from 'next/server'
import { createToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const envPassword = process.env.AUTH_PASSWORD

    if (!envPassword) {
      return NextResponse.json({ error: 'AUTH_PASSWORD not configured' }, { status: 500 })
    }

    if (password !== envPassword) {
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다' }, { status: 401 })
    }

    const token = createToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

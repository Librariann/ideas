import { createHmac } from 'crypto'

const AUTH_SECRET = process.env.AUTH_SECRET || 'fallback-secret'

export function createToken(): string {
  const payload = `authenticated:${Date.now()}`
  const signature = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64')
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const lastColon = decoded.lastIndexOf(':')
    if (lastColon === -1) return false

    const payload = decoded.slice(0, lastColon)
    const signature = decoded.slice(lastColon + 1)

    const expected = createHmac('sha256', AUTH_SECRET).update(payload).digest('hex')
    return signature === expected
  } catch {
    return false
  }
}

export const AUTH_COOKIE_NAME = 'ideas_auth'

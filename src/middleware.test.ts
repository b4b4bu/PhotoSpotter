import { describe, it, expect } from 'vitest'
import { issueToken } from '@/lib/auth/service'
import { middleware } from './middleware'
import { NextRequest } from 'next/server'

describe('auth middleware', () => {
  // ─── Cycle 14: no session cookie → 401 ────────────────────────────────────
  it('returns 401 when there is no session cookie', async () => {
    const req = new NextRequest('http://localhost/api/spots')
    const res = await middleware(req)
    expect(res.status).toBe(401)
  })

  // ─── Cycle 15: valid session cookie → passes through ─────────────────────
  it('passes through requests with a valid session cookie', async () => {
    const token = await issueToken('user-99')
    const req = new NextRequest('http://localhost/api/spots', {
      headers: { Cookie: `session=${token}` },
    })
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })

  // ─── Auth routes are always public ────────────────────────────────────────
  it('passes through /api/auth routes without a cookie', async () => {
    const req = new NextRequest('http://localhost/api/auth/login')
    const res = await middleware(req)
    expect(res.status).not.toBe(401)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

import { POST } from './route'
import prisma from '@/lib/prisma'

describe('POST /api/auth/register', () => {
  beforeEach(() => vi.clearAllMocks())

  // ─── Cycle 9: successful registration ────────────────────────────────────
  it('returns 201 and sets an httpOnly session cookie', async () => {
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: 'new-user',
      email: 'alice@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
    })

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'password123' }),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.userId).toBe('new-user')

    const cookie = res.headers.get('set-cookie')
    expect(cookie).toContain('session=')
    expect(cookie?.toLowerCase()).toContain('httponly')
  })

  // ─── Cycle 10: duplicate email → 409 ──────────────────────────────────────
  it('returns 409 when the email is already registered', async () => {
    vi.mocked(prisma.user.create).mockRejectedValue({ code: 'P2002' })

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'taken@example.com', password: 'password123' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(409)
  })
})

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'

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

let storedHash: string
beforeAll(async () => {
  storedHash = await bcrypt.hash('correct-password', 1)
})

describe('POST /api/auth/login', () => {
  beforeEach(() => vi.clearAllMocks())

  // ─── Cycle 11: successful login ────────────────────────────────────────────
  it('returns 200 and sets an httpOnly session cookie for valid credentials', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'user-1',
      email: 'alice@example.com',
      passwordHash: storedHash,
      createdAt: new Date(),
    })

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alice@example.com', password: 'correct-password' }),
    })

    const res = await POST(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.userId).toBe('user-1')

    const cookie = res.headers.get('set-cookie')
    expect(cookie).toContain('session=')
    expect(cookie?.toLowerCase()).toContain('httponly')
  })

  // ─── Cycle 12: bad credentials → 401 ─────────────────────────────────────
  it('returns 401 for invalid credentials', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@example.com', password: 'wrong' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })
})

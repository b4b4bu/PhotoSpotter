import { describe, it, expect } from 'vitest'
import { POST } from './route'

describe('POST /api/auth/logout', () => {
  // ─── Cycle 13: logout clears the session cookie ───────────────────────────
  it('returns 200 and expires the session cookie', async () => {
    const req = new Request('http://localhost/api/auth/logout', { method: 'POST' })
    const res = await POST(req)

    expect(res.status).toBe(200)

    const cookie = res.headers.get('set-cookie')
    expect(cookie).toContain('session=')
    expect(cookie).toContain('Max-Age=0')
  })
})

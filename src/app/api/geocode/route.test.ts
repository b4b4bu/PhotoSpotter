import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/geocoding/nominatim', () => ({
  fetchNominatim: vi.fn(),
}))

import { GET } from './route'
import { fetchNominatim } from '@/lib/geocoding/nominatim'

const nominatimResult = {
  lat: '48.8566',
  lon: '2.3522',
  display_name: 'Paris, Île-de-France, France',
}

describe('GET /api/geocode', () => {
  beforeEach(() => vi.clearAllMocks())

  // ─── Cycle 3: valid query returns location ─────────────────────────────────
  it('returns lat, lng, and displayName for a valid query', async () => {
    vi.mocked(fetchNominatim).mockResolvedValue([nominatimResult])

    const req = new Request('http://localhost/api/geocode?q=Paris')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.lat).toBeCloseTo(48.8566)
    expect(body.lng).toBeCloseTo(2.3522)
    expect(body.displayName).toBe('Paris, Île-de-France, France')
  })

  // ─── Cycle 4: unresolvable query → 404 ────────────────────────────────────
  it('returns 404 when the location cannot be resolved', async () => {
    vi.mocked(fetchNominatim).mockResolvedValue([])

    const req = new Request('http://localhost/api/geocode?q=xyznotaplace')
    const res = await GET(req)

    expect(res.status).toBe(404)
  })

  // ─── Cycle 5: missing q param → 400 ──────────────────────────────────────
  it('returns 400 when the q parameter is missing', async () => {
    const req = new Request('http://localhost/api/geocode')
    const res = await GET(req)

    expect(res.status).toBe(400)
  })
})

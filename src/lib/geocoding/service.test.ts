import { describe, it, expect, vi } from 'vitest'
import { geocode } from './service'
import { NoResultsError } from './errors'

const nominatimResult = {
  lat: '51.5074',
  lon: '-0.1278',
  display_name: 'London, Greater London, England, United Kingdom',
}

// ─── Cycle 1: resolves a query to lat/lng and display name ─────────────────
describe('geocode', () => {
  it('returns lat, lng, and displayName for a resolvable query', async () => {
    const fetchResults = vi.fn().mockResolvedValue([nominatimResult])

    const result = await geocode('London', fetchResults)

    expect(result.lat).toBeCloseTo(51.5074)
    expect(result.lng).toBeCloseTo(-0.1278)
    expect(result.displayName).toBe('London, Greater London, England, United Kingdom')
  })

  // ─── Cycle 2: empty results → NoResultsError ──────────────────────────────
  it('throws NoResultsError when Nominatim returns no results', async () => {
    const fetchResults = vi.fn().mockResolvedValue([])

    await expect(geocode('xyznotaplace', fetchResults)).rejects.toThrow(NoResultsError)
  })
})

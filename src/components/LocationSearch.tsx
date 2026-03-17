'use client'

import { useState } from 'react'

type GeoResult = {
  lat: number
  lng: number
  displayName: string
}

export function LocationSearch() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<GeoResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [radius, setRadius] = useState(10)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
      if (!res.ok) {
        setError('Location not found. Try a different search.')
      } else {
        setResult(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="location-search">Location</label>
        <input
          id="location-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {result && (
        <div>
          <p>{result.displayName}</p>
          <label htmlFor="radius-slider">Radius: {radius} km</label>
          <input
            id="radius-slider"
            type="range"
            min={1}
            max={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            aria-label="Search radius"
          />
        </div>
      )}

      {error && <p role="alert">{error}</p>}
    </div>
  )
}

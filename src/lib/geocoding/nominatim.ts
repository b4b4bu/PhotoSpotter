type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

export async function fetchNominatim(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'PhotoSpotter/1.0' },
  })
  if (!res.ok) throw new Error(`Nominatim request failed: ${res.status}`)
  return res.json()
}

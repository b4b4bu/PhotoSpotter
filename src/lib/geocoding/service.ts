import { NoResultsError } from './errors'

type NominatimResult = {
  lat: string
  lon: string
  display_name: string
}

type NominatimClient = (query: string) => Promise<NominatimResult[]>

export type GeoLocation = {
  lat: number
  lng: number
  displayName: string
}

export async function geocode(query: string, fetchResults: NominatimClient): Promise<GeoLocation> {
  const results = await fetchResults(query)
  if (results.length === 0) throw new NoResultsError(query)
  const { lat, lon, display_name } = results[0]
  return { lat: parseFloat(lat), lng: parseFloat(lon), displayName: display_name }
}

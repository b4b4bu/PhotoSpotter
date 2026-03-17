import { geocode } from '@/lib/geocoding/service'
import { fetchNominatim } from '@/lib/geocoding/nominatim'
import { NoResultsError } from '@/lib/geocoding/errors'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return new Response(JSON.stringify({ error: 'Missing required query parameter: q' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const result = await geocode(q, fetchNominatim)
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    if (e instanceof NoResultsError) {
      return new Response(JSON.stringify({ error: 'Location not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    throw e
  }
}

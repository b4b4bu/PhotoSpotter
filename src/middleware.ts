import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth/service'

export async function middleware(request: NextRequest): Promise<Response> {
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('session')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId } = await verifyToken(token)
    const headers = new Headers(request.headers)
    headers.set('x-user-id', userId)
    return NextResponse.next({ request: { headers } })
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export const config = {
  matcher: ['/api/:path*'],
}

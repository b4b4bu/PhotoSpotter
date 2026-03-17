import prisma from '@/lib/prisma'
import { login } from '@/lib/auth/service'
import { InvalidCredentialsError } from '@/lib/auth/errors'

export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json()

  try {
    const { userId, token } = await login(email, password, prisma)

    return new Response(JSON.stringify({ userId }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`,
      },
    })
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

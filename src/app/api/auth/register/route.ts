import prisma from '@/lib/prisma'
import { register, issueToken } from '@/lib/auth/service'
import { DuplicateEmailError } from '@/lib/auth/errors'

export async function POST(request: Request): Promise<Response> {
  const { email, password } = await request.json()

  try {
    const { userId } = await register(email, password, prisma)
    const token = await issueToken(userId)

    return new Response(JSON.stringify({ userId }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `session=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400`,
      },
    })
  } catch (e) {
    if (e instanceof DuplicateEmailError) {
      return new Response(JSON.stringify({ error: 'Email already registered' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

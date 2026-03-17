import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { DuplicateEmailError, InvalidCredentialsError } from './errors'

type Db = {
  user: {
    create(args: { data: { email: string; passwordHash: string } }): Promise<{ id: string }>
    findUnique(args: { where: { email: string } }): Promise<{ id: string; passwordHash: string } | null>
  }
}

function jwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(secret)
}

function getBcryptRounds(): number {
  return process.env.BCRYPT_ROUNDS ? parseInt(process.env.BCRYPT_ROUNDS, 10) : 10
}

function isUniqueConstraintError(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    'code' in e &&
    (e as { code: string }).code === 'P2002'
  )
}

export async function register(
  email: string,
  password: string,
  db: Db
): Promise<{ userId: string }> {
  const passwordHash = await bcrypt.hash(password, getBcryptRounds())
  try {
    const user = await db.user.create({ data: { email, passwordHash } })
    return { userId: user.id }
  } catch (e) {
    if (isUniqueConstraintError(e)) throw new DuplicateEmailError(email)
    throw e
  }
}

export async function login(
  email: string,
  password: string,
  db: Db
): Promise<{ userId: string; token: string }> {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) throw new InvalidCredentialsError()

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new InvalidCredentialsError()

  const token = await issueToken(user.id)
  return { userId: user.id, token }
}

export async function issueToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(jwtSecret())
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, jwtSecret())
  if (!payload.sub) throw new Error('Token missing sub claim')
  return { userId: payload.sub }
}

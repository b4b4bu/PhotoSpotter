import { describe, it, expect, vi, beforeAll } from 'vitest'
import bcrypt from 'bcryptjs'
import { register, login, verifyToken, issueToken } from './service'
import { DuplicateEmailError, InvalidCredentialsError } from './errors'

// Pre-hash once so login tests don't each pay bcrypt cost
let storedHash: string
beforeAll(async () => {
  storedHash = await bcrypt.hash('correct-password', 1)
})

function makeDb(overrides?: {
  create?: ReturnType<typeof vi.fn>
  findUnique?: ReturnType<typeof vi.fn>
}) {
  return {
    user: {
      create: overrides?.create ?? vi.fn().mockResolvedValue({ id: 'user-1' }),
      findUnique: overrides?.findUnique ?? vi.fn().mockResolvedValue(null),
    },
  }
}

// ─── Cycle 1: register returns a userId ────────────────────────────────────
describe('register', () => {
  it('returns a userId', async () => {
    const db = makeDb()
    const result = await register('alice@example.com', 'password123', db)
    expect(result.userId).toBe('user-1')
  })

  // ─── Cycle 2: password is stored hashed (login roundtrip verifies) ────────
  it('hashes the password so login succeeds with the same credentials', async () => {
    let capturedHash = ''
    const db = {
      user: {
        create: vi.fn().mockImplementation(
          async ({ data }: { data: { email: string; passwordHash: string } }) => {
            capturedHash = data.passwordHash
            return { id: 'user-2' }
          }
        ),
        findUnique: vi.fn().mockImplementation(async () => ({
          id: 'user-2',
          passwordHash: capturedHash,
        })),
      },
    }
    await register('bob@example.com', 'mypassword', db)
    const { userId } = await login('bob@example.com', 'mypassword', db)
    expect(userId).toBe('user-2')
  })

  // ─── Cycle 3: duplicate email ──────────────────────────────────────────────
  it('throws DuplicateEmailError when the email is already taken', async () => {
    const db = makeDb({ create: vi.fn().mockRejectedValue({ code: 'P2002' }) })
    await expect(register('taken@example.com', 'password', db)).rejects.toThrow(DuplicateEmailError)
  })
})

// ─── Cycle 4–6: login ──────────────────────────────────────────────────────
describe('login', () => {
  it('returns userId and a JWT token for valid credentials', async () => {
    const db = makeDb({
      findUnique: vi.fn().mockResolvedValue({ id: 'user-3', passwordHash: storedHash }),
    })
    const result = await login('user@example.com', 'correct-password', db)
    expect(result.userId).toBe('user-3')
    expect(typeof result.token).toBe('string')
    expect(result.token.split('.')).toHaveLength(3) // valid JWT structure
  })

  it('throws InvalidCredentialsError for an unknown email', async () => {
    const db = makeDb({ findUnique: vi.fn().mockResolvedValue(null) })
    await expect(login('nobody@example.com', 'any', db)).rejects.toThrow(InvalidCredentialsError)
  })

  it('throws InvalidCredentialsError for a wrong password', async () => {
    const db = makeDb({
      findUnique: vi.fn().mockResolvedValue({ id: 'user-4', passwordHash: storedHash }),
    })
    await expect(login('user@example.com', 'wrong-password', db)).rejects.toThrow(InvalidCredentialsError)
  })
})

// ─── Cycle 7–8: verifyToken ────────────────────────────────────────────────
describe('verifyToken', () => {
  it('returns userId for a token issued by issueToken', async () => {
    const token = await issueToken('user-5')
    const { userId } = await verifyToken(token)
    expect(userId).toBe('user-5')
  })

  it('throws for a tampered or invalid token', async () => {
    await expect(verifyToken('not.a.valid.token')).rejects.toThrow()
  })
})

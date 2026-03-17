import '@testing-library/jest-dom'

process.env.JWT_SECRET = 'test-secret-do-not-use-in-production'
process.env.BCRYPT_ROUNDS = '1'

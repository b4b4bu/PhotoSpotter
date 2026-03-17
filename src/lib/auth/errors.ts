export class DuplicateEmailError extends Error {
  constructor(email: string) {
    super(`Email already registered: ${email}`)
    this.name = 'DuplicateEmailError'
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid email or password')
    this.name = 'InvalidCredentialsError'
  }
}

export class NoResultsError extends Error {
  constructor(query: string) {
    super(`No results found for: ${query}`)
    this.name = 'NoResultsError'
  }
}

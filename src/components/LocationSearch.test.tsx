import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationSearch } from './LocationSearch'

function mockFetch(ok: boolean, body: object) {
  return vi.fn().mockResolvedValue({
    ok,
    json: async () => body,
  })
}

describe('LocationSearch', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  // ─── Cycle 6: renders search UI ───────────────────────────────────────────
  it('renders a search input and submit button', () => {
    render(<LocationSearch />)
    expect(screen.getByRole('textbox', { name: /location/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  // ─── Cycle 7: successful search shows display name ────────────────────────
  it('shows the resolved location name after a successful search', async () => {
    vi.stubGlobal('fetch', mockFetch(true, { lat: 51.5, lng: -0.1, displayName: 'London, England' }))
    const user = userEvent.setup()

    render(<LocationSearch />)
    await user.type(screen.getByRole('textbox', { name: /location/i }), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(await screen.findByText('London, England')).toBeInTheDocument()
  })

  // ─── Cycle 8: successful search shows radius slider ───────────────────────
  it('shows the radius slider after a successful search', async () => {
    vi.stubGlobal('fetch', mockFetch(true, { lat: 51.5, lng: -0.1, displayName: 'London, England' }))
    const user = userEvent.setup()

    render(<LocationSearch />)
    await user.type(screen.getByRole('textbox', { name: /location/i }), 'London')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(await screen.findByRole('slider', { name: /radius/i })).toBeInTheDocument()
  })

  // ─── Cycle 9: unresolvable query shows error ──────────────────────────────
  it('shows an error message when the location cannot be found', async () => {
    vi.stubGlobal('fetch', mockFetch(false, { error: 'Location not found' }))
    const user = userEvent.setup()

    render(<LocationSearch />)
    await user.type(screen.getByRole('textbox', { name: /location/i }), 'xyznotaplace')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
})

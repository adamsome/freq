import { expect, test } from '@playwright/test'

// Read-only checks that a deployment is up and wired correctly. They run
// signed out and must never write data.

const GAMES = ['Freq', 'Cwd', 'Blow', 'Unter']

test('home page shows the game picker', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Choose Game' })).toBeVisible()
  for (const name of GAMES) {
    await expect(page.getByRole('button', { name, exact: true })).toBeVisible()
  }
  await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible()
  expect(errors).toEqual([])
})

test('game page shows the room form with a generated room code', async ({
  page,
}) => {
  await page.goto('/freq')

  await expect(page.getByRole('heading', { name: 'Freq' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start' })).toBeVisible()
  // The code comes from /api/room-code, so this also checks the API + render.
  await expect(page.getByRole('textbox')).toHaveValue(/^[a-z]+-[a-z]+$/)
})

test('public API generates room codes', async ({ request }) => {
  const res = await request.get('/api/room-code')
  expect(res.status()).toBe(200)
  const { roomCode } = await res.json()
  expect(roomCode).toMatch(/^[a-z]+-[a-z]+$/)
})

test('signed out: no profile, protected APIs refuse', async ({ request }) => {
  expect((await request.get('/auth/profile')).status()).toBe(204)
  for (const path of ['/api/user', '/api/user/rooms']) {
    expect((await request.get(path)).status(), path).toBe(401)
  }
  const res = await request.post('/api/freq/smoke-test/command', {
    data: { type: 'edit_player', value: {} },
  })
  expect(res.status()).toBe(401)
})

test('login redirects to Auth0 with an /auth/callback URL', async ({
  request,
}) => {
  const res = await request.get('/auth/login', { maxRedirects: 0 })
  expect([302, 307]).toContain(res.status())
  const location = new URL(res.headers()['location'])
  expect(location.hostname).toMatch(/\.auth0\.com$/)
  const redirectUri = new URL(location.searchParams.get('redirect_uri') ?? '')
  expect(redirectUri.pathname).toBe('/auth/callback')
})

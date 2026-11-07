import type { NextRequest } from 'next/server'
import { auth0 } from './lib/auth0'

/**
 * Mounts the Auth0 routes (/auth/login, /auth/logout, /auth/callback,
 * /auth/profile, ...) and keeps the session cookie rolling. Access checks
 * live in each API route, not here.
 */
export async function proxy(request: NextRequest) {
  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

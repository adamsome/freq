import { Auth0Client } from '@auth0/nextjs-auth0/server'
import { NextResponse } from 'next/server'
import { handleAfterUserLogin } from './user-store'

/**
 * v4 renamed AUTH0_ISSUER_BASE_URL → AUTH0_DOMAIN (no scheme) and
 * AUTH0_BASE_URL → APP_BASE_URL. Fall back to the v1 names until every
 * environment has been updated.
 */
const domain =
  process.env.AUTH0_DOMAIN ??
  process.env.AUTH0_ISSUER_BASE_URL?.replace(/^https?:\/\//, '').replace(
    /\/$/,
    ''
  )
const appBaseUrl = (
  process.env.APP_BASE_URL ?? process.env.AUTH0_BASE_URL
)?.replace(/\/$/, '')

export const auth0 = new Auth0Client({
  domain,
  appBaseUrl,
  // Signed out is a normal state (games are viewable without an account), so
  // /auth/profile returns 204 and useUser() gives user: null, not an error.
  noContentProfileResponseWhenUnauthenticated: true,
  // Cookies ignore ports, so the default `__session` would collide with other
  // apps on localhost (lqr's Auth0, Clerk dev apps).
  session: { cookie: { name: 'freq_session' } },
  async onCallback(error, ctx, session) {
    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }
    if (session) {
      await handleAfterUserLogin(session)
    }
    // Same as the SDK default: returnTo was already sanitized at login.
    return NextResponse.redirect(new URL(ctx.returnTo || '/', ctx.appBaseUrl))
  },
})

import { CookieSerializeOptions, serialize } from 'cookie'
import { HasResponseSetHeader } from '../types/io.types'

/**
 * This sets `cookie` using the `res` object on the server-side
 */
export const setCookieOnServer = (
  res: HasResponseSetHeader,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + (options.maxAge ?? 0))
    options.maxAge = (options.maxAge ?? 0) / 1000
  }

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options))
}

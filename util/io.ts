import { IncomingMessage } from 'http'

export function getCookie(
  req: IncomingMessage & { cookies?: { [key: string]: any } }
): string {
  return req.headers.cookie ?? ''
}

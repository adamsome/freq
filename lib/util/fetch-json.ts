import { API_GAME_COMMAND } from '../consts'
import { CommandType, GameType } from '../types/game.types'

type FetchError<T> = Error & {
  response: Response
  data: T
}

export default async function fetcher<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(input, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    if (response.ok) {
      return data
    }

    const error = new Error(response.statusText) as FetchError<T>
    error.response = response
    error.data = data
    throw error
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message }
    }
    throw error
  }
}

export async function postJson<T>(
  input: RequestInfo,
  body?: unknown
): Promise<T> {
  const headers = { 'Content-Type': 'application/json' }
  const init: RequestInit = { method: 'POST', headers }
  if (body) {
    init.body = JSON.stringify(body)
  }
  return await fetcher<T>(input, init)
}

interface CommandValue {
  type: CommandType
  value?: unknown
}

export async function postCommand<T>(
  game: GameType,
  room: string,
  command: CommandType,
  value?: unknown,
  /** Delay the post command in seconds */
  delaySeconds?: number
): Promise<T> {
  const body: CommandValue = { type: command }
  if (value != null) {
    body.value = value
  }

  const path = API_GAME_COMMAND.replace('%0', game).replace('%1', room)

  if (delaySeconds) {
    await delay(delaySeconds * 1000)
  }

  return await postJson<T>(path, body)
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

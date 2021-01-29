import { mutate } from 'swr'
import { CommandType } from '../types/game.types'

export default async function fetcher(input: RequestInfo, init?: RequestInit) {
  try {
    const response = await fetch(input, init)

    // if the server replies, there's always some data in json
    // if there's a network error, it will throw at the previous line
    const data = await response.json()

    if (response.ok) {
      return data
    }

    const error = new Error(response.statusText) as any
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

export async function postJson<T>(input: RequestInfo, body: any): Promise<T> {
  return await fetcher(input, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function postCommand<T>(
  type: CommandType,
  value?: any
): Promise<T> {
  const body: any = { type }
  if (value != null) {
    body.value = value
  }
  const data = await postJson<T>('/api/command', body)
  mutate('/api/game')
  return data
}

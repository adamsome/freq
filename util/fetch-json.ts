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

export async function postJson(input: RequestInfo, body: any) {
  await fetcher(input, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  mutate('/api/game')
}

export async function postCommand(type: CommandType, value?: any) {
  const body: any = { type }
  if (value != null) {
    body.value = value
  }
  await postJson('/api/command', body)
}

import { API_FREQ_COMMAND } from '../lib/consts'
import { FreqCommandType } from '../types/freq.types'

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

export async function postJson<T>(input: RequestInfo, body?: any): Promise<T> {
  const headers = { 'Content-Type': 'application/json' }
  const init: RequestInit = { method: 'POST', headers }
  if (body) {
    init.body = JSON.stringify(body)
  }
  return await fetcher(input, init)
}

export async function postCommand<T>(
  room: string,
  type: FreqCommandType,
  value?: any
): Promise<T> {
  const body: any = { type }
  if (value != null) {
    body.value = value
  }

  const path = API_FREQ_COMMAND.replace('%0', room)
  return await postJson<T>(path, body)
}

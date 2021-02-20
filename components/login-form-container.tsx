import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/use-debounce'
import useUser from '../hooks/use-user'
import { isRoomValid } from '../lib/room'
import { head } from '../util/array'
import fetchJson from '../util/fetch-json'
import LoginForm from './login-form'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function LoginFormContainer({ room: randomRoom }: Props) {
  const [user, mutateUser] = useUser()

  const router = useRouter()
  const { error: queryError, name: queryName } = router.query
  const [error, setError] = useState<string | null>(head(queryError) ?? null)

  const [fetching, setFetching] = useState(false)
  const [debouncedFetching, setDebouncedFetching] = useDebounce<boolean | null>(
    null,
    4000
  )

  useEffect(() => {
    if (debouncedFetching != null) {
      setFetching(debouncedFetching)
    }
  }, [debouncedFetching])

  const room = user?.connected ? user.room : randomRoom
  const name = head(queryName) ?? user?.name ?? ''

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fetching) return
    setFetching(true)

    const handleError = (error: any) => {
      console.error('An unexpected error happened:', error)
      setError(error.data?.message ?? error.message ?? 'Unexpected Error')
      setFetching(false)
    }

    const room: string | undefined = e.currentTarget?.room?.value?.toLowerCase()
    const name: string | undefined = e.currentTarget?.username?.value

    if (!isRoomValid(room)) {
      setFetching(false)
      return setError('Room code must be two words separated by a dash.')
    }

    if (name && name.length < 3) {
      setFetching(false)
      return setError('Username must be at least 3 letters long.')
    }

    try {
      const body: any = { room }
      if (name) body.name = name.substr(0, 15)

      const user = await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
      if (user?.connected) {
        router.push(`/${user.room}`)
      } else {
        handleError(new Error('User could not login.'))
      }
      setDebouncedFetching(false)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <LoginForm
      room={room}
      name={name}
      error={error}
      fetching={fetching}
      animate={true}
      onSubmit={handleStart}
    ></LoginForm>
  )
}

LoginFormContainer.defaultProps = defaultProps

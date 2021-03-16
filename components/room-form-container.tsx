import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/use-debounce'
import { isRoomValid } from '../lib/room'
import { head } from '../util/array'
import RoomForm from './room-form'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function RoomFormContainer({ room }: Props) {
  const router = useRouter()

  const { error: queryError } = router.query
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

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fetching) return
    setFetching(true)

    const targetRoom = e.currentTarget?.room?.value?.toLowerCase()

    if (!isRoomValid(targetRoom)) {
      setFetching(false)
      return setError('Room code must be two words separated by a dash.')
    }

    router.push(`/${targetRoom}`)
    setDebouncedFetching(false)
  }

  return (
    <RoomForm
      room={room}
      error={error}
      fetching={fetching}
      animate={true}
      onSubmit={handleStart}
    ></RoomForm>
  )
}

RoomFormContainer.defaultProps = defaultProps

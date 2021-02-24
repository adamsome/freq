import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/use-debounce'
import { ROOM_KEY } from '../lib/consts'
import { isRoomValid } from '../lib/room'
import { head } from '../util/array'
import { isBrowser } from '../util/dom'
import RoomForm from './room-form'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function RoomFormContainer({ room: randomRoom }: Props) {
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

  const [room, setRoom] = useState<string>('')

  useEffect(() => {
    if (isBrowser) {
      const roomStored = localStorage[ROOM_KEY]
      setRoom(roomStored || randomRoom)
    }
  }, [isBrowser])

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fetching) return
    setFetching(true)

    const room: string | undefined = e.currentTarget?.room?.value?.toLowerCase()

    if (!isRoomValid(room)) {
      setFetching(false)
      return setError('Room code must be two words separated by a dash.')
    }

    router.push(`/${room}`)
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

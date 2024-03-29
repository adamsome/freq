import { useRouter } from 'next/router'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { ROUTE_GAME_ROOM } from '../lib/consts'
import { isRoomValid } from '../lib/room'
import { GameType } from '../lib/types/game.types'
import { head } from '../lib/util/array'
import { useDebounce } from '../lib/util/use-debounce'
import RoomForm from './room-form'

type Props = typeof defaultProps & {
  type?: GameType
  generatedRoom?: string
  onChangeGameClick: () => void
}

const defaultProps = {
  classNames: '',
}

export default function RoomFormContainer({
  generatedRoom,
  type,
  classNames,
  onChangeGameClick,
}: Props) {
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

  const handleStart = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fetching || !type) return
    setFetching(true)

    const targetRoom = e.currentTarget?.room?.value?.toLowerCase()

    if (!isRoomValid(targetRoom)) {
      setFetching(false)
      return setError('Room code must be two words separated by a dash.')
    }

    router.push(ROUTE_GAME_ROOM.replace('%0', type).replace('%1', targetRoom))
    setDebouncedFetching(false)
  }

  return (
    <RoomForm
      type={type}
      generatedRoom={generatedRoom}
      error={error}
      fetching={fetching}
      animate={true}
      classNames={classNames}
      onSubmit={handleStart}
      onChangeGameClick={onChangeGameClick}
    ></RoomForm>
  )
}

RoomFormContainer.defaultProps = defaultProps

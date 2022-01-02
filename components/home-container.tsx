import { useUser } from '@auth0/nextjs-auth0'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  API_ROOM_CODE,
  API_USER_ROOMS,
  KEY_ROOM_TYPE,
  ROUTE_GAME_HOME,
  ROUTE_GAME_ROOM,
  ROUTE_HOME,
} from '../lib/consts'
import { isCwdGameView } from '../lib/cwd/cwd-game-view'
import { CommonGameView, GameType } from '../types/game.types'
import { head } from '../util/array'
import { isBrowser } from '../util/dom'
import Home from './home'
import RoomRedirect from './room-redirect'

type Props = typeof defaultProps

const defaultProps = {}

export default function HomeContainer(_: Props) {
  const [type, setType] = useState<GameType | undefined>()
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  const { user, isLoading } = useUser()

  const { data: generatedRoom } = useSWR<{ roomCode: string }>(API_ROOM_CODE)
  const { data: rooms, error, isValidating, mutate } = useSWR(() =>
    user ? API_USER_ROOMS : null
  )

  useEffect(() => {
    if (isBrowser) {
      const _type = (head(router.query?.game) ??
        localStorage[KEY_ROOM_TYPE]) as GameType | undefined
      if (_type) setType(_type)
      setLoading(false)
    }
  }, [isBrowser])

  const handleGameClick = (changedType?: GameType) => {
    if (changedType) {
      localStorage[KEY_ROOM_TYPE] = changedType
      router.push(ROUTE_GAME_HOME.replace('%0', changedType), undefined, {
        shallow: true,
      })
    } else {
      delete localStorage[KEY_ROOM_TYPE]
      router.push(ROUTE_HOME, undefined, {
        shallow: true,
      })
    }
    setType(changedType)
  }

  const handleRefreshRooms = () => {
    mutate()
  }

  const handleRoomClick = (game: CommonGameView) => {
    const room = game.room
    const gameType = isCwdGameView(game) ? 'cwd' : 'freq'
    router.push(ROUTE_GAME_ROOM.replace('%0', gameType).replace('%1', room))
  }

  return (
    <RoomRedirect>
      <Home
        gameType={type}
        gameTypeLoading={loading}
        userLoading={isLoading}
        generatedRoom={generatedRoom?.roomCode}
        rooms={rooms}
        roomsLoading={isValidating}
        roomsError={error}
        onGameClick={handleGameClick}
        onRoomClick={handleRoomClick}
        onRoomsRefresh={handleRefreshRooms}
      ></Home>
    </RoomRedirect>
  )
}

HomeContainer.defaultProps = defaultProps

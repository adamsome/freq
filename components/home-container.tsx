import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import {
  API_ROOM_CODE,
  API_USER_ROOMS,
  KEY_ROOM_TYPE,
  ROUTE_GAME_HOME,
  ROUTE_GAME_ROOM,
  ROUTE_HOME,
} from '../lib/consts'
import { BaseGameView, GameType } from '../lib/types/game.types'
import { head } from '../lib/util/array'
import useIsClient from '../lib/util/use-is-client'
import Home from './home'
import RoomRedirect from './room-redirect'

type Props = Record<string, never>

export default function HomeContainer(_: Props) {
  const [type, setType] = useState<GameType | undefined>()
  // localStorage is client-only, so the game type is unknown until then.
  const isClient = useIsClient()
  const loading = !isClient

  const router = useRouter()

  const { user, isLoading } = useUser()

  const { data: generatedRoom } = useSWR<{ roomCode: string }>(API_ROOM_CODE)
  const {
    data: rooms,
    error,
    isValidating,
    mutate,
  } = useSWR(() => (user ? API_USER_ROOMS : null))

  const gameType = router.query?.game

  // On the client, and whenever the URL's game changes, take the type from
  // the URL or the last one picked (adjusted during render).
  const typeSource = isClient ? (head(gameType) ?? '') : null
  const [syncedTypeSource, setSyncedTypeSource] = useState<string | null>(null)
  if (typeSource !== null && typeSource !== syncedTypeSource) {
    setSyncedTypeSource(typeSource)
    const _type = (head(gameType) ?? localStorage[KEY_ROOM_TYPE]) as
      GameType | undefined
    if (_type) setType(_type)
  }

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

  const handleRoomClick = (game: BaseGameView) => {
    const room = game.room
    const gameType = game.type
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
        onGameChange={handleGameClick}
        onRoomClick={handleRoomClick}
        onRoomsRefresh={handleRefreshRooms}
      ></Home>
    </RoomRedirect>
  )
}

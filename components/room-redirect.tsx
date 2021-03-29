import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import {
  KEY_ROOM,
  KEY_ROOM_REDIRECT,
  KEY_ROOM_TYPE,
  ROUTE_GAME_ROOM,
} from '../lib/consts'
import { isRoomValid } from '../lib/room'
import { isBrowser } from '../util/dom'

type Props = typeof defaultProps & {
  children: React.ReactNode
}

const defaultProps = {}

export default function RoomRedirect({ children }: Props) {
  const router = useRouter()

  useEffect(() => {
    if (isBrowser) {
      const redirect = localStorage[KEY_ROOM_REDIRECT]
      if (redirect) {
        localStorage.removeItem(KEY_ROOM_REDIRECT)

        const room = localStorage[KEY_ROOM]

        if (isRoomValid(room)) {
          const type = localStorage[KEY_ROOM_TYPE] ?? 'freq'
          router.push(ROUTE_GAME_ROOM.replace('%0', type).replace('%1', room))
          return
        }
      }
    }
  }, [isBrowser])

  return <>{children}</>
}

RoomRedirect.defaultProps = defaultProps

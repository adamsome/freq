import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useFetchUser } from '../hooks/use-fetch-user'
import {
  API_LOGIN,
  KEY_ROOM,
  KEY_ROOM_REDIRECT,
  KEY_ROOM_TYPE,
} from '../lib/consts'
import { isRoomValid } from '../lib/room'
import { GameType } from '../types/game.types'
import { head } from '../util/array'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  children: React.ReactNode
  type?: GameType
}

const defaultProps = {}

export default function UserRoomGuard({ children, type }: Props) {
  const { error, isLoading, user, isLoggedOut } = useFetchUser()
  const router = useRouter()

  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  useEffect(() => {
    if (!isLoggedOut || !room) return

    async function login() {
      localStorage[KEY_ROOM_REDIRECT] = true
      localStorage[KEY_ROOM] = room
      localStorage[KEY_ROOM_TYPE] = type
      await router.push(API_LOGIN)
    }
    login()
  }, [isLoggedOut, room])

  if (error) {
    return (
      <TitleMessage type={type} error>
        🤷‍♀️ Sorry...
      </TitleMessage>
    )
  }

  if (isLoading) {
    return (
      <TitleMessage type={type} subtle>
        Loading player...
      </TitleMessage>
    )
  }

  if (!user) {
    return (
      <TitleMessage type={type} subtle>
        Signing in...
      </TitleMessage>
    )
  }

  if (!room || !isRoomValid(room)) {
    return (
      <TitleMessage type={type} error>
        Room ({room}) is invalid.
      </TitleMessage>
    )
  }

  return <>{children}</>
}

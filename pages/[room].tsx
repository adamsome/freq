import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Room from '../components/room'
import RoomJoin from '../components/room-join'
import TitleMessage from '../components/title-message'
import { useFetchUser } from '../hooks/use-fetch-user'
import { API_LOGIN, ROOM_KEY, ROOM_REDIRECT_KEY } from '../lib/consts'
import { isRoomValid } from '../lib/room'
import { head } from '../util/array'

export default function Profile() {
  const router = useRouter()
  const { error, isLoading, user, isLoggedOut } = useFetchUser()

  const room = head(router.query?.room as string | undefined)?.toLowerCase()

  useEffect(() => {
    if (!isLoggedOut) return

    async function login() {
      localStorage[ROOM_REDIRECT_KEY] = true
      localStorage[ROOM_KEY] = room
      await router.push(API_LOGIN)
    }
    login()
  }, [isLoggedOut, room])

  if (error) {
    return <TitleMessage error>🤷‍♀️ Sorry...</TitleMessage>
  }

  if (isLoading) {
    return <TitleMessage subtle>Loading player...</TitleMessage>
  }

  if (!user) {
    return <TitleMessage subtle>Login...</TitleMessage>
  }

  if (!room || !isRoomValid(room)) {
    return <TitleMessage error>Room ({room}) is invalid.</TitleMessage>
  }

  if (!user.rooms[room]) {
    return <RoomJoin room={room} />
  }

  return <Room user={user} />
}

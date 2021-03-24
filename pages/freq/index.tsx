import { useUser } from '@auth0/nextjs-auth0'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import Button from '../../components/button'
import RoomFormContainer from '../../components/room-form-container'
import RoomList from '../../components/room-list'
import TitleMessage from '../../components/title-message'
import {
  API_USER_ROOMS,
  ROOM_KEY,
  ROOM_REDIRECT_KEY,
  ROUTE_FREQ_ROOM,
} from '../../lib/consts'
import { generateRoomKey, isRoomValid } from '../../lib/room'
import { cx, isBrowser } from '../../util/dom'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export const FreqHomePage = ({ room }: Props) => {
  const { user } = useUser()
  const { data: rooms, error, isValidating, mutate } = useSWR(() =>
    user ? API_USER_ROOMS : null
  )
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isBrowser) {
      const redirect = localStorage[ROOM_REDIRECT_KEY]
      if (redirect) {
        localStorage.removeItem(ROOM_REDIRECT_KEY)

        const room = localStorage[ROOM_KEY]

        if (isRoomValid(room) || room === 'profile') {
          router.push(ROUTE_FREQ_ROOM.replace('%0', room))
          return
        }
      }

      setLoading(false)
    }
  }, [isBrowser])

  const handleToggleFormClick = () => {
    setShowForm(!showForm)
  }

  const handleRefresh = () => {
    mutate()
  }

  if (error) {
    return <TitleMessage error>🤷‍♀️ Failed to load your rooms...</TitleMessage>
  }

  if (loading || (user && !rooms)) {
    return <TitleMessage subtle>Loading...</TitleMessage>
  }

  if (!rooms?.length || showForm) {
    return (
      <TitleMessage message="Type an existing game's name to join or just click Start to create a new game.">
        <RoomFormContainer room={room}></RoomFormContainer>

        {showForm && (
          <div
            className={cx(
              'w-full my-4 pt-4',
              'border-t border-gray-200 dark:border-gray-800'
            )}
          >
            <Button className="text-2xl" onClick={handleToggleFormClick}>
              ← Recent Games
            </Button>
          </div>
        )}
      </TitleMessage>
    )
  }

  return (
    <RoomList
      rooms={rooms}
      loading={isValidating}
      onToggleFormClick={handleToggleFormClick}
      onRefresh={handleRefresh}
    ></RoomList>
  )
}

FreqHomePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      room: generateRoomKey(),
    },
  }
}

export default FreqHomePage

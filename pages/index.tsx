import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import RoomFormContainer from '../components/room-form-container'
import TitleMessage from '../components/title-message'
import { ROOM_KEY, ROOM_REDIRECT_KEY } from '../lib/consts'
import { generateRoomKey, isRoomValid } from '../lib/room'
import { isBrowser } from '../util/dom'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export const HomePage = ({ room }: Props) => {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isBrowser) {
      const redirect = localStorage[ROOM_REDIRECT_KEY]
      if (redirect) {
        localStorage.removeItem(ROOM_REDIRECT_KEY)

        const room = localStorage[ROOM_KEY]

        if (isRoomValid(room) || room === 'profile') {
          router.push(`/${room}`)
          return
        }
      }

      setShowForm(true)
    }
  }, [isBrowser])

  const message = showForm
    ? "Type an existing game's name to join or just click Start to create a new game."
    : 'Loading...'

  return (
    <TitleMessage subtle={!showForm} message={message}>
      {showForm && <RoomFormContainer room={room}></RoomFormContainer>}
    </TitleMessage>
  )
}

HomePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      room: generateRoomKey(),
    },
  }
}

export default HomePage

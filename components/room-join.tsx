import React, { useEffect, useState } from 'react'
import { mutate } from 'swr'
import { API_GAME_JOIN, API_GAME, API_USER } from '../lib/consts'
import { GameView } from '../types/game.types'
import { postJson } from '../util/fetch-json'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  room: string
}

const defaultProps = {}

export default function RoomJoin({ room }: Props) {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function joinRoom(room: string) {
      try {
        const game: GameView = await postJson(API_GAME_JOIN.replace('%0', room))
        mutate(API_USER)
        mutate(API_GAME.replace('%0', room), game)
      } catch (error) {
        console.error('Error joining room', error)
        setError('Error joining room.')
      }
    }
    joinRoom(room)
  }, [room])

  if (error) {
    return <TitleMessage error>{error}</TitleMessage>
  }

  return <TitleMessage subtle>Joining room...</TitleMessage>
}

RoomJoin.defaultProps = defaultProps

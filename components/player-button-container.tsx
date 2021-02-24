import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Modal from 'react-responsive-modal'
import { mutate } from 'swr'
import { API_GAME_LEAVE, API_LOGOUT, API_USER } from '../lib/consts'
import { Player } from '../types/game.types'
import { User } from '../types/user.types'
import { postJson } from '../util/fetch-json'
import PlayerButton from './player-button'
import PlayerEdit from './player-edit'
import PlayerOptions from './player-options'

type Props = typeof defaultProps & {
  user: User
  room?: string
  player?: Player
  isDarkMode: boolean
  onDarkModeToggle: () => void
  onDebugToggle: () => void
}

const defaultProps = {}

export default function PlayerButtonContainer({
  user,
  room,
  player,
  isDarkMode,
  onDarkModeToggle,
  onDebugToggle,
}: Props) {
  const router = useRouter()

  // Player Options modal state
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)
  const [modelEditOpen, setModelEditOpen] = useState(false)

  const handleLogout = async () => {
    if (player && room) {
      await postJson(API_GAME_LEAVE.replace('%0', room))
      mutate(API_USER)
      router.push('/')
    } else {
      router.push(API_LOGOUT)
    }
  }

  return (
    <>
      <PlayerButton
        user={user}
        player={player}
        onClick={() => setModelOptionsOpen(true)}
      />

      <Modal
        open={modelOptionsOpen}
        onClose={() => setModelOptionsOpen(false)}
        center
        classNames={{ modal: 'freq-model-reset-sm' }}
      >
        <PlayerOptions
          user={user}
          room={room}
          player={player}
          isDarkMode={isDarkMode}
          onDebugToggle={onDebugToggle}
          onDarkModeToggle={onDarkModeToggle}
          onEditPlayer={() => {
            setModelOptionsOpen(false)
            setModelEditOpen(true)
          }}
          onLogout={handleLogout}
          onClose={() => setModelOptionsOpen(false)}
        />
      </Modal>

      {player && room && (
        <Modal
          open={modelEditOpen}
          onClose={() => setModelEditOpen(false)}
          center
          classNames={{ modal: 'freq-model-reset-sm' }}
        >
          <PlayerEdit
            room={room}
            player={player}
            onClose={() => setModelEditOpen(false)}
          />
        </Modal>
      )}
    </>
  )
}

PlayerButtonContainer.defaultProps = defaultProps

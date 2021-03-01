import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { API_GAME_LEAVE, API_LOGOUT, ROOM_KEY } from '../lib/consts'
import { User } from '../types/user.types'
import { postJson } from '../util/fetch-json'
import ActionModal from './action-modal'
import PlayerButton from './player-button'
import PlayerEdit from './player-edit'
import PlayerOptions from './player-options'

type Props = typeof defaultProps & {
  user: User
  theme?: string
  onThemeToggle: () => void
  onDebugToggle: () => void
}

const defaultProps = {}

export default function PlayerButtonContainer({
  user,
  theme,
  onThemeToggle,
  onDebugToggle,
}: Props) {
  const router = useRouter()

  // Player Options modal state
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)
  const [modelEditOpen, setModelEditOpen] = useState(false)

  const handleLogout = async () => {
    router.push(API_LOGOUT)
  }

  const handleLeave = async (room: string) => {
    localStorage[ROOM_KEY] = room
    router.push('/')
    await postJson(API_GAME_LEAVE.replace('%0', room))
  }

  return (
    <>
      <PlayerButton user={user} onClick={() => setModelOptionsOpen(true)} />

      <ActionModal
        open={modelOptionsOpen}
        onClose={() => setModelOptionsOpen(false)}
      >
        <PlayerOptions
          user={user}
          theme={theme}
          onDebugToggle={onDebugToggle}
          onThemeToggle={onThemeToggle}
          onEditPlayer={() => {
            setModelOptionsOpen(false)
            setModelEditOpen(true)
          }}
          onLogout={handleLogout}
          onLeave={handleLeave}
          onClose={() => setModelOptionsOpen(false)}
        />
      </ActionModal>

      <ActionModal open={modelEditOpen} onClose={() => setModelEditOpen(false)}>
        <PlayerEdit onClose={() => setModelEditOpen(false)} />
      </ActionModal>
    </>
  )
}

PlayerButtonContainer.defaultProps = defaultProps

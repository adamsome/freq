import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { mutate } from 'swr'
import {
  API_FREQ_LEAVE,
  API_LOGOUT,
  API_USER_ROOMS,
  ROOM_KEY,
  ROUTE_FREQ_HOME,
} from '../lib/consts'
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
    router.push(ROUTE_FREQ_HOME)
    await postJson(API_FREQ_LEAVE.replace('%0', room))
    mutate(API_USER_ROOMS)
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

import { useRouter } from 'next/router'
import { useState } from 'react'
import { mutate } from 'swr'
import {
  API_GAME_LEAVE,
  API_LOGOUT,
  API_USER_ROOMS,
  KEY_ROOM,
  ROUTE_HOME,
} from '../lib/consts'
import { GameType } from '../lib/types/game.types'
import { User } from '../lib/types/user.types'
import { head } from '../lib/util/array'
import { postJson } from '../lib/util/fetch-json'
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
  const type = head(router.query?.game) as GameType | undefined

  // Player Options modal state
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)
  const [modelEditOpen, setModelEditOpen] = useState(false)

  const handleLogout = async () => {
    router.push(API_LOGOUT)
  }

  const handleLeave = async (room: string) => {
    if (!type || !room) return

    localStorage[KEY_ROOM] = room
    router.push(ROUTE_HOME)
    await postJson(API_GAME_LEAVE.replace('%0', type).replace('%1', room))
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

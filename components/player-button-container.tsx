import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
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
import BlowSettings from './blow/blow-settings'
import ActionModal from './control/action-modal'
import { ButtonProps } from './control/button'
import CwdSettings from './cwd/cwd-settings'
import FreqSettings from './freq/freq-settings'
import PlayerButton from './player-button'
import PlayerEdit from './player-edit'
import PlayerOptions from './player-options'
import ResSettings from './res/res-settings'

type Props = {
  user: User
  theme?: string
  button?: Partial<ButtonProps>
  onThemeToggle: () => void
  onDebugToggle: () => void
}

export default function PlayerButtonContainer({
  user,
  theme,
  button,
  onThemeToggle,
  onDebugToggle,
}: Props) {
  const router = useRouter()
  const type = head(router.query?.game) as GameType | undefined

  const { mutate } = useSWRConfig()

  // Player Options modal state
  const [modelOptionsOpen, setModelOptionsOpen] = useState(false)
  const [modelEditOpen, setModelEditOpen] = useState(false)
  const [modelRoomSettingsOpen, setModelRoomSettingsOpen] = useState(false)

  const Settings = getSettingsComponent()

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
      <PlayerButton
        user={user}
        button={button}
        onClick={() => setModelOptionsOpen(true)}
      />

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
          onOpenRoomSettings={() => {
            setModelOptionsOpen(false)
            setModelRoomSettingsOpen(true)
          }}
          onLogout={handleLogout}
          onLeave={handleLeave}
          onClose={() => setModelOptionsOpen(false)}
        />
      </ActionModal>

      <ActionModal open={modelEditOpen} onClose={() => setModelEditOpen(false)}>
        <PlayerEdit onClose={() => setModelEditOpen(false)} />
      </ActionModal>

      <ActionModal
        open={modelRoomSettingsOpen}
        onClose={() => setModelRoomSettingsOpen(false)}
      >
        {Settings && (
          <Settings onClose={() => setModelRoomSettingsOpen(false)} />
        )}
      </ActionModal>
    </>
  )
}

function getSettingsComponent(type?: GameType) {
  switch (type) {
    case 'freq':
      return FreqSettings
    case 'cwd':
      return CwdSettings
    case 'blow':
      return BlowSettings
    case 'res':
      return ResSettings
  }
}

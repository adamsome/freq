import { useRouter } from 'next/router'
import React from 'react'
import useDarkMode from '../hooks/use-dark-mode'
import { useFetchUser } from '../hooks/use-fetch-user'
import { API_LOGIN, API_LOGOUT } from '../lib/consts'
import { GameView } from '../types/game.types'
import PlayerButtonContainer from './player-button-container'

type Props = typeof defaultProps & {
  game?: GameView
  onDebugToggle: () => void
}

const defaultProps = {}

export default function HeaderActions({ game, onDebugToggle }: Props) {
  const router = useRouter()
  const { user, isLoading, error } = useFetchUser()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  if (error)
    return (
      <button title={error.message}>
        Error
        <style jsx>{`
          button {
            color: brown;
          }
        `}</style>
      </button>
    )

  if (isLoading)
    return (
      <button>
        Loading...
        <style jsx>{`
          button {
            color: var(--subtle);
          }
        `}</style>
      </button>
    )

  if (user) {
    // Log out user if they are kicked in the game state
    if (game?.kicked?.[user.id] === true) {
      router.push(API_LOGOUT)
    }

    return (
      <PlayerButtonContainer
        user={user}
        room={game?.room}
        player={game?.currentPlayer}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => toggleDarkMode()}
        onDebugToggle={onDebugToggle}
      ></PlayerButtonContainer>
    )
  }

  const handleLogin = () => {
    router.push(API_LOGIN)
  }

  return (
    <>
      <button onClick={toggleDarkMode}>
        {!isDarkMode ? 'Dark' : 'Light'} Mode
      </button>

      <button onClick={handleLogin}>Login</button>

      <style jsx>{`
        button {
          flex: 0 0 auto;
          margin-right: var(--inset-md);
        }

        button:hover {
          background: var(--bg-1);
        }
      `}</style>
    </>
  )
}

HeaderActions.defaultProps = defaultProps

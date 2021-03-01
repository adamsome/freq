import { useRouter } from 'next/router'
import React from 'react'
import useDarkMode from '../hooks/use-dark-mode'
import { useFetchUser } from '../hooks/use-fetch-user'
import { API_LOGIN } from '../lib/consts'
import Button from './button'
import PlayerButtonContainer from './player-button-container'

type Props = typeof defaultProps & {
  onDebugToggle: () => void
}

const defaultProps = {}

export default function HeaderActions({ onDebugToggle }: Props) {
  const router = useRouter()
  const { user, isLoading, error } = useFetchUser()
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const handleLogin = () => {
    router.push(API_LOGIN)
  }

  if (error) {
    return (
      <Button red title={error.message}>
        Error
      </Button>
    )
  }

  if (isLoading) {
    return <Button gray>Loading...</Button>
  }

  if (user) {
    return (
      <PlayerButtonContainer
        user={user}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => toggleDarkMode()}
        onDebugToggle={onDebugToggle}
      ></PlayerButtonContainer>
    )
  }

  return (
    <>
      <Button className="mr-1.5 text-xl" onClick={toggleDarkMode}>
        {!isDarkMode ? 'Dark' : 'Light'} Mode
      </Button>

      <Button className="text-xl" onClick={handleLogin}>
        Log In
      </Button>
    </>
  )
}

HeaderActions.defaultProps = defaultProps

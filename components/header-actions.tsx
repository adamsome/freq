import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFetchUser } from '../hooks/use-fetch-user'
import { useTheme } from '../hooks/use-theme'
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
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Only show theme switcher after mounted to prevent rehydrate mismatch
  useEffect(() => setMounted(true), [])

  const handleThemeToggle = () => {
    theme === 'dark' ? setTheme('light') : setTheme('dark')
  }

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

  if (isLoading || !mounted) {
    return <Button gray>Loading...</Button>
  }

  if (user) {
    return (
      <PlayerButtonContainer
        user={user}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onDebugToggle={onDebugToggle}
      ></PlayerButtonContainer>
    )
  }

  return (
    <>
      <Button className="mr-1.5 text-xl" onClick={handleThemeToggle}>
        {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>

      <Button className="text-xl" onClick={handleLogin}>
        Log In
      </Button>
    </>
  )
}

HeaderActions.defaultProps = defaultProps

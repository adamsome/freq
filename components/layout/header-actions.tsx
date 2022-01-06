import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { API_LOGIN } from '../../lib/consts'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import { useTheme } from '../../lib/util/use-theme'
import Button, { ButtonProps } from '../control/button'
import PlayerButtonContainer from '../player-button-container'

type Props = {
  button?: Partial<ButtonProps>
  onDebugToggle: () => void
}

export default function HeaderActions({ button, onDebugToggle }: Props) {
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
      <Button color="red" title={error.message}>
        Error
      </Button>
    )
  }

  if (isLoading || !mounted) {
    return <Button color="gray">Loading...</Button>
  }

  if (user) {
    return (
      <PlayerButtonContainer
        user={user}
        theme={theme}
        button={button}
        onThemeToggle={handleThemeToggle}
        onDebugToggle={onDebugToggle}
      ></PlayerButtonContainer>
    )
  }

  return (
    <>
      <Button
        className="mr-1.5 text-xl"
        onClick={handleThemeToggle}
        {...button}
      >
        {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>

      <Button className="text-xl" onClick={handleLogin} {...button}>
        Log In
      </Button>
    </>
  )
}

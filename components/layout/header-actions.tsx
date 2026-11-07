import { API_LOGIN } from '../../lib/consts'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import useIsClient from '../../lib/util/use-is-client'
import { useTheme } from 'next-themes'
import Button, { ButtonProps } from '../control/button'
import PlayerButtonContainer from '../player-button-container'

type Props = {
  button?: Partial<ButtonProps>
  onDebugToggle: () => void
}

export default function HeaderActions({ button, onDebugToggle }: Props) {
  const { user, isLoading, error } = useFetchUser()
  // Only show theme switcher on the client to prevent rehydrate mismatch
  const mounted = useIsClient()
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogin = () => {
    window.location.assign(API_LOGIN)
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

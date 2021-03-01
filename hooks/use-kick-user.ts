import { useRouter } from 'next/router'
import { API_LOGOUT } from '../lib/consts'
import { useFetchUser } from './use-fetch-user'
import useGame from './use-game'

export default function useKickUser() {
  const router = useRouter()
  const { user } = useFetchUser()
  const { game } = useGame({ useRequired: true, required: user })

  if (user && game?.kicked?.[user.id]) {
    router.push(API_LOGOUT)
  }
}

import { useUser } from '@auth0/nextjs-auth0/client'
import useSWR from 'swr'
import { API_USER } from '../consts'
import { User } from '../types/user.types'
import useIsClient from './use-is-client'

export function useFetchUser() {
  const { user: authUser, error: authError, isLoading: authLoading } = useUser()
  const { data: _user, error: userError } = useSWR(() =>
    authUser ? API_USER : null
  )

  const isLoading = authLoading || (authUser && !_user && !userError)

  // Logged out once auth has settled on the client with no user.
  const isClient = useIsClient()
  const isLoggedOut = isClient && !authLoading && !(authUser && !authError)

  let user: User | undefined
  let error = authError

  if (authUser) {
    if (userError) error = userError
    else if (_user) user = _user
  }

  return { error, isLoading, user, isLoggedOut }
}

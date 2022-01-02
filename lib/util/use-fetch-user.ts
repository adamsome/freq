import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { API_USER } from '../consts'
import { User } from '../types/user.types'
import { isBrowser } from './dom'

export function useFetchUser() {
  const { user: authUser, error: authError, isLoading: authLoading } = useUser()
  const { data: _user, error: userError } = useSWR(() =>
    authUser ? API_USER : null
  )

  const isLoading = authLoading || (authUser && !_user && !userError)

  const [isLoggedOut, setIsLoggedOut] = useState(false)

  useEffect(() => {
    if ((authUser && !authError) || authLoading || !isBrowser) {
      setIsLoggedOut(false)
    } else {
      setIsLoggedOut(true)
    }
  }, [authUser, authError, authLoading])

  let user: User | undefined
  let error = authError

  if (authUser) {
    if (userError) error = userError
    else if (_user) user = _user
  }

  return { error, isLoading, user, isLoggedOut }
}

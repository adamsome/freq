import { useUser } from '@auth0/nextjs-auth0'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { API_USER } from '../lib/consts'
import { User } from '../types/user.types'
import { isBrowser } from '../util/dom'

export function useFetchUser() {
  const { user: authUser, error: authError, isLoading: authLoading } = useUser()
  const { data: _user, error: userError } = useSWR(() =>
    authUser ? API_USER : null
  )

  const [isLoggedOut, setIsLoggedOut] = useState(false)

  if (authError) {
    // eslint-disable-next-line no-console
    console.log('xerror', { authError, userError })
  }

  useEffect(() => {
    if ((authUser && !authError) || authLoading || !isBrowser) {
      setIsLoggedOut(false)
    } else {
      setIsLoggedOut(true)
    }
  }, [authUser, authError, authLoading])

  let user: User | undefined
  let error = authError
  let isLoading = false

  if (authUser) {
    if (userError) error = userError
    else if (!_user) isLoading = true
    else user = _user
  }

  return { error, isLoading, user, isLoggedOut }
}
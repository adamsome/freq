import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { User, UserConnected } from '../types/user.types'

interface UseUserFoundOptions {
  redirectTo?: string | false | ((user: UserConnected) => string)
  redirectIfFound: true
}

interface UseUserNotFoundOptions {
  redirectTo?: string | false
  redirectIfFound?: false
}

type UseUserOptions = UseUserFoundOptions | UseUserNotFoundOptions

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
}: UseUserOptions = {}) {
  const { data: user, mutate } = useSWR<User>('/api/user')

  useEffect(() => {
    // If no redirect needed, just return (example: already on /dashboard)
    // If user data not yet there (fetch in progress, logged in or not) then
    // don't do anything yet
    if (!redirectTo || !user) return

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.connected) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.connected)
    ) {
      const url =
        typeof redirectTo === 'string'
          ? redirectTo
          : redirectTo(user as UserConnected)
      Router.push(url)
    }
  }, [user, redirectIfFound, redirectTo])

  return [user, mutate] as const
}

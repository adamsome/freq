import { useEffect, useState } from 'react'

interface MaybeMediaMatcher {
  matchMedia?: (query: string) => MediaQueryList
}

const useMedia = (query: string, provider: MaybeMediaMatcher = window) => {
  const mql: Partial<MediaQueryList> = provider.matchMedia
    ? provider.matchMedia(query)
    : {}

  const [match, setMatch] = useState(!!mql.matches)

  useEffect(() => {
    if (mql.addListener) {
      const handler = () => setMatch(!!mql.matches)
      mql.addListener(handler)
      return () => mql.removeListener && mql.removeListener(handler)
    }
  }, [mql])

  return match
}

export default useMedia

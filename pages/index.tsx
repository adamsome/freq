import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import TitleMessage from '../components/title-message'
import { ROUTE_FREQ_HOME } from '../lib/consts'
import { isBrowser } from '../util/dom'

type Props = typeof defaultProps

const defaultProps = {}

export default function HomePage(_: Props) {
  const router = useRouter()

  useEffect(() => {
    if (isBrowser) router.push(ROUTE_FREQ_HOME)
  }, [isBrowser])

  return <TitleMessage subtle>Loading...</TitleMessage>
}

HomePage.defaultProps = defaultProps

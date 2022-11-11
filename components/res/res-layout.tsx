import React from 'react'
import { getGameTitle } from '../../lib/game'
import { useResGame } from '../../lib/util/use-game'
import Layout from '../layout/layout'

type Props = {
  children: React.ReactNode
}

export default function ResLayout({ children }: Props) {
  const { game } = useResGame()

  return (
    <Layout
      type="res"
      title={getGameTitle('res')}
      room={game?.room}
      className="bg-white text-black dark:bg-black dark:text-white"
      contentClassName="[--freq-button-weight:600]"
      button={{
        color: 'phosphorus',
        className: 'inline-flex font-spaced-medium',
      }}
      sticky
      flexWrapper={false}
    >
      {children}
    </Layout>
  )
}

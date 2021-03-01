import React from 'react'
import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import Game from './game'
import Layout from './layout'

type Props = typeof defaultProps

const defaultProps = {}

export default function GameLayout(_props: Props) {
  const { game } = useGame()

  return (
    <Layout title={game?.room}>
      <main
        className={cx(
          'flex-1 flex flex-col items-center',
          'w-full max-w-screen-md pb-4 md:px-2 md:py-5'
        )}
      >
        <Game />
      </main>
    </Layout>
  )
}

GameLayout.defaultProps = defaultProps

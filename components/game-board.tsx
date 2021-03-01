import React from 'react'
import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import CluesContainer from './clues-container'
import CommandPanel from './command-panel'
import GameJoinButtons from './game-join-buttons'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import Layout from './layout'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps

const defaultProps = {}

export default function GameBoard(_props: Props) {
  const { game } = useGame()
  if (!game) return null

  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${game.room}`

  return (
    <Layout title={game?.room}>
      <main
        className={cx(
          'flex-1 flex flex-col items-center',
          'w-full max-w-screen-md pb-4 md:px-2 md:py-5'
        )}
      >
        <HeaderMessage />

        {game.phase === 'prep' && (
          <>
            <GameLink url={roomUrl} />
            {game.currentPlayer && <PlayerHero />}
          </>
        )}

        <CluesContainer />

        {game.currentPlayer ? (
          <CommandPanel />
        ) : (
          <GameJoinButtons room={game.room} />
        )}

        <Scoreboard />
      </main>
    </Layout>
  )
}

GameBoard.defaultProps = defaultProps

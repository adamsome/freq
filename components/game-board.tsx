import React from 'react'
import useFreqGame from '../hooks/use-freq-game'
import CluesContainer from './clues-container'
import CommandPanel from './command-panel'
import GameJoinButtons from './game-join-buttons'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import Layout from './layout'
import LayoutMain from './layout-main'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps

const defaultProps = {}

export default function GameBoard(_props: Props) {
  const { game } = useFreqGame()
  if (!game) return null

  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${game.room}`

  return (
    <Layout title={game?.room}>
      <LayoutMain>
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

        <Scoreboard game={game} />
      </LayoutMain>
    </Layout>
  )
}

GameBoard.defaultProps = defaultProps

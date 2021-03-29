import React from 'react'
import useGame from '../hooks/use-game'
import { getGameTitle } from '../lib/game'
import CommandPanel from './command-panel'
import CluesContainer from './freq/clues-container'
import GameJoinButtons from './game-join-buttons'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import Layout from './layout'
import LayoutMain from './layout-main'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'

type Props = typeof defaultProps

const defaultProps = {}

export default function GameBoard(_: Props) {
  const { game } = useGame()
  if (!game) return null

  const title = getGameTitle(game.type)
  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${game.type}/${game.room}`

  return (
    <Layout type={game.type} title={title} room={game?.room}>
      <LayoutMain>
        <HeaderMessage />

        {game.phase === 'prep' && (
          <>
            <GameLink url={roomUrl} />
            {game.currentPlayer && <PlayerHero />}
          </>
        )}

        {game.type === 'freq' ? <CluesContainer /> : <div>Cwd</div>}

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

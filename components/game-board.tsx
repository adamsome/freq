import React from 'react'
import useGame from '../hooks/use-game'
import { getGameTitle } from '../lib/game'
import { GameType } from '../types/game.types'
import CommandPanel from './command-panel'
import CodesContainer from './cwd/codes-container'
import CluesContainer from './freq/clues-container'
import GameJoinButtons from './game-join-buttons'
import GameLink from './game-link'
import HeaderMessage from './header-message'
import Layout from './layout'
import LayoutMain from './layout-main'
import PlayerHero from './player-hero'
import Scoreboard from './scoreboard'
import SkeletonBox from './skeleton-box'

type Props = typeof defaultProps & {
  type?: GameType
}

const defaultProps = {}

export default function GameBoard({ type }: Props) {
  const { game } = useGame()

  const title = getGameTitle(type)
  const roomUrl =
    type && game && `${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${game.room}`

  return (
    <Layout type={type} title={title} room={game?.room}>
      <LayoutMain>
        {type !== 'cwd' && <HeaderMessage />}

        {game?.phase === 'prep' && (
          <>
            <GameLink url={roomUrl} />

            {game.currentPlayer && <PlayerHero />}
          </>
        )}

        {!type ? (
          <SkeletonBox className="w-full h-32 sm:h-40 md:px-4 mb-4 sm:mb-5" />
        ) : type === 'freq' ? (
          <CluesContainer />
        ) : (
          <CodesContainer />
        )}

        {!game ? (
          <SkeletonBox className="w-full h-14 mb-6 md:px-4" />
        ) : game.currentPlayer ? (
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

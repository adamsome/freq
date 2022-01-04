import { useRef, useState } from 'react'
import { BottomSheet, BottomSheetRef } from 'react-spring-bottom-sheet'
import { getGameTitle } from '../../lib/game'
import { PlayerView } from '../../lib/types/game.types'
import useGame from '../../lib/util/use-game'
import Button from '../control/button'
import GameLink from '../game-link'
import Layout from '../layout/layout'
import LayoutMain from '../layout/layout-main'
import SeatGrid from '../layout/seat-grid'
import PlayerHero from '../player-hero'
import PlayerSeat from './player-seat'

type Props = typeof defaultProps

const defaultProps = {}

export default function BlowGameBoard(_: Props) {
  const { game } = useGame()
  const sheetRef = useRef<BottomSheetRef>(null)
  const [MOCK_playerCount, MOCK_setPlayerCount] = useState(3)

  const type = 'blow'
  const title = getGameTitle(type)
  const roomUrl =
    type && game && `${process.env.NEXT_PUBLIC_BASE_URL}/${type}/${game.room}`

  const players = MOCK_addPlayers(game?.players, MOCK_playerCount - 1)

  return (
    <Layout type={type} title={title} room={game?.room}>
      <LayoutMain>
        {game?.phase === 'prep' && (
          <>
            <GameLink url={roomUrl} />

            {game.currentPlayer && <PlayerHero />}
          </>
        )}

        <div>Not Yet Implemented.</div>

        <div className="flex-center">
          {[3, 4, 5, 6].map((i) => (
            <Button
              key={i}
              className="mr-2"
              solid={i === MOCK_playerCount}
              onClick={() => MOCK_setPlayerCount(i)}
            >
              {i}
            </Button>
          ))}
        </div>

        <BottomSheet
          ref={sheetRef}
          open
          skipInitialTransition
          expandOnContentDrag
          blocking={false}
          snapPoints={({ minHeight, maxHeight }) => [
            maxHeight - maxHeight / 10,
            minHeight,
            maxHeight * 0.6,
          ]}
          defaultSnap={({ maxHeight }) => maxHeight / 2}
        >
          <div className="flex-center px-2 pb-5">
            <SeatGrid classNames="max-w-sm">
              {players.map((p) => (
                <PlayerSeat key={p.id} player={p} />
              ))}
            </SeatGrid>
          </div>
        </BottomSheet>
      </LayoutMain>
    </Layout>
  )
}

const MOCK_addPlayers = (players: PlayerView[] = [], n = 2) => [
  ...players,
  ...MOCK_PLAYERS.slice(0, n),
]

const MOCK_PLAYERS: PlayerView[] = [
  { id: 'mock1', name: 'Jane Doe' },
  { id: 'mock2', name: 'Jack Smith' },
  { id: 'mock3', name: 'John Brown' },
  { id: 'mock4', name: 'Jill Rosenburg' },
  { id: 'mock5', name: 'Elle Johnson' },
]

BlowGameBoard.defaultProps = defaultProps

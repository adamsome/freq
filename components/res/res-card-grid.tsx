import { CSSProperties } from 'react'
import {
  getResPlayerProps,
  getResPlayersInOrder,
  shouldRevealResSpies,
} from '../../lib/res/res-engine'
import { Player } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useResGame } from '../../lib/util/use-game'
import useWindowSize from '../../lib/util/use-window-size'
import ResCard from './res-card'

const COLS = 2
const ASPECT_RATIO = 14 / 10
const MARGIN = 16
const GAP_X = 16
const GAP_Y = 32
const MAX_WIDTH = 768

type Props = {
  className: string
  onPlayerSelect: (player: Player) => void
}

export default function ResCardGrid({ className, onPlayerSelect }: Props) {
  const { game } = useResGame()
  const { width: windowWidth } = useWindowSize(360, 640)
  if (!game) return null

  const players = getResPlayersInOrder(game)
  const revealSpies = shouldRevealResSpies(game)

  const gridWidth = Math.min(windowWidth - 2 * MARGIN, MAX_WIDTH - 2 * MARGIN)
  const width = (gridWidth - (COLS - 1) * GAP_X) / COLS
  const height = width * ASPECT_RATIO
  const rows = Math.ceil(players.length / COLS)
  const gridHeight = (height + GAP_Y) * rows

  function getPosition(i: number): CSSProperties {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const top = `${row * (height + GAP_Y)}px`
    const left = `${col * (width + GAP_X)}px`
    return { top, left }
  }

  return (
    <div className={cx('relative', className)} style={{ height: gridHeight }}>
      {players.map((player, i) => (
        <div key={player.id} className="absolute" style={getPosition(i)}>
          <ResCard
            {...getResPlayerProps(game, player)}
            revealSpies={revealSpies}
            size={[width, height]}
            onSelect={() => onPlayerSelect(player)}
          />
        </div>
      ))}
    </div>
  )
}

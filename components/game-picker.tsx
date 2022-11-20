import { GameType, GAME_TYPES } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import GameButton from './control/game-button'

type Props = typeof defaultProps & {
  horizontal?: boolean
  onClick: (gameType: GameType) => void
}

const defaultProps = {}

export default function GamePicker({ horizontal, onClick }: Props) {
  return (
    <div
      className={cx(
        'flex items-center',
        horizontal
          ? 'flex-row flex-wrap items-center justify-center'
          : 'flex-col space-y-4'
      )}
    >
      {GAME_TYPES.map((type) => (
        <GameButton
          key={type}
          className={horizontal ? 'm-2' : ''}
          type={type}
          onClick={onClick}
        />
      ))}
    </div>
  )
}

GamePicker.defaultProps = defaultProps

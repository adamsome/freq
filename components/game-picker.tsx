import { GameType, GAME_TYPES } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import GameButton from './game-button'

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
          ? 'flex-col space-y-4 md:flex-row md:space-x-2 md:space-y-0'
          : 'flex-col space-y-4'
      )}
    >
      {GAME_TYPES.map((type) => (
        <GameButton key={type} type={type} onClick={onClick} />
      ))}
    </div>
  )
}

GamePicker.defaultProps = defaultProps

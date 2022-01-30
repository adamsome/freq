import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import Title from './title'

type Props = typeof defaultProps & {
  type: GameType
  onClick: (gameType: GameType) => void
}

const defaultProps = {}

export default function GameButton({ type, onClick }: Props) {
  return (
    <button
      type="button"
      className={cx(`
        group flex
        w-60
        cursor-pointer
        flex-col items-center
        rounded-lg border-t border-b border-l border-r
        border-gray-200
        py-3
        transition
        hover:border-blue-400
        hover:bg-blue-100
        focus:border-blue-700
        focus:outline-none
        focus:ring-4
        focus:ring-blue-400
        focus:ring-opacity-25
        dark:border-gray-800
        dark:hover:border-blue-800
        dark:hover:bg-blue-950
        dark:focus:border-blue-700
        dark:focus:ring-blue-500
        dark:focus:ring-opacity-25
      `)}
      onClick={() => onClick(type)}
    >
      <Title type={type} animate={true} />
    </button>
  )
}

GameButton.defaultProps = defaultProps

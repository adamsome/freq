import { GameType } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
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
      className={cx(
        'flex flex-col items-center w-60',
        'py-3',
        'border-t border-b border-gray-200 dark:border-gray-800',
        'border-l border-r rounded-lg',
        'transition cursor-pointer group',
        'hover:bg-blue-100 dark:hover:bg-blue-950',
        'hover:border-blue-400 dark:hover:border-blue-800',
        'focus:ring-4 focus:ring-blue-400 focus:ring-opacity-25',
        'dark:focus:ring-blue-500 dark:focus:ring-opacity-25',
        'focus:outline-none focus:border-blue-700 dark:focus:border-blue-700'
      )}
      onClick={() => onClick(type)}
    >
      <Title type={type} animate={true} />
    </button>
  )
}

GameButton.defaultProps = defaultProps

import { GameType } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import Title from './title'

type Props = typeof defaultProps & {
  onClick: (gameType: GameType) => void
}

const defaultProps = {}

export default function GamePicker({ onClick }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center mt-6">
      <button
        type="button"
        className={cx(
          'flex flex-col items-center w-56',
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
        onClick={() => onClick('freq')}
      >
        <Title type="freq" animate={true} />
      </button>

      <p className="my-2 mx-4 text-gray-300 dark:text-gray-700">
        &mdash; or &mdash;
      </p>

      <button
        type="button"
        className={cx(
          'flex flex-col items-center w-56',
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
        onClick={() => onClick('cwd')}
      >
        <Title type="cwd" animate={true} />
      </button>
    </div>
  )
}

GamePicker.defaultProps = defaultProps

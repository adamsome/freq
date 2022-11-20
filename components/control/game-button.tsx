import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import Title from './title'

type Props = {
  className?: string
  type: GameType
  onClick: (gameType: GameType) => void
}

export default function GameButton({ className, type, onClick }: Props) {
  return (
    <button
      type="button"
      className={cx(
        `
        group flex
        w-60
        cursor-pointer
        flex-col items-center
        rounded-lg border
        border-gray-200/40
        bg-gray-100/40
        py-3
        transition
        hover:border-blue-400
        hover:bg-blue-100
        focus:border-blue-700
        focus:outline-none
        focus:ring-4
        focus:ring-blue-400
        focus:ring-opacity-25
        dark:border-gray-800/40
        dark:bg-gray-900/40
        dark:hover:border-blue-800
        dark:hover:bg-blue-950
        dark:focus:border-blue-700
        dark:focus:ring-blue-500
        dark:focus:ring-opacity-25
        `,
        className
      )}
      onClick={() => onClick(type)}
    >
      <Title type={type} animate={true} />
    </button>
  )
}

import { CommandError } from '../../lib/types/game.types'
import { useBlowGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import { ButtonProps } from '../control/button'
import GameJoinButtons from '../game-join-buttons'
import SkeletonBox from '../layout/skeleton-box'

type Props = {
  onCommandError?: (error: CommandError) => void
}

const BUTTON_DEFAULTS: ButtonProps = {
  className: 'font-spaced-narrow',
  color: 'cyan',
  variant: 'dim',
  border: true,
  round: false,
}

export default function BlowBoardCommand({ onCommandError }: Props) {
  const { game } = useBlowGame()
  const { currentPlayer, commands } = game ?? {}

  if (!game) return <SkeletonBox className="w-full h-12 mb-6 md:px-4" />

  if (!currentPlayer)
    return <GameJoinButtons room={game.room} button={BUTTON_DEFAULTS} />

  return (
    <CommandPanel
      hideError
      button={{
        ...BUTTON_DEFAULTS,
        color: commands?.[0]?.disabled ? 'gray' : 'cyan',
        variant: 'dim',
      }}
      spacingClassName="m-0 px-0.5 py-0.5 xs:px-1 xs:py-1 sm:px-2 sm:px-2"
      onCommandError={onCommandError}
    />
  )
}

import { isResLead } from '../../lib/res/res-engine'
import { Player } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useResGame } from '../../lib/util/use-game'
import IconSvg from '../control/icon-svg'

type Props = {
  index: number
  player?: Player
}

export default function ResScoreboardRow({ index, player }: Props) {
  const { game } = useResGame()
  if (!game) return null

  const lead = isResLead(game, player)

  return (
    <div className="flex w-full items-center">
      <div className="min-w-4 flex-center mr-4 w-4 tracking-normal">
        {lead || index === 0 ? (
          <IconSvg
            name="chevron"
            className="h-4 w-4 text-phosphorus-500"
            top="-1px"
          />
        ) : (
          <span className="pl-0.5 text-gray-300/40">{index + 1}</span>
        )}
      </div>
      <div className={cx(!player && 'text-gray-400/40')}>
        {player?.name ?? 'No Player'}
      </div>
    </div>
  )
}

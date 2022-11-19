import { useRef } from 'react'
import { isResPlayerActive } from '../../lib/res/res-engine'
import { Player } from '../../lib/types/game.types'
import { useResGame } from '../../lib/util/use-game'
import useSize from '../../lib/util/use-size'
import Fixed from '../layout/fixed'
import ResCardGrid from './res-card-grid'
import ResControlPanel from './res-control-panel'
import ResOrb from './res-orb'
import ResRoundTracker from './res-round-tracker'

type Props = {
  onPlayerSelect: (player: Player) => void
}

export default function ResBoard({ onPlayerSelect }: Props) {
  const { game } = useResGame()
  const panelRef = useRef<HTMLDivElement>(null)
  const [, panelHeight] = useSize(panelRef)

  const spacer = panelHeight + 48 // panel height + bottom-12
  const active = game != null && isResPlayerActive(game, game.currentPlayer)

  return (
    <>
      <Fixed className="top-16 flex items-center space-x-3 pr-4">
        <ResRoundTracker className="flex-1" />
        <ResOrb className="relative -top-px w-4" disabled={!active} />
      </Fixed>

      <ResCardGrid className="mt-10" onPlayerSelect={onPlayerSelect} />
      <div style={{ height: `${spacer}px` }}></div>

      <Fixed className="bottom-12">
        <ResControlPanel panelRef={panelRef} />
      </Fixed>
    </>
  )
}

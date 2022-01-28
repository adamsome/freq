import { Fragment } from 'react'
import { BlowPlayerView } from '../../lib/types/blow.types'
import { cx } from '../../lib/util/dom'
import BlowPlayerLabel from './tokens/blow-player-label'

type Props = {
  title: string
  player: BlowPlayerView | BlowPlayerView[]
  playerSeparator?: string
  selected?: number | boolean | null
}

export default function BlowBoardTitle(props: Props) {
  const { title, player, playerSeparator, selected: rawSelected } = props
  const players = Array.isArray(player) ? player : [player]
  const selected = typeof rawSelected === 'boolean' ? 0 : rawSelected
  return (
    <>
      <div className="text-center font-spaced-narrow text-cyan-500 text-xs">
        {title}
      </div>

      <div className="xs:mb-1 text-xl whitespace-nowrap">
        {players.map((p, i) => (
          <Fragment key={i}>
            {i !== 0 && playerSeparator && (
              <span className="text-gray-400 italic mx-2">
                {playerSeparator}
              </span>
            )}
            <LitPlayerLabel player={p} lit={i === selected} />
          </Fragment>
        ))}
      </div>
    </>
  )
}

type LitPlayerLabelProps = {
  className?: string
  player: BlowPlayerView
  lit?: boolean
}

function LitPlayerLabel({ className, player, lit }: LitPlayerLabelProps) {
  return (
    <BlowPlayerLabel
      className={cx(className, {
        'mr-1': true,
        'pl-1.5 pr-0.5 py-0 font-light text-black bg-cyan-400 rounded': lit,
      })}
      value={player}
    />
  )
}

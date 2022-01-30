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
      <div className="font-spaced-narrow text-center text-xs text-cyan-500">
        {title}
      </div>

      <div className="whitespace-nowrap text-xl xs:mb-1">
        {players.map((p, i) => (
          <Fragment key={i}>
            {i !== 0 && playerSeparator && (
              <span className="mx-2 italic text-gray-400">
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
        'rounded bg-cyan-400 py-0 pl-1.5 pr-0.5 font-light text-black': lit,
      })}
      value={player}
    />
  )
}

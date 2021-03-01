import React from 'react'
import { Player } from '../types/game.types'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  player: Player
}

const defaultProps = {
  right: false,
  psychic: false,
  nextPsychic: false,
}

export default function ScoreboardPlayerName({
  player,
  right,
  psychic,
  nextPsychic,
}: Props) {
  return (
    <>
      <div
        className={cx(
          'flex-1 flex items-center overflow-hidden',
          'overflow-ellipsis whitespace-nowrap text-center',
          { 'flex-row-reverse': right }
        )}
      >
        <div
          className={cx(
            'flex-initial overflow-hidden overflow-ellipsis whitespace-nowrap',
            right
              ? 'text-right mr-0 ml-1 sm:ml-2'
              : 'text-left mr-1 sm:mr-2 ml-0',
            { 'font-semibold': player.leader }
          )}
        >
          {`${player.name ?? 'Unnamed'}`}
        </div>

        {psychic && <div className="text-lg sm:text-xl">🧠</div>}
        {nextPsychic && <div className="text-xs sm:text-sm">🧠</div>}
      </div>
    </>
  )
}

ScoreboardPlayerName.defaultProps = defaultProps

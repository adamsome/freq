import React from 'react'
import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import { styleLinearGradientText } from '../util/dom-style'

type Props = typeof defaultProps

const defaultProps = {}

export default function HeaderTitle(_: Props) {
  const { game } = useGame()

  return (
    <h1
      className={cx(
        'flex-1 flex items-center m-0 overflow-hidden',
        'text-xl font-extrabold whitespace-nowrap'
      )}
    >
      <div style={styleLinearGradientText('Freq')}>{game ? `Freq` : ''}</div>

      {game?.room && (
        <>
          <div
            className={cx(
              'text-gray-300 dark:text-gray-700',
              'font-light ml-2 mr-1.5'
            )}
          >
            /
          </div>

          <div
            className={cx(
              'flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap',
              'text-gray-500 font-light'
            )}
          >
            <span>{game.room.toLowerCase()}</span>
          </div>
        </>
      )}
    </h1>
  )
}

HeaderTitle.defaultProps = defaultProps

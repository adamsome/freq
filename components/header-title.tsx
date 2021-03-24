import { useRouter } from 'next/router'
import React from 'react'
import useFreqGame from '../hooks/use-freq-game'
import { ROUTE_FREQ_HOME } from '../lib/consts'
import { cx } from '../util/dom'
import { styleLinearGradientText } from '../util/dom-style'

type Props = typeof defaultProps

const defaultProps = {}

export default function HeaderTitle(_: Props) {
  const router = useRouter()
  const { game } = useFreqGame()

  const handleTitleClick = () => {
    router.push(ROUTE_FREQ_HOME)
  }

  return (
    <h1
      className={cx(
        'flex-1 flex items-center m-0 overflow-hidden',
        'text-xl font-extrabold whitespace-nowrap'
      )}
    >
      <div
        className="cursor-pointer"
        style={styleLinearGradientText('Freq')}
        onClick={handleTitleClick}
      >
        Freq
      </div>

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

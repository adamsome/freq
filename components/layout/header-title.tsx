import { useRouter } from 'next/router'
import { ROUTE_GAME_HOME, ROUTE_HOME } from '../../lib/consts'
import { getGameTitle } from '../../lib/game'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { styleLinearGradientText } from '../../lib/util/dom-style'
import useGame from '../../lib/util/use-game'
import Logo from '../control/logo'

type Props = typeof defaultProps & {
  type?: GameType
  big?: boolean
  onLogoClick?: () => void
  onTitleClick?: () => void
}

const defaultProps = {}

export default function HeaderTitle({
  type,
  big,
  onLogoClick,
  onTitleClick,
}: Props) {
  const router = useRouter()
  const { game } = useGame()

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick()
    } else {
      router.push(ROUTE_HOME)
    }
  }

  const handleTitleClick = () => {
    if (onTitleClick) {
      onTitleClick()
    } else if (type) {
      router.push(ROUTE_GAME_HOME.replace('%0', type))
    } else {
      router.push(ROUTE_HOME)
    }
  }

  const hideMobileLogoClass = type && !big ? 'hidden sm:block' : ''

  return (
    <h1
      className={cx(
        'flex-1 flex items-center m-0 overflow-hidden',
        'text-xl font-extrabold whitespace-nowrap'
      )}
    >
      <div
        className={cx('mr-2 sm:mr-4 cursor-pointer group', hideMobileLogoClass)}
        onClick={handleLogoClick}
      >
        <Logo
          body="text-black dark:text-white group-hover:text-blue-950 dark:group-hover:text-blue-200 transition-colors"
          line="text-black dark:text-white group-hover:text-blue-400 transition-colors"
          inner="text-white dark:text-black group-hover:text-red-600 transition-colors"
          big={big}
        />
      </div>

      {type && (
        <div
          className={cx(
            'cursor-pointer animate-fade-in opacity-80 hover:opacity-100 transition-opacity',
            { 'sm:text-3xl': big, 'font-mono': type === 'cwd' }
          )}
          style={styleLinearGradientText(type)}
          onClick={handleTitleClick}
        >
          {getGameTitle(type)}
        </div>
      )}

      {game?.room && (
        <>
          <div
            className={cx(
              'text-gray-300 dark:text-gray-700',
              'font-light ml-1.5 mr-1 animate-fade-in'
            )}
          >
            /
          </div>

          <div
            className={cx(
              'flex-1 overflow-hidden text-ellipsis whitespace-nowrap',
              'text-gray-500 font-light animate-fade-in'
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

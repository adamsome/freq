import { useRouter } from 'next/router'
import { ROUTE_GAME_HOME, ROUTE_HOME } from '../../lib/consts'
import { GameType } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import useGame from '../../lib/util/use-game'
import Logo from '../control/logo'
import Title from '../control/title'

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
      className={cx(`
        m-0
        flex flex-1 items-center
        overflow-hidden whitespace-nowrap
        text-xl font-extrabold
      `)}
    >
      <div
        className={cx('group mr-2 cursor-pointer sm:mr-4', hideMobileLogoClass)}
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
        <Title
          small
          type={type}
          classNames={cx('animate-fade-in', { 'sm:text-3xl': big })}
          onClick={handleTitleClick}
        />
      )}

      {game?.room && (
        <>
          <div
            className={cx(`
              ml-1.5 mr-1
              animate-fade-in
              font-light text-gray-300 dark:text-gray-700
            `)}
          >
            /
          </div>

          <div
            className={cx(`
              flex-1
              animate-fade-in
              overflow-hidden text-ellipsis whitespace-nowrap
              font-light text-gray-500
            `)}
          >
            <span>{game.room.toLowerCase()}</span>
          </div>
        </>
      )}
    </h1>
  )
}

HeaderTitle.defaultProps = defaultProps

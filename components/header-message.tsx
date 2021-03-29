import { useFetchUser } from '../hooks/use-fetch-user'
import useGame from '../hooks/use-game'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'

const HeaderMessage = () => {
  const { game } = useGame()
  const { user } = useFetchUser()
  if (!game) return null

  const id = user?.id
  const isKicked = id && game?.kicked?.[id] === true
  const headers = isKicked ? [{ text: "You've been kicked!" }] : game.headers

  return (
    <div
      className={cx(
        'flex-center flex-col content-center flex-wrap',
        'w-full h-20 px-0 md:px-4 py-0 mt-0 md:mt-2 mb-6',
        'text-xl font-semibold'
      )}
    >
      {headers.map((h, i) => (
        <div
          className={cx(
            'flex-1 flex-center w-full h-full',
            'bg-gray-100 dark:bg-gray-900 text-center',
            'rounded-none md:rounded-md',
            'first:rounded-none last:rounded-none',
            'md:first:rounded-t-md md:last:rounded-b-md'
          )}
          key={h.text + i}
          style={styleColor(h.color, h.colorLit)}
        >
          <div>{h.text}</div>
        </div>
      ))}
    </div>
  )
}

export default HeaderMessage

import { useFetchUser } from '../hooks/use-fetch-user'
import useGame from '../hooks/use-game'
import { Header } from '../types/game.types'
import { cx } from '../util/dom'
import { styleColor } from '../util/dom-style'

const HeaderMessage = () => {
  const { game, loading: gameLoading } = useGame()
  const { user, isLoading: userLoading } = useFetchUser()

  const id = user?.id
  const isKicked = id && game?.kicked?.[id] === true

  let headers: Header[]

  if (isKicked) {
    headers = [{ text: "You've been kicked!" }]
  } else if (userLoading) {
    headers = [{ text: 'Loading player...', color: 'Gray' }]
  } else if (!user) {
    headers = [{ text: 'Signing player in...', color: 'Gray' }]
  } else if (gameLoading || !game) {
    headers = [{ text: 'Loading room...', color: 'Gray' }]
  } else {
    headers = game?.headers
  }

  const textSize =
    headers.length === 1 && headers[0].text.length < 4 ? 'text-7xl' : 'text-xl'

  return (
    <div
      className={cx(
        'flex-center flex-col content-center flex-wrap font-semibold',
        'w-full h-20 px-0 md:px-4 py-0 mt-0 md:mt-2 mb-6',
        textSize
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

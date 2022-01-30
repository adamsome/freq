import { Header } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleColor } from '../lib/util/dom-style'
import { useFetchUser } from '../lib/util/use-fetch-user'
import useGame from '../lib/util/use-game'

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
  } else if (gameLoading || !game) {
    headers = [{ text: 'Loading room...', color: 'Gray' }]
  } else {
    headers = game?.headers ?? []
  }

  const textSize =
    headers.length === 1 && headers[0].text.length < 4 ? 'text-7xl' : 'text-xl'

  return (
    <div
      className={cx(`
        flex-center
        mt-0 mb-6
        h-20 w-full
        flex-col flex-wrap content-center
        px-0 py-0
        font-semibold
        md:mt-2 md:px-4
        ${textSize}
      `)}
    >
      {headers.map((h, i) => (
        <div
          className={cx(`
            flex-center
            h-full w-full
            flex-1
            rounded-none
            bg-gray-100
            text-center
            first:rounded-none last:rounded-none
            dark:bg-gray-900
            md:rounded-md md:first:rounded-t-md md:last:rounded-b-md
          `)}
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

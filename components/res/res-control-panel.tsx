import { RefObject } from 'react'
import { Header } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import useGame from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import ResControlInfo from './res-control-info'

type Props = {
  panelRef?: RefObject<HTMLDivElement>
}

export default function ResControlPanel({ panelRef }: Props) {
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

  return (
    <div
      ref={panelRef}
      className={cx(
        'flex-center w-full flex-wrap content-center space-y-4',
        'rounded-lg border border-gray-400/10 bg-black/70',
        'py-4 text-sm font-normal backdrop-blur',
        'shadow-xl shadow-black/50'
      )}
    >
      <div className="px-4">
        {headers.map((h, i) => (
          <ResControlInfo key={h.text + i}>{h.text}</ResControlInfo>
        ))}
      </div>

      <CommandPanel />
    </div>
  )
}

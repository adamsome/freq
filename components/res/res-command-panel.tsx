import { RefObject } from 'react'
import { getResCastMissionResults } from '../../lib/res/res-engine'
import { Header } from '../../lib/types/game.types'
import { cx } from '../../lib/util/dom'
import { useFetchUser } from '../../lib/util/use-fetch-user'
import { useResGame } from '../../lib/util/use-game'
import CommandPanel from '../command-panel'
import GameJoinButtons from '../game-join-buttons'
import ResCommandInfo from './res-command-info'
import ResResultCard from './res-result-card'

type Props = {
  panelRef?: RefObject<HTMLDivElement>
}

export default function ResCommandPanel({ panelRef }: Props) {
  const { game, loading: gameLoading } = useResGame()
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

  let missionResults: boolean[] = []
  if (game && game.step === 'mission_reveal') {
    missionResults = getResCastMissionResults(game)
    missionResults.sort().reverse()
  }

  return (
    <div
      ref={panelRef}
      className={cx(
        'flex-center w-full flex-wrap content-center',
        'rounded-lg border border-gray-400/10 bg-purple-950/80',
        'py-4 text-sm font-normal backdrop-blur',
        'shadow-xl shadow-black/50',
        headers.length === 0 && missionResults.length === 0 && 'pt-0'
      )}
    >
      <div className="px-4">
        {headers.map((h, i) => (
          <ResCommandInfo
            key={h.text + i}
            className="mb-4"
            heading={h.heading}
            lead={h.lead}
            positive={h.positive === true}
            negative={h.positive === false}
          >
            {h.text}
          </ResCommandInfo>
        ))}
      </div>

      {missionResults.length > 0 && (
        <div className="mb-4 flex items-center">
          {missionResults.map((r, i) => (
            <ResResultCard
              key={i}
              positive={r}
              rotateIndex={i}
              className="-ml-12 first:ml-0"
            />
          ))}
        </div>
      )}

      {game && !game.currentPlayer && (
        <GameJoinButtons
          room={game.room}
          className="w-full px-4"
          commandDefaults={{ color: 'Phosphorus' }}
          styleTextColor="black"
        />
      )}
      <CommandPanel className="w-full px-4" styleTextColor="black" />
    </div>
  )
}

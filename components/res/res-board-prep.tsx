import GameLink from '../game-link'
import ResControlPanel from './res-control-panel'
import ResScoreboard from './res-scoreboard'

type Props = {
  roomUrl: string
}

export default function ResBoardPrep({ roomUrl }: Props) {
  return (
    <>
      <div className="space-y-4">
        <div className="w-full rounded-lg border border-gray-400/10 bg-black/70 p-4 shadow-xl shadow-black/50 backdrop-blur">
          <GameLink url={roomUrl} button={{ color: 'phosphorus' }} />
        </div>
        <ResScoreboard />
      </div>
      <div className="fixed bottom-12 left-0 right-0 z-40 px-2">
        <ResControlPanel />
      </div>
    </>
  )
}

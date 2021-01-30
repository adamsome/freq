import React from 'react'
import { GameView } from '../types/game.types'
import { User } from '../types/user.types'

type Props = typeof defaultProps & {
  game?: GameView
  user?: User
}

const defaultProps = {}

const DebugText = ({ game, user }: Props) => {
  return (
    <>
      {' '}
      {game?.currentPlayer && (
        <pre>
          {game.game_started_at.replace('T', ' ').slice(0, -5) + ' '}
          {game.currentPlayer.id.substr(0, 8)}
          {` (${
            game.players.findIndex((p) => p?.id === game.currentPlayer?.id) + 1
          }`}
          {`/${game.players.length})`}
        </pre>
      )}
      {user?.connected && <pre>{JSON.stringify(user, null, 2)}</pre>}
      {<pre>{JSON.stringify(game, null, 2)}</pre>}
    </>
  )
}

DebugText.defaultProps = defaultProps

export default DebugText

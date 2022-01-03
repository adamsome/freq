import { BlowGame } from '../types/blow.types'
import { PlayerView } from '../types/game.types'

export default function createBlowPlayerViews(
  game: BlowGame,
  currentID?: string
): PlayerView[] {
  const activePlayerID = getActivePlayer(game)

  return game.players.map(
    (p): PlayerView => ({
      ...p,
      active: p.id === activePlayerID,
      current: p.id === currentID,
      wins: game.stats?.[p.id]?.w,
    })
  )
}

function getActivePlayer(game: BlowGame): string | undefined {
  switch (game.phase) {
    case 'guess': {
      const { player_order, player_active } = game
      return player_order[player_active]
    }
  }
}

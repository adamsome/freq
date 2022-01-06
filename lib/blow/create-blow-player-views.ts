import { BlowGameView } from '../types/blow.types'
import { PlayerView } from '../types/game.types'

export default function createBlowPlayerViews(
  view: BlowGameView,
  currentID?: string
): PlayerView[] {
  // const activePlayerID = getActivePlayer(view)

  return view.players.map(
    (p): PlayerView => ({
      ...p,
      // active: p.id === activePlayerID,
      current: p.id === currentID,
      wins: view.stats?.[p.id]?.w,
    })
  )
}

// function getActivePlayer(view: BlowGameView): string | undefined {
//   switch (view.phase) {
//     case 'guess': {
//       const { player_order, player_active } = view
//       return player_order[player_active]
//     }
//   }
// }

import { BlowGameView, BlowPlayerView } from '../types/blow.types'

export default function createBlowPlayerViews(
  view: BlowGameView,
  currentID?: string
): BlowPlayerView[] {
  // const activePlayerID = getActivePlayer(view)

  return view.players.map(
    (p): BlowPlayerView => ({
      ...p,
      // active: p.id === activePlayerID,
      current: p.id === currentID,
      wins: view.stats?.[p.id]?.w,
      cards: p.name?.startsWith('B') ? ['merchant', 'killer'] : [null],
      coins: p.name?.startsWith('B') ? 12 : 7,
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

import { BlowGameView, BlowRoleID } from '../types/blow.types'

export function getCardKilledCount(
  id?: BlowRoleID | null,
  game?: BlowGameView
): number {
  if (!id || !game) return 0
  return game.players.reduce((outerAcc, p) => {
    return p.cards.reduce((acc, roleID, i) => {
      if (roleID === id && p.cardsKilled[i]) {
        acc++
      }
      return acc
    }, outerAcc)
  }, 0)
}

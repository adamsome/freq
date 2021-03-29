import { CwdCodeView, CwdGame } from '../../types/cwd.types'
import { PlayerView } from '../../types/game.types'
import { range } from '../../util/array'
import { toTruthMap } from '../../util/object'
import { getTeamPlayers } from '../player'

export default function buildCwdCodeViews(
  game: CwdGame,
  player?: PlayerView
): CwdCodeView[] {
  // Psychics should see all 25 revealed codes
  const id = player?.id
  const isPsychic = id === game.psychic_1 || id === game.psychic_2
  const revealedIndices = isPsychic ? range(0, 25) : game.code_reveals
  const revealMap = toTruthMap(revealedIndices, (i) => i)

  const lastRevealed = game.code_reveals[game.code_reveals.length - 1]

  const team = getTeamPlayers(game.players, player?.team)
  const visitedCountByIndex = team.reduce((acc, p) => {
    const visitedIndices = game.visited?.[p.id] ?? []
    visitedIndices.forEach((i) => {
      if (acc[i] == null) acc[i] = 0
      acc[i]++
    })
    return acc
  }, {} as Record<number, number>)

  return game.code_words.map((word, i) => {
    const view: CwdCodeView = {
      word,
      icons: [],
      lit: lastRevealed === i,
    }

    const visitedCount = visitedCountByIndex[i] ?? 0
    if (visitedCount > 0) {
      view.level = Math.min(visitedCount, 3)
    }

    if (revealMap[i]) {
      view.state = game.code_states[i]
    }

    return view
  })
}

import { FreqGame } from '../../types/freq.types'
import { Player } from '../../types/game.types'
import { randomHourlyItem } from '../../util/random'
import { getTeamPlayers } from '../player'

export function getPsychic(game: FreqGame): Player | undefined {
  return game.players.find((p) => p.id === game.psychic)
}

export function getNextPsychic(
  game: FreqGame,
  ...ignorePlayers: (string | { id: string })[]
): Player | undefined {
  const { next_psychic, team_turn, repeat_turn, players } = game
  const ignoreIDs = ignorePlayers.map((p) => (typeof p === 'string' ? p : p.id))

  if (next_psychic && !ignorePlayers.includes(next_psychic)) {
    const next = players.find((p) => p.id === next_psychic)
    if (next) return next
  }

  const otherTeam = repeat_turn ? team_turn : team_turn === 1 ? 2 : 1
  const teamPlayers = getTeamPlayers(players, otherTeam)
  let leastPsychics: Player[] = []
  let leastPsychicCount = 0
  for (const player of teamPlayers) {
    if (ignoreIDs.includes(player.id)) continue

    const playerCount = game.psychic_counts?.[player.id] ?? 0

    if (leastPsychics.length === 0) {
      leastPsychics.push(player)
      leastPsychicCount = playerCount
    }

    if (playerCount < leastPsychicCount) {
      leastPsychics = [player]
      leastPsychicCount = playerCount
    } else if (playerCount === leastPsychicCount) {
      leastPsychics.push(player)
    }
  }
  return leastPsychics.length <= 1
    ? leastPsychics[0]
    : randomHourlyItem(leastPsychics, 0, 12)
}

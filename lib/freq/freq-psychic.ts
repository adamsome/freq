import { FreqGame } from '../../types/freq.types'
import { Player } from '../../types/game.types'
import getNextPsychicsInfo, { NextPsychicInfo } from '../get-next-psychics-info'

export function getPsychic(game: FreqGame): Player | undefined {
  return game.players.find((p) => p.id === game.psychic)
}

export function getNextPsychic(
  game: FreqGame,
  ...ignorePlayers: (string | { id: string })[]
): NextPsychicInfo {
  const { psychic_history, next_psychic, team_turn, players } = game
  const ignoreIDs = ignorePlayers.map((p) => (typeof p === 'string' ? p : p.id))

  if (game.settings?.designated_psychic) {
    const psychic = players.find((p) => p.id === game.psychic)
    return { psychic, psychic_history }
  }

  if (next_psychic && !ignorePlayers.includes(next_psychic)) {
    const next = players.find((p) => p.id === next_psychic)
    if (next) {
      return { psychic: next, psychic_history }
    }
  }

  const otherTeam = game.repeat_turn ? team_turn : team_turn === 1 ? 2 : 1
  return getNextPsychicsInfo(game.psychic_history, players, {
    team: otherTeam,
    ignoreIDs,
  })
}

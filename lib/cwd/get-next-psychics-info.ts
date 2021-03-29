import { Player } from '../../types/game.types'
import { partition } from '../../util/array'
import { toTruthMap } from '../../util/object'
import { randomItem } from '../../util/random'
import { getPlayersPerTeam } from '../player'

export default function getNextPsychicsInfo(
  psychicHistory: string[],
  players: Player[]
): { psychic_1?: string; psychic_2?: string; psychic_history: string[] } {
  let psychic_history = [...psychicHistory]
  const historyMap = toTruthMap(psychicHistory)

  const [team1, team2] = getPlayersPerTeam(players)

  function findTeamPsychic(team: Player[]): string | undefined {
    if (team.length > 0) {
      // Get the team 1 players who haven't been psychic as candidates
      const candidates1 = team.filter((p) => !historyMap[p.id])
      if (candidates1.length === 0) {
        // All of team 1 has been the psychic
        const teamMap = toTruthMap(team, (p) => p.id)
        const [history, rest] = partition((id) => teamMap[id], psychic_history)
        // Remove team 1 from the history
        psychic_history = rest
        // Set psychic to the player who hasn't been the psychic in the longest
        return history[history.length - 1]
      } else {
        // Set random psychic from the team 1 candidates
        return randomItem(candidates1).id
      }
    }
  }

  return {
    psychic_1: findTeamPsychic(team1),
    psychic_2: findTeamPsychic(team2),
    psychic_history,
  }
}

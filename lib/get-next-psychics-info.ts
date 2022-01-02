import { Player } from './types/game.types'
import { partition } from './util/array'
import { toTruthMap } from './util/object'
import { randomHourlyItem } from './util/random'
import { getPlayersPerTeam } from './player'

export interface NextPsychicInfo {
  psychic?: Player
  psychic_1?: string
  psychic_2?: string
  psychic_history: string[]
}

export interface NextPsychicInfoOptions {
  team?: 1 | 2
  ignoreIDs?: string[]
}

function findTeamPsychic(
  team: Player[],
  info: NextPsychicInfo,
  options: NextPsychicInfoOptions = {}
): NextPsychicInfo {
  const { psychic_history } = info
  const { ignoreIDs = [] } = options

  const historyMap = toTruthMap(psychic_history)

  if (team.length > 0) {
    // Get the team's players who haven't been psychic as candidates
    const candidates = team
      .filter((p) => !historyMap[p.id])
      .filter((p) => !ignoreIDs.includes(p.id))

    if (candidates.length === 0) {
      // All of the team has been the psychic
      const teamMap = toTruthMap(team, (p) => p.id)
      const [history, rest] = partition((id) => teamMap[id], psychic_history)

      // Set psychic to the player who hasn't been the psychic in the longest
      const id = history[history.length - 1]
      const psychic = team.find((p) => p.id === id)

      // Remove this team from the history
      return { ...info, psychic, psychic_history: rest }
    } else {
      // Set random psychic from candidates
      const psychic = randomHourlyItem(candidates, 0, 12)
      return { ...info, psychic }
    }
  }
  return info
}

export default function getNextPsychicsInfo(
  psychic_history: string[],
  players: Player[],
  options: NextPsychicInfoOptions = {}
): NextPsychicInfo {
  const { team } = options
  const [team1, team2] = getPlayersPerTeam(players)

  let next: NextPsychicInfo = { psychic_history }

  if (!team || team === 1) {
    next = findTeamPsychic(team1, next, options)
    next.psychic_1 = next.psychic?.id
  }

  if (!team || team === 2) {
    next = findTeamPsychic(team2, next, options)
    next.psychic_2 = next.psychic?.id
  }

  return next
}

import { CwdGame } from '../../types/cwd.types'
import getNextPsychicsInfo from './get-next-psychics-info'
import generateCwdCodesInfo from './generate-cwd-codes'

/**
 * Prep the new match, setting the turn to the team w/ the worst score
 * (or if tied, the team who doesn't currently have the turn)
 */
function getNextTurnTeam(game: CwdGame) {
  const s1 = game.score_team_1
  const s2 = game.score_team_2
  return s1 < s2 ? 2 : s1 > s2 ? 1 : game.team_turn === 1 ? 2 : 1
}

export function createPrepCwdMatchChanges(
  game: CwdGame,
  turn?: 1 | 2
): Partial<CwdGame> {
  const team_turn = turn ?? getNextTurnTeam(game)

  const codesInfo = generateCwdCodesInfo(team_turn)
  const score_team_1 = codesInfo.code_states.filter((c) => c === 1).length
  const score_team_2 = codesInfo.code_states.filter((c) => c === 2).length

  // Set the next 2 psychic, unless in designated psychic mode
  const psychicsInfo = !game.settings?.designated_psychic
    ? getNextPsychicsInfo(game.psychic_history, game.players)
    : {}

  return {
    ...codesInfo,
    ...psychicsInfo,
    code_reveals: [],
    guesses: {},
    visited: {},
    score_team_1,
    score_team_2,
    team_turn,
    phase: 'prep' as const,
  }
}

export default function prepCwdMatch(game: CwdGame, turn?: 1 | 2): CwdGame {
  const changes = createPrepCwdMatchChanges(game, turn ?? game.team_turn)
  return { ...game, ...changes }
}

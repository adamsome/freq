import { CwdGame } from '../../types/cwd.types'
import { User } from '../../types/user.types'
import { createPlayer } from '../player'
import prepCwdMatch from './prep-cwd-match'

export default function createNewCwdGame(
  room: string,
  user: User,
  team?: 1 | 2
): CwdGame {
  // Assign player to random team
  const team_turn = team ?? Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(user, team_turn, true)

  const game: CwdGame = {
    ...BLANK_GAME,
    room: room.toLowerCase(),
    players: [player],
    team_turn,
    room_started_at: new Date().toISOString(),
  }

  return prepCwdMatch(game, game.team_turn)
}

const BLANK_GAME: CwdGame = {
  room: '',
  players: [],
  psychic_history: [],
  code_words: [],
  code_states: [],
  code_reveals: [],
  guesses: {},
  visited: {},
  team_1_guesses: [],
  team_2_guesses: [],
  match_number: 0,
  round_number: 0,
  phase: 'prep',
  team_turn: 1,
  score_team_1: 0,
  score_team_2: 0,
  stats: {},
  room_started_at: '',
}

import { FreqGame } from '../../types/freq.types'
import { User } from '../../types/user.types'
import { createPlayer } from '../player'

const DEFAULT_TARGET_WIDTH = 22.5

export default function createNewFreqGame(
  room: string,
  user: User,
  team?: 1 | 2
): FreqGame {
  // Assign player to random team
  const team_turn = team ?? Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(user, team_turn, true)
  const game: FreqGame = {
    room: room.toLowerCase(),
    target_width: DEFAULT_TARGET_WIDTH,
    players: [player],
    psychic: user.id,
    next_psychic: user.id,
    psychic_history: [],
    clues: [],
    guesses: {},
    directions: {},
    match_number: 0,
    round_number: 0,
    phase: 'prep',
    team_turn,
    score_team_1: 0,
    score_team_2: 0,
    room_started_at: new Date().toISOString(),
  }
  return game
}

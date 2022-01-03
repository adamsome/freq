import { createPlayer } from '../player'
import { BlowGame } from '../types/blow.types'
import { User } from '../types/user.types'
import prepBlowMatch from './prep-blow-match'

export default function createNewBlowGame(room: string, user: User): BlowGame {
  // Since new game, player gets made leader
  const player = createPlayer(user)

  const game: BlowGame = {
    ...BLANK_GAME,
    room: room.toLowerCase(),
    players: [player],
    player_order: [player.id],
    room_started_at: new Date().toISOString(),
  }

  return prepBlowMatch(game)
}

const BLANK_GAME: BlowGame = {
  room: '',
  players: [],
  player_order: [],
  player_active: 0,
  match_number: 0,
  round_number: 0,
  phase: 'prep',
  stats: {},
  room_started_at: '',
}

import { createPlayer } from '../player'
import { BlowGame } from '../types/blow.types'
import { User } from '../types/user.types'
import prepBlowMatch from './prep-blow-match'
// import { prep } from './store/blow-reducer'

export default function createNewBlowGame(room: string, user: User): BlowGame {
  // Since new game, player gets made leader
  const player = createPlayer(user)

  const game: BlowGame = {
    ...initBlowGame(),
    room: room.toLowerCase(),
    players: [player],
    player_order: [0],
    room_started_at: new Date().toISOString(),
  }

  return prepBlowMatch(game)
}

export const initBlowGame = (): BlowGame => ({
  room: '',
  players: [],
  match_number: 0,
  round_number: 0,
  settings: {
    variant: 'basic',
  },
  phase: 'prep',
  player_order: [],
  actions: [],
  stats: {},
  room_started_at: '',
})

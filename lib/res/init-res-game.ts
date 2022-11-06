import { ResGame } from '../types/res.types'

export default function initResGame(): ResGame {
  return {
    room: '',
    players: [],
    match_number: 0,
    round_number: 0,
    phase: 'prep',
    player_order: [],
    room_started_at: '',
  }
}

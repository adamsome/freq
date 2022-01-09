import { BlowGame } from '../types/blow.types'

export default function initBlowGame(): BlowGame {
  return {
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
  }
}

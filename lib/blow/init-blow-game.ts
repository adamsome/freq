import { BlowGame } from '../types/blow.types'

export default function initBlowGame(): BlowGame {
  return {
    room: '',
    players: [],
    match_number: 0,
    round_number: 0,
    settings: {
      variant: 'basic',
      timer: {
        challenge: 5,
        'continue-turn': 5,
        'next-turn': 5,
        'decline-counter': 5,
      },
    },
    phase: 'prep',
    player_order: [],
    actions: [],
    stats: {},
    room_started_at: '',
  }
}

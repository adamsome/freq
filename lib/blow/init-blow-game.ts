import { BlowGame } from '../types/blow.types'

const DEFAULT_TIMEOUT = 7

export default function initBlowGame(): BlowGame {
  return {
    room: '',
    players: [],
    match_number: 0,
    round_number: 0,
    settings: {
      variant: 'basic',
      theme: 'magic',
      timer: {
        challenge: DEFAULT_TIMEOUT,
        continue_turn: DEFAULT_TIMEOUT,
        next_turn: DEFAULT_TIMEOUT,
        decline_counter: DEFAULT_TIMEOUT,
      },
    },
    phase: 'prep',
    player_order: [],
    actions: [],
    stats: {},
    room_started_at: '',
  }
}

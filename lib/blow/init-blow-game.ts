import { BlowGame } from '../types/blow.types'

const DEFAULT_TIMEOUT = 20
const DEFAULT_SHORT_TIMEOUT = 10

export default function initBlowGame(): BlowGame {
  return {
    room: '',
    players: [],
    match_number: 0,
    round_number: 0,
    settings: {
      variant: 'basic',
      theme: 'physical',
      timer: {
        challenge: DEFAULT_TIMEOUT,
        continue_turn: DEFAULT_SHORT_TIMEOUT,
        next_turn: DEFAULT_SHORT_TIMEOUT,
        decline_counter: DEFAULT_TIMEOUT,
        decline_challenge: DEFAULT_TIMEOUT,
      },
    },
    phase: 'prep',
    player_order: [],
    actions: [],
    stats: {},
    room_started_at: '',
  }
}

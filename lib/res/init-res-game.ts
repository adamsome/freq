import { ResGame } from '../types/res.types'

export default function initResGame(): ResGame {
  return {
    room: '',
    players: [],
    match_number: 0,
    round_number: 0,
    phase: 'prep',
    step: 'spy_reveal',
    player_order: [],
    spies: [],
    rounds: [{ lead: 0, team: [], votes: [], result: [] }],
    room_started_at: '',
  }
}

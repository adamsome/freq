import { Game, Player } from '../types/game.types'
import { isGuessingPhase } from './phase'
import { createPlayer, getPlayersPerTeam, getTeamPlayers } from './player'

const DEFAULT_TARGET_WIDTH = 22.5

export function createNewGame(room: string, userID: string): Game {
  // Assign player to random team
  const team = Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(userID, team, true)
  const game: Game = {
    room: room.toLowerCase(),
    target_width: DEFAULT_TARGET_WIDTH,
    players: [player],
    psychic: userID,
    clues: [],
    guesses: {},
    match_number: 1,
    round_number: 0,
    phase: 'prep',
    team_turn: team,
    score_team_1: team === 1 ? 0 : 1,
    score_team_2: team === 2 ? 0 : 1,
    game_started_at: new Date().toISOString(),
  }
  return game
}

export function doesGameHaveEnoughPlayers(game: Game) {
  const teams = getPlayersPerTeam(game.players)
  return teams[0].length > 1 && teams[1].length > 1
}

export function isRoomValid(room?: string): room is string {
  return (
    room != null &&
    typeof room === 'string' &&
    room.length < 16 &&
    !!room.match(/^[a-z0-9]+$/i)
  )
}

export function getTeamName(team?: 1 | 2): string {
  switch (team) {
    case 1:
      return 'Red'
    case 2:
      return 'Blue'
    default:
      return 'Audience'
  }
}

export function getPsychic(game: Game): Player {
  const psychic = game.players.find((p) => p.id === game.psychic)
  if (!psychic) {
    throw new Error('Enexpected error: No player is set as psychic.')
  }
  return psychic
}

export function getNextPsychic(game: Game, team: 1 | 2): Player {
  const players = getTeamPlayers(game.players, team)
  let leastPsychic: Player | undefined
  for (const player of players) {
    if (
      !leastPsychic ||
      (player.psychic_count ?? 0) < (leastPsychic.psychic_count ?? 0)
    ) {
      leastPsychic = player
    }
  }
  if (!leastPsychic) {
    throw new Error('Unexpected error: No next psychic found.')
  }
  return leastPsychic
}

export function isInvalidPlayerTeamChange(
  game: Game,
  player: Player
): string | undefined {
  if (player.id === game.psychic)
    return "Cannot change the psychic's team. Must change psychic first."

  const phase = game.phase
  if (phase === 'prep' || phase === 'win') return

  if (isGuessingPhase(phase) && game.guesses?.[player.id]?.value != null)
    return "Cannot change a player who's already guessed"

  const team = game.players
    .filter((p) => p.team === player.team)
    .filter((p) => p.id !== player.id)
  if (team.length < 2) return 'Cannot change player team that leaves team empty'
}

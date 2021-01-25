import { Game } from '../types/game.types'
import { randomClues } from './clue'
import { createPlayer } from './player'

export function createNewGame(room: string, userID: string): Game {
  // Assign player to random team
  const team = Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(userID, team, true)
  const clues = randomClues()
  const game_started_at = new Date().toISOString()
  const game: Game = {
    room: room.toLowerCase(),
    players: [player],
    psychic: userID,
    clues,
    guesses: {},
    match_number: 1,
    round_number: 1,
    phase: 'prep',
    team_turn: team,
    score_team_1: 0,
    score_team_2: 1,
    game_started_at,
    round_started_at: game_started_at,
  }
  return game
}

export function doesGameHavePlayer(game: Game, userID: string) {
  return game.players.some((p) => p.id === userID)
}

/**
 * Get count of players on each team (index 0 indicates no team)
 */
function getCountByTeam(game: Game): number[] {
  return game.players.reduce((acc, p) => {
    const t = p.team ?? 0
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, [] as number[])
}

export function addGamePlayer(game: Game, userID: string): Game {
  const countByTeam = getCountByTeam(game)
  // Put new player on the smallest team
  const team = (countByTeam[1] ?? 0) > (countByTeam[2] ?? 0) ? 2 : 1
  // Make leader if team has none
  const leader = !game.players.some((p) => p.team === team && p.leader)
  // Return game w/ new player added
  const player = createPlayer(userID, team, leader, game.players)
  const players = [...game.players, player]
  return { ...game, players }
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

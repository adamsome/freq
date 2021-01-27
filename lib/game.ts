import { Game, Guess, Player } from '../types/game.types'
import { createPlayer, getPlayersPerTeam, getTeamPlayers } from './player'

export function createNewGame(room: string, userID: string): Game {
  // Assign player to random team
  const team = Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(userID, team, true)
  const game: Game = {
    room: room.toLowerCase(),
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

export function doesGameHavePlayer(game: Game, userID: string) {
  return game.players.some((p) => p.id === userID)
}

export function doesGameHaveEnoughPlayers(game: Game) {
  const teams = getPlayersPerTeam(game.players)
  return teams[0].length > 1 && teams[1].length > 1
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

export function getGamePsychic(game: Game): Player {
  const psychic = game.players.find((p) => p.id === game.psychic)
  if (!psychic) {
    throw new Error('Enexpected error: No player is set as psychic.')
  }
  return psychic
}

export function isPlayerPsychic(userID: string, game: Game): boolean {
  return userID === game.psychic
}

export function isInvalidPlayerTeamChange(
  game: Game,
  player: Player
): string | undefined {
  if (player.id === game.psychic)
    return "Cannot change the psychic's team. Must change psychic first."

  const phase = game.phase
  if (phase === 'prep' || phase === 'win') return

  const guessPhase = phase === 'choose' || phase === 'direction'
  if (guessPhase && game.guesses?.[player.id]?.value != null)
    return "Cannot change a player who's already guessed"

  const team = game.players
    .filter((p) => p.team === player.team)
    .filter((p) => p.id !== player.id)
  if (team.length < 2)
    throw new Error('Cannot change player team that leaves team empty')
}

export function areAllGuessesLocked(
  game: Game,
  ...ignorePlayers: Player[]
): boolean {
  const { players, psychic, team_turn } = game
  const guessers = getTeamPlayers(players, team_turn, psychic, ...ignorePlayers)
  for (const guesser of guessers) {
    if (!game.guesses?.[guesser.id].locked) {
      return false
    }
  }
  return true
}

interface GuessInfo {
  numNeeded: number
  numSet: number
  numLocked: number
  guesses: Guess[]
}

export function getGuessInfo(game: Game, team?: 1 | 2): GuessInfo {
  const { players, psychic } = game
  const guessers = getTeamPlayers(players, team, psychic)
  const numNeeded = guessers.length
  return guessers.reduce(
    (acc, p) => {
      const guess: Guess | undefined = game.guesses?.[p.id]
      if (guess?.value != null) {
        if (guess?.locked === true) {
          acc.numLocked++
        }
        acc.numSet++
        acc.guesses.push(guess)
      }
      return acc
    },
    { numNeeded, numSet: 0, numLocked: 0, guesses: [] } as GuessInfo
  )
}

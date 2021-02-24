import { Game, GameView, Player } from '../types/game.types'
import { User } from '../types/user.types'
import { randomHourlyItem } from '../util/random'
import { isFreePhase, isGuessingPhase } from './phase'
import { createPlayer, getPlayersPerTeam, getTeamPlayers } from './player'

const DEFAULT_TARGET_WIDTH = 22.5

export function createNewGame(room: string, user: User): Game {
  // Assign player to random team
  const team = Math.random() < 0.5 ? 1 : 2
  // Since new game, player gets made leader
  const player = createPlayer(user, team, true)
  const game: Game = {
    room: room.toLowerCase(),
    target_width: DEFAULT_TARGET_WIDTH,
    players: [player],
    psychic: user.id,
    next_psychic: user.id,
    clues: [],
    guesses: {},
    directions: {},
    match_number: 0,
    round_number: 0,
    phase: 'prep',
    team_turn: team,
    score_team_1: 0,
    score_team_2: 0,
    game_started_at: new Date().toISOString(),
  }
  return game
}

export function doesGameHaveEnoughPlayers(game: Game) {
  const teams = getPlayersPerTeam(game.players)
  return teams[0].length > 1 && teams[1].length > 1
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

export function getPsychic(game: Game): Player | undefined {
  return game.players.find((p) => p.id === game.psychic)
}

export function getNextPsychic(
  game: Game,
  ...ignorePlayers: (string | { id: string })[]
): Player | undefined {
  const { next_psychic, team_turn, repeat_turn, players } = game
  const ignoreIDs = ignorePlayers.map((p) => (typeof p === 'string' ? p : p.id))

  if (next_psychic && !ignorePlayers.includes(next_psychic)) {
    const next = players.find((p) => p.id === next_psychic)
    if (next) return next
  }

  const otherTeam = repeat_turn ? team_turn : team_turn === 1 ? 2 : 1
  const teamPlayers = getTeamPlayers(players, otherTeam)
  let leastPsychics: Player[] = []
  let leastPsychicCount = 0
  for (const player of teamPlayers) {
    if (ignoreIDs.includes(player.id)) continue

    const playerCount = game.psychic_counts?.[player.id] ?? 0

    if (leastPsychics.length === 0) {
      leastPsychics.push(player)
      leastPsychicCount = playerCount
    }

    if (playerCount < leastPsychicCount) {
      leastPsychics = [player]
      leastPsychicCount = playerCount
    } else if (playerCount === leastPsychicCount) {
      leastPsychics.push(player)
    }
  }
  return leastPsychics.length <= 1
    ? leastPsychics[0]
    : randomHourlyItem(leastPsychics, 0, 12)
}

export function isInvalidPlayerTeamChange(
  game: GameView,
  player: Player
): string | undefined {
  const nextPsychic = getNextPsychic(game)
  if (player.id === nextPsychic?.id && game.canChangePsychicTo !== 'any')
    return "Cannot change the next psychic's team."

  // Any team change allowed in free phases
  if (isFreePhase(game.phase)) return

  if (player.id === game.psychic) return "Cannot change the psychic's team."

  if (isGuessingPhase(game.phase)) {
    if (game.guesses?.[player.id]?.value != null) {
      return "Cannot change a player who's already guessed."
    }
    if (game.directions?.[player.id]?.value != null) {
      return "Cannot change a player who's already guessed a direction."
    }
  }

  const team = game.players
    .filter((p) => p.team === player.team)
    .filter((p) => p.id !== player.id)
  if (team.length < 2)
    return 'Cannot change player team that leaves team empty.'
}

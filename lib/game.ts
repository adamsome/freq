import { Db } from 'mongodb'
import { Clue, Game, Player } from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { connectToDatabase } from '../util/mongodb'
import { omit } from '../util/object'

const fromCollection = (db: Db) => db.collection<Game & HasObjectID>('games')
const omitID = <T extends object>(obj?: (T & HasObjectID) | null) =>
  obj ? (omit(obj, '_id') as T) : null

export async function fetchGame(game_id?: string): Promise<Game | null> {
  const { db } = await connectToDatabase()
  if (!game_id) {
    return null
  }
  const game = await fromCollection(db).findOne({ game_id })
  return omitID(game)
}

export async function joinGame(
  game_id: string,
  player_id: string
): Promise<Game> {
  // Find existing game if it exists
  let game = await fetchGame(game_id)
  if (!game) {
    // Create new game
    game = await createGame(game_id, player_id)
  } else {
    // Add player to game if not already
    if (!hasPlayer(game, player_id)) {
      game = await addPlayer(game, player_id)
    }
  }
  return game
}

async function createGame(game_id: string, player_id: string): Promise<Game> {
  // Assign player to random team
  const team = Math.random() < 0.5 ? 1 : 2
  const color = team == 1 ? 'red' : 'blue'
  // Since new game, player gets made leader
  const player: Player = { player_id, leader: true, team, color }
  const clue1: Clue = { left: 'TODO1', right: 'TODO2', gradient: 'TODO3' }
  const clue2: Clue = { left: 'TODO4', right: 'TODO5', gradient: 'TODO6' }
  const game_started_at = new Date().toISOString()
  const game: Game = {
    game_id,
    players: [player],
    psychic: player_id,
    clues: [clue1, clue2],
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

  const { db } = await connectToDatabase()
  await fromCollection(db).insertOne(game)

  return game
}

function hasPlayer(game: Game, player_id: string) {
  return game.players.some((p) => p.player_id === player_id)
}

async function addPlayer(existingGame: Game, player_id: string): Promise<Game> {
  const players = existingGame.players
  // Get count of players on each team (index 0 indicates no team)
  const countByTeam = players.reduce((acc, p) => {
    const t = p.team ?? 0
    acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, [] as number[])
  // Put new player on the smallest team
  const team = (countByTeam[1] ?? 0) > (countByTeam[2] ?? 0) ? 2 : 1
  const color = team == 1 ? 'red' : 'blue'
  const player: Player = { player_id, leader: true, team, color }
  // Return game w/ new player added
  const game: Game = {
    ...existingGame,
    players: [...players, player],
  }
  // Update game if added player
  const { db } = await connectToDatabase()
  const filter = { game_id: game.game_id }
  const update = { players: game.players }
  await fromCollection(db).updateOne(filter, { $set: update })

  return game
}

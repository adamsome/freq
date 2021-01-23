import { Db } from 'mongodb'
import { Game } from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { connectToDatabase } from '../util/mongodb'
import { omit } from '../util/object'
import { addGamePlayer, createNewGame, doesGameHavePlayer } from './game'

const fromCollection = (db: Db) => db.collection<Game & HasObjectID>('games')
// eslint-disable-next-line @typescript-eslint/ban-types
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
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)

  // Find existing game if it exists
  let game = await fetchGame(game_id)
  if (!game) {
    // Create new game
    game = createNewGame(game_id, player_id)

    await collection.insertOne(game)
  } else {
    // Add player to game if not already
    if (!doesGameHavePlayer(game, player_id)) {
      game = addGamePlayer(game, player_id)

      const filter = { game_id: game.game_id }
      const update = { players: game.players }
      await collection.updateOne(filter, { $set: update })
    }
  }
  return game
}

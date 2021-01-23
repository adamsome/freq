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

export async function fetchGame(room?: string): Promise<Game | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  const game = await fromCollection(db).findOne({ room: room })
  return omitID(game)
}

export async function joinGame(room: string, player_id: string): Promise<Game> {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)

  // Find existing game if it exists
  let game = await fetchGame(room)
  if (!game) {
    // Create new game
    game = createNewGame(room, player_id)

    await collection.insertOne(game)
  } else {
    // Add player to game if not already
    if (!doesGameHavePlayer(game, player_id)) {
      game = addGamePlayer(game, player_id)

      const filter = { room: game.room }
      const update = { players: game.players }
      await collection.updateOne(filter, { $set: update })
    }
  }
  return game
}

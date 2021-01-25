import { Db } from 'mongodb'
import { Game, GameView } from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { connectToDatabase } from '../util/mongodb'
import { addGamePlayer, createNewGame, doesGameHavePlayer } from './game'
import { toGameView } from './game-view'

const fromCollection = (db: Db) => db.collection<Game & HasObjectID>('games')

export async function fetchGame(room?: string): Promise<Game | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromCollection(db).findOne({ room: room.toLowerCase() })
}

export async function joinGame(
  room: string,
  userID: string
): Promise<GameView> {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)

  // Find existing game if it exists
  let game = await fetchGame(room)
  if (!game) {
    // Create new game
    game = createNewGame(room, userID)

    await collection.insertOne(game)
  } else {
    // Add player to game if not already
    if (!doesGameHavePlayer(game, userID)) {
      game = addGamePlayer(game, userID)

      const filter = { room: game.room.toLowerCase() }
      const update = { players: game.players }
      await collection.updateOne(filter, { $set: update })
    }
  }
  return toGameView(userID, game)
}

export async function updateGameProp(
  room: string,
  prop: string,
  value: number
) {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)
  const filter = { room: room.toLowerCase() }
  const update = { [prop]: value }
  await collection.updateOne(filter, { $set: update })
}

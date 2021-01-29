import { Db } from 'mongodb'
import { Game, GameView } from '../types/game.types'
import { HasObjectID } from '../types/io.types'
import { head } from '../util/array'
import { connectToDatabase } from '../util/mongodb'
import { createNewGame, getNextPsychic } from './game'
import { toGameView } from './game-view'
import { addPlayer, getTeamPlayers, hasPlayer } from './player'

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
  userID: string,
  // TODO: Implement leave old room
  _prevRoom?: string
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
    if (!hasPlayer(game.players, userID)) {
      game.players = addPlayer(game.players, userID)

      const filter = { room: game.room.toLowerCase() }
      const update = { players: game.players }
      await collection.updateOne(filter, { $set: update })
    }
  }
  return toGameView(userID, game)
}

export async function leaveGame(room: string, userID: string) {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)

  // Find existing game if it exists
  const game = await fetchGame(room)

  if (!game) return

  const filter = { room: room.toLowerCase() }

  if (game.psychic === userID) {
    const team = getTeamPlayers(game.players, game.team_turn, userID)
    const psychic = head(team) ?? head(game.players)
    if (psychic) {
      const update = { psychic: psychic.id }
      await collection.updateOne(filter, { $set: update })
    }
  }
  if (game.next_psychic === userID) {
    const nextPsychic = getNextPsychic(game) ?? head(game.players)
    if (nextPsychic) {
      const update = { next_psychic: nextPsychic.id }
      await collection.updateOne(filter, { $set: update })
    }
  }
  const playerIndex = game.players.findIndex((p) => p.id === userID)
  if (playerIndex >= 0) {
    const players = game.players.filter((p) => p.id !== userID)
    const update = { players }
    await collection.updateOne(filter, { $set: update })

    if (players.length === 0) {
      await collection.deleteOne(filter)
    }
  }
}

export async function updateGamePath(room: string, path: string, value: any) {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)
  const filter = { room: room.toLowerCase() }
  const update = { [path]: value }
  await collection.updateOne(filter, { $set: update })
}

export async function deleteGameProp<K extends keyof Game>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const collection = fromCollection(db)
  const filter = { room: room.toLowerCase() }
  await collection.updateOne(filter, { $unset: { [prop]: '' } })
}

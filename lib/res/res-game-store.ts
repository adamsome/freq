import { Db, OptionalUnlessRequiredId } from 'mongodb'
import { addPlayer, createPlayer, hasPlayer } from '../player'
import { ResGame, ResGameView } from '../types/res.types'
import { User } from '../types/user.types'
import { fromUsers } from '../user-store'
import { connectToDatabase } from '../util/mongodb'
import { buildResGameView } from './res-game-view'
import initResGame from './init-res-game'

export const fromResGames = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<ResGame>>('res_games')

export async function fetchResGame(room?: string): Promise<ResGame | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromResGames(db).findOne({ room: room.toLowerCase() })
}

export async function findManyResGames(
  rooms: string[],
  { limit = 10 }: { limit?: number } = {}
): Promise<ResGame[]> {
  const { db } = await connectToDatabase()

  return await fromResGames(db)
    .find({ room: { $in: rooms } })
    .sort({ round_started_at: -1 })
    .limit(limit)
    .toArray()
}

export async function joinResGame(
  room: string,
  user: User
): Promise<ResGameView> {
  const { db } = await connectToDatabase()
  const store = fromResGames(db)

  const updateUserRoom = async () => {
    const userFilter = { id: user.id }
    await fromUsers(db).updateOne(userFilter, {
      $set: {
        [`rooms.${room}`]: new Date().toISOString(),
      },
    })
  }

  // Find existing game if it exists
  let game: ResGame | null = await fetchResGame(room)
  if (!game) {
    // Create new game
    const player = createPlayer(user)
    game = {
      ...initResGame(),
      room: room.toLowerCase(),
      players: [player],
      player_order: [0],
      room_started_at: new Date().toISOString(),
    }

    await store.insertOne(game)
    await updateUserRoom()
  } else {
    // Add player to game if not already
    if (!hasPlayer(game.players, user.id)) {
      const playerCount = game.players.length
      game.players = addPlayer(game.players, user, { forceLeader: true })
      game.player_order = [...game.player_order, playerCount]

      const gameFilter = { room: game.room.toLowerCase() }
      const changes: Partial<ResGame> = {}
      const kicked = { ...game.kicked }
      delete kicked[user.id]
      changes.kicked = kicked
      changes.players = game.players
      changes.player_order = game.player_order

      await store.updateOne(gameFilter, { $set: changes })

      await updateUserRoom()
    }
  }
  return buildResGameView(game, user.id)
}

export async function leaveResGame(
  room: string,
  userID: string,
  opts: { deleteEmpty?: boolean } = {}
) {
  const { db } = await connectToDatabase()
  const store = fromResGames(db)

  // Find existing game if it exists
  const game = await fetchResGame(room)
  if (!game) return

  const filter = { room: room.toLowerCase() }

  const playerIndex = game.players.findIndex((p) => p.id === userID)
  if (playerIndex >= 0) {
    const players = game.players.filter((p) => p.id !== userID)

    // Remove from the player order and decrement any player index above the
    // index of the player being removed from the player list
    const player_order = game.player_order
      .filter((i) => i !== playerIndex)
      .map((i) => (i > playerIndex ? i - 1 : i))

    const update: Partial<ResGame> = { players, player_order }
    await store.updateOne(filter, { $set: update })

    if (opts.deleteEmpty && players.length === 0) {
      await store.deleteOne(filter)
    }
  }
}

export async function deleteResGameProp<K extends keyof ResGame>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const store = fromResGames(db)
  const filter = { room: room.toLowerCase() }
  await store.updateOne(filter, { $unset: { [prop]: '' } })
}

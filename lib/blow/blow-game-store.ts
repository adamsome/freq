import { Db, OptionalUnlessRequiredId } from 'mongodb'
import { addPlayer, createPlayer, hasPlayer } from '../player'
import { BlowGame, BlowGameView } from '../types/blow.types'
import { User } from '../types/user.types'
import { fromUsers } from '../user-store'
import { connectToDatabase } from '../util/mongodb'
import { buildBlowGameView } from './blow-game-view'
import initBlowGame from './init-blow-game'

export const fromBlowGames = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<BlowGame>>('blow_games')

export async function fetchBlowGame(room?: string): Promise<BlowGame | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromBlowGames(db).findOne({ room: room.toLowerCase() })
}

export async function findManyBlowGames(
  rooms: string[],
  limit = 10
): Promise<BlowGame[]> {
  const { db } = await connectToDatabase()

  return await fromBlowGames(db)
    .find({ room: { $in: rooms } })
    .sort({ round_started_at: -1 })
    .limit(limit)
    .toArray()
}

export async function joinBlowGame(
  room: string,
  user: User
): Promise<BlowGameView> {
  const { db } = await connectToDatabase()
  const store = fromBlowGames(db)

  const updateUserRoom = async () => {
    const userFilter = { id: user.id }
    await fromUsers(db).updateOne(userFilter, {
      $set: {
        [`rooms.${room}`]: new Date().toISOString(),
      },
    })
  }

  // Find existing game if it exists
  let game: BlowGame | null = await fetchBlowGame(room)
  if (!game) {
    // Create new game
    const player = createPlayer(user)
    game = {
      ...initBlowGame(),
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
      const changes: Partial<BlowGame> = {}
      const kicked = { ...game.kicked }
      delete kicked[user.id]
      changes.kicked = kicked
      changes.players = game.players
      changes.player_order = game.player_order

      await store.updateOne(gameFilter, { $set: changes })

      await updateUserRoom()
    }
  }
  return buildBlowGameView(user.id, game)
}

export async function leaveBlowGame(
  room: string,
  userID: string,
  opts: { deleteEmpty?: boolean } = {}
) {
  const { db } = await connectToDatabase()
  const store = fromBlowGames(db)

  // Find existing game if it exists
  const game = await fetchBlowGame(room)
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

    const update: Partial<BlowGame> = { players, player_order }
    await store.updateOne(filter, { $set: update })

    if (opts.deleteEmpty && players.length === 0) {
      await store.deleteOne(filter)
    }
  }
}

export async function updateBlowGamePath(
  room: string,
  path: string,
  value: unknown
) {
  const { db } = await connectToDatabase()
  const store = fromBlowGames(db)
  const filter = { room: room.toLowerCase() }
  const update = { [path]: value }
  await store.updateOne(filter, { $set: update })
}

export async function deleteBlowGameProp<K extends keyof BlowGame>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const store = fromBlowGames(db)
  const filter = { room: room.toLowerCase() }
  await store.updateOne(filter, { $unset: { [prop]: '' } })
}

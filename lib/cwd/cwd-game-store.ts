import { Db, WithId } from 'mongodb'
import { CwdGame, CwdGameView, FullCwdGameView } from '../../types/cwd.types'
import { User } from '../../types/user.types'
import { head } from '../../util/array'
import { connectToDatabase } from '../../util/mongodb'
import { addPlayer, getTeamPlayers, hasPlayer } from '../player'
import { fromUsers } from '../user-store'
import createNewCwdGame from './create-new-cwd-game'
import { toCwdGameView, toFullCwdGameView } from './cwd-game-view'

export const fromCwdGames = (db: Db) =>
  db.collection<WithId<CwdGame>>('cwd_games')

export async function fetchCwdGame(room?: string): Promise<CwdGame | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromCwdGames(db).findOne({ room: room.toLowerCase() })
}

export async function findManyCwdGames(
  rooms: string[],
  limit = 10
): Promise<CwdGame[]> {
  const { db } = await connectToDatabase()

  return await fromCwdGames(db)
    .find({ room: { $in: rooms } })
    .sort({ round_started_at: -1 })
    .limit(limit)
    .toArray()
}

export async function joinCwdGame(
  room: string,
  user: User,
  team?: 1 | 2
): Promise<CwdGameView> {
  const { db } = await connectToDatabase()
  const store = fromCwdGames(db)

  const updateUserRoom = async () => {
    const userFilter = { id: user.id }
    await fromUsers(db).updateOne(userFilter, {
      $set: {
        [`rooms.${room}`]: new Date().toISOString(),
      },
    })
  }

  // Find existing game if it exists
  let game = await fetchCwdGame(room)
  if (!game) {
    // Create new game
    game = createNewCwdGame(room, user, team)

    await store.insertOne(game)
    await updateUserRoom()
  } else {
    // Add player to game if not already
    if (!hasPlayer(game.players, user.id)) {
      game.players = addPlayer(game.players, user, team)

      const gameFilter = { room: game.room.toLowerCase() }
      const kicked = { ...game.kicked }
      delete kicked[user.id]
      await store.updateOne(gameFilter, {
        $set: {
          players: game.players,
          kicked,
        },
      })

      await updateUserRoom()
    }
  }
  return toCwdGameView(user.id, game)
}

export async function leaveCwdGame(
  room: string,
  userID: string,
  opts: { deleteEmpty?: boolean } = {}
) {
  const { db } = await connectToDatabase()
  const store = fromCwdGames(db)

  // Find existing game if it exists
  const game = await fetchCwdGame(room)
  if (!game) return

  const filter = { room: room.toLowerCase() }

  // If psychic change to teammate
  if (game.psychic_1 === userID) {
    const team = getTeamPlayers(game.players, game.team_turn, userID)
    const psychic = head(team)
    if (psychic)
      await store.updateOne(filter, { $set: { psychic_1: psychic.id } })
  }
  if (game.psychic_2 === userID) {
    const team = getTeamPlayers(game.players, game.team_turn, userID)
    const psychic = head(team)
    if (psychic)
      await store.updateOne(filter, { $set: { psychic_2: psychic.id } })
  }

  if (game.guesses?.[userID]?.locked !== true) {
    const guesses = { ...game.guesses }
    delete guesses[userID]
    const update = { guesses }
    await store.updateOne(filter, { $set: update })
  }
  const playerIndex = game.players.findIndex((p) => p.id === userID)
  if (playerIndex >= 0) {
    const players = game.players.filter((p) => p.id !== userID)
    const update = { players }
    await store.updateOne(filter, { $set: update })

    if (opts.deleteEmpty && players.length === 0) {
      await store.deleteOne(filter)
    }
  }
}

// TODO: Ensure the code_states CodeInfo is included
export async function fetchFullCwdGameView(
  room: string,
  userID: string
): Promise<FullCwdGameView> {
  const game = await fetchCwdGame(room)

  if (!game) {
    const message = `Cannot command non-existant game (room '${room}').`
    throw new Error(message)
  }

  return toFullCwdGameView(userID, game)
}

export async function updateCwdGamePath(
  room: string,
  path: string,
  value: any
) {
  const { db } = await connectToDatabase()
  const store = fromCwdGames(db)
  const filter = { room: room.toLowerCase() }
  const update = { [path]: value }
  await store.updateOne(filter, { $set: update })
}

export async function deleteCwdGameProp<K extends keyof CwdGame>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const store = fromCwdGames(db)
  const filter = { room: room.toLowerCase() }
  await store.updateOne(filter, { $unset: { [prop]: '' } })
}

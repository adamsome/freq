import { Db, OptionalUnlessRequiredId } from 'mongodb'
import { addPlayer, getTeamPlayers, hasPlayer } from '../player'
import {
  CurrentFreqGameView,
  FreqGame,
  FreqGameView,
} from '../types/freq.types'
import { User } from '../types/user.types'
import { fromUsers } from '../user-store'
import { head } from '../util/array'
import { connectToDatabase } from '../util/mongodb'
import createNewFreqGame from './create-new-freq-game'
import { isCurrentFreqGameView, toFreqGameView } from './freq-game-view'
import { getNextPsychic } from './freq-psychic'

export const fromGames = (db: Db) =>
  db.collection<OptionalUnlessRequiredId<FreqGame>>('games')

export async function fetchFreqGame(room?: string): Promise<FreqGame | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromGames(db).findOne({ room: room.toLowerCase() })
}

export async function findManyFreqGames(
  rooms: string[],
  { limit = 10 }: { limit?: number } = {}
): Promise<FreqGame[]> {
  const { db } = await connectToDatabase()

  return await fromGames(db)
    .find({ room: { $in: rooms } })
    .sort({ round_started_at: -1 })
    .limit(limit)
    .toArray()
}

export async function joinFreqGame(
  room: string,
  user: User,
  team?: 1 | 2
): Promise<FreqGameView> {
  const { db } = await connectToDatabase()
  const games = fromGames(db)

  const updateUserRoom = async () => {
    const userFilter = { id: user.id }
    await fromUsers(db).updateOne(userFilter, {
      $set: {
        [`rooms.${room}`]: new Date().toISOString(),
      },
    })
  }

  // Find existing game if it exists
  let game = await fetchFreqGame(room)
  if (!game) {
    // Create new game
    game = createNewFreqGame(room, user, team)

    await games.insertOne(game)
    await updateUserRoom()
  } else {
    // Add player to game if not already
    if (!hasPlayer(game.players, user.id)) {
      game.players = addPlayer(game.players, user, { team, assignTeam: true })

      const gameFilter = { room: game.room.toLowerCase() }
      const kicked = { ...game.kicked }
      delete kicked[user.id]
      await games.updateOne(gameFilter, {
        $set: {
          players: game.players,
          kicked,
        },
      })

      await updateUserRoom()
    }
  }
  return toFreqGameView(user.id, game)
}

export async function leaveFreqGame(
  room: string,
  userID: string,
  opts: { deleteEmpty?: boolean } = {}
) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)

  // Find existing game if it exists
  const game = await fetchFreqGame(room)
  if (!game) return

  const filter = { room: room.toLowerCase() }

  // If psychic change to teammate
  if (game.psychic === userID) {
    const team = getTeamPlayers(game.players, game.team_turn, userID)
    const psychic = head(team) ?? head(game.players)
    if (psychic) {
      const update = { psychic: psychic.id }
      await games.updateOne(filter, { $set: update })
    }
  }
  // If next psychic, change to the next psychic who is not the user
  if (game.next_psychic === userID) {
    const info = getNextPsychic(game, userID)
    const { psychic = head(game.players), psychic_history } = info
    if (psychic) {
      const update = { next_psychic: psychic.id, psychic_history }
      await games.updateOne(filter, { $set: update })
    }
  }
  if (game.guesses?.[userID]?.locked !== true) {
    const needles = { ...game.guesses }
    delete needles[userID]
    const update = { guesses: needles }
    await games.updateOne(filter, { $set: update })
  }
  if (game.directions?.[userID]?.locked !== true) {
    const needles = { ...game.directions }
    delete needles[userID]
    const update = { directions: needles }
    await games.updateOne(filter, { $set: update })
  }
  const playerIndex = game.players.findIndex((p) => p.id === userID)
  if (playerIndex >= 0) {
    const players = game.players.filter((p) => p.id !== userID)
    const update = { players }
    await games.updateOne(filter, { $set: update })

    if (opts.deleteEmpty && players.length === 0) {
      await games.deleteOne(filter)
    }
  }
}

export async function fetchCurrentFreqGameView(
  room: string,
  userID: string
): Promise<CurrentFreqGameView> {
  const game = await fetchFreqGame(room)

  if (!game) {
    const message = `Cannot command non-existant game (room '${room}').`
    throw new Error(message)
  }

  const gameView = toFreqGameView(userID, game, { forceTarget: true })

  if (!isCurrentFreqGameView(gameView)) {
    const message = `Cannot command game w/ no current user.`
    throw new Error(message)
  }

  return gameView
}

export async function updateFreqGamePath(
  room: string,
  path: string,
  value: unknown
) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)
  const filter = { room: room.toLowerCase() }
  const update = { [path]: value }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await games.updateOne(filter, { $set: update } as any)
}

export async function deleteFreqGameProp<K extends keyof FreqGame>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)
  const filter = { room: room.toLowerCase() }
  await games.updateOne(filter, { $unset: { [prop]: '' } })
}

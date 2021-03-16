import { Db, WithId } from 'mongodb'
import { CurrentGameView, Game, GameView } from '../types/game.types'
import { User } from '../types/user.types'
import { head } from '../util/array'
import { connectToDatabase } from '../util/mongodb'
import { createNewGame, getNextPsychic } from './game'
import { isCurrentGameView, toGameView } from './game-view'
import { addPlayer, getTeamPlayers, hasPlayer } from './player'
import { fromUsers } from './user-store'

export const fromGames = (db: Db) => db.collection<WithId<Game>>('games')

export async function fetchGame(room?: string): Promise<Game | null> {
  const { db } = await connectToDatabase()
  if (!room) {
    return null
  }
  return await fromGames(db).findOne({ room: room.toLowerCase() })
}

export async function findManyGames(rooms: string[]): Promise<Game[]> {
  const { db } = await connectToDatabase()

  return await fromGames(db)
    .find({ room: { $in: rooms } })
    .sort({ round_started_at: -1 })
    .limit(10)
    .toArray()
}

export async function joinGame(
  room: string,
  user: User,
  team?: 1 | 2
): Promise<GameView> {
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
  let game = await fetchGame(room)
  if (!game) {
    // Create new game
    game = createNewGame(room, user, team)

    await games.insertOne(game)
    await updateUserRoom()
  } else {
    // Add player to game if not already
    if (!hasPlayer(game.players, user.id)) {
      game.players = addPlayer(game.players, user, team)

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
  return toGameView(user.id, game)
}

export async function leaveGame(
  room: string,
  userID: string,
  opts: { deleteEmpty?: boolean } = {}
) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)

  // Find existing game if it exists
  const game = await fetchGame(room)
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
    const nextPsychic = getNextPsychic(game, userID) ?? head(game.players)
    if (nextPsychic) {
      const update = { next_psychic: nextPsychic.id }
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

export async function fetchCurrentGameView(
  room: string,
  userID: string
): Promise<CurrentGameView> {
  const game = await fetchGame(room)

  if (!game) {
    const message = `Cannot command non-existant game (room '${room}').`
    throw new Error(message)
  }

  const gameView = toGameView(userID, game, { forceTarget: true })

  if (!isCurrentGameView(gameView)) {
    const message = `Cannot command game w/ no current user.`
    throw new Error(message)
  }

  return gameView
}

export async function updateGamePath(room: string, path: string, value: any) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)
  const filter = { room: room.toLowerCase() }
  const update = { [path]: value }
  await games.updateOne(filter, { $set: update })
}

export async function deleteGameProp<K extends keyof Game>(
  room: string,
  prop: K
) {
  const { db } = await connectToDatabase()
  const games = fromGames(db)
  const filter = { room: room.toLowerCase() }
  await games.updateOne(filter, { $unset: { [prop]: '' } })
}

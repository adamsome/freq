import { CwdGame, FullCwdGameView } from '../../../types/cwd.types'
import { connectToDatabase } from '../../../util/mongodb'
import { assignColor } from '../../color-dict'
import { isPlayer } from '../../player'
import { fromCwdGames } from '../cwd-game-store'
import getNextPsychicsInfo from '../../get-next-psychics-info'

export default async function changePlayerTeam(
  game: FullCwdGameView,
  player: unknown
) {
  if (!isPlayer(player))
    throw new TypeError("Command 'change_player_name' requires valid 'player'.")

  if (game.phase !== 'prep')
    throw new Error('Can only change player team prep.')

  const index = game.players.findIndex((p) => p.id === player.id)
  if (index < 0)
    throw new Error('Cannot change player team when player index not found.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const newTeam = player.team === 1 ? 2 : 1
  const existingColors = game.players.map((p) => p.color)
  const color = assignColor(newTeam, existingColors)

  const changes: Record<string, string | number> & Partial<CwdGame> = {
    [`players.${index}.team`]: newTeam,
    [`players.${index}.color`]: color,
  }

  // Set new psychic for player's team if they were one
  if (player.id === game.psychic_1 || player.id === game.psychic_2) {
    const players = [...game.players]
    players[index].team = newTeam
    const psychicsInfo = getNextPsychicsInfo(game.psychic_history, players)

    if (player.id === game.psychic_1) changes.psychic_1 = psychicsInfo.psychic_1
    if (player.id === game.psychic_2) changes.psychic_2 = psychicsInfo.psychic_2
    changes.psychic_history = psychicsInfo.psychic_history
  }

  await fromCwdGames(db).updateOne(filter, {
    $set: changes,
  })
}

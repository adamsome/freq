import { assignColor } from '../../color-dict'
import { isPlayer } from '../../player'
import { CurrentFreqGameView } from '../../types/freq.types'
import { connectToDatabase } from '../../util/mongodb'
import { fromGames } from '../freq-game-store'
import isInvalidPlayerTeamChange from '../is-freq-team-change-invalid'

export default async function changePlayerTeam(
  game: CurrentFreqGameView,
  player: unknown
) {
  if (!isPlayer(player))
    throw new TypeError("Command 'change_player_name' requires valid 'player'.")

  const invalidMessage = isInvalidPlayerTeamChange(game, player)
  if (invalidMessage) throw new Error(invalidMessage)

  const index = game.players.findIndex((p) => p.id === player.id)
  if (index < 0)
    throw new Error('Cannot change player team when player index not found.')

  const { db } = await connectToDatabase()
  const filter = { room: game.room.toLowerCase() }

  const newTeam = player.team === 1 ? 2 : 1
  const existingColors = game.players.map((p) => p.color)
  const color = assignColor(newTeam, existingColors)

  await fromGames(db).updateOne(filter, {
    $set: {
      [`players.${index}.team`]: newTeam,
      [`players.${index}.color`]: color,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  })
}

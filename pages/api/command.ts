/* eslint-disable no-console */
import { NextApiResponse } from 'next'
import { GameCommander } from '../../lib/game-commander'
import { CommandType } from '../../types/game.types'
import { RequestWithSession } from '../../types/io.types'
import withSession from '../../util/with-session'

export default withSession(
  async (req: RequestWithSession, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const commander = await GameCommander.fromRequest(req)
        const body = await req.body
        await callCommand(commander, body.type, body.value)
        return res.json(true)
      } catch (error) {
        const { response } = error
        return res
          .status(response?.status || 500)
          .json(error.data ?? { message: error.message })
      }
    }
    return res.status(404).send('')
  }
)

async function callCommand(
  commander: GameCommander,
  cmd: CommandType,
  ...args: any[]
) {
  const cmdFn = commander[cmd]
  if (!cmdFn) {
    const msg = `Command '${cmd}' not yet implemented.`
    console.warn(msg)
    throw new Error(msg)
  }
  return cmdFn.call(commander, ...args)
}

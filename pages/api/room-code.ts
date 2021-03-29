import { NextApiRequest, NextApiResponse } from 'next'
import { generateRoomKey } from '../../lib/room'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const roomCode = generateRoomKey()
  res.json({ roomCode })
}

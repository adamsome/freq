import { NextApiRequest, NextApiResponse } from 'next'
import { generateRoomKey } from '../../lib/room'

export default async function getRoomCode(
  _req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const roomCode = generateRoomKey()
  res.json({ roomCode })
}

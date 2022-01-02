import generateWords from './util/generate-code'

function isTwoWordRoom(room: string) {
  return (
    room.includes('-') &&
    room.split('-').length === 2 &&
    !!room.match(/^[-a-z]+$/i)
  )
}

function isFourCharRoom(room: string) {
  return room.length === 4 && !!room.match(/^[a-z]+$/i)
}

export function isRoomValid(room?: string): room is string {
  if (room == null || typeof room !== 'string') return false
  if (room.length < 4 || room.length > 25) return false
  return isTwoWordRoom(room) || isFourCharRoom(room)
}

export function generateRoomKey() {
  return generateWords().slice(0, 2).join('-')
}

export function isRoomValid(room?: string): room is string {
  return (
    room != null &&
    typeof room === 'string' &&
    room.length < 16 &&
    !!room.match(/^[a-z0-9]+$/i)
  )
}

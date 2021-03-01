import React, { useState } from 'react'
import { cx } from '../util/dom'
import { styleLinearGradient } from '../util/dom-style'
import Button from './button'

type Props = typeof defaultProps & {
  room?: string
  error?: string | null
  fetching?: boolean
  animate?: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const defaultProps = {}

const RoomForm = ({
  error,
  onSubmit,
  room: initRoom,
  fetching,
  animate,
}: Props) => {
  const [room, setRoom] = useState<string | null>(null)

  const handleRoomChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.toLowerCase()
    const re = /^[-a-zA-Z0-9\b]+$/
    if (val === '' || re.test(val)) {
      setRoom(val)
    }
  }

  return (
    <form className="flex-center flex-col" onSubmit={onSubmit}>
      <div className="w-72 max-w-full">
        <input
          className={cx(
            'xx w-full h-12 mb-4 px-3 py-1 whitespace-nowrap',
            'bg-input-bg border border-input-border rounded-lg',
            'hover:border-blue-700 focus:border-blue-700 focus:outline-none',
            'focus:ring-4 focus:ring-blue-400 focus:ring-opacity-25',
            'dark:focus:ring-blue-500 dark:focus:ring-opacity-25',
            'text-3xl font-medium transition',
            'text-black dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-600',
            'disabled:cursor-not-allowed disabled:color-gray-500'
          )}
          type="text"
          name="room"
          placeholder="Room Code"
          value={room ?? initRoom}
          onChange={handleRoomChange}
          onFocus={(e) => e.currentTarget.select()}
          required
        />

        <Button
          className={cx('w-full h-12 font-bold text-3xl text-center', {
            'opacity-20': fetching,
            'text-black hover:text-white': animate,
            'animate-shift': animate,
          })}
          style={animate ? styleLinearGradient('Freq', '-60deg', '300%') : {}}
          blue={!animate}
          htmlType="submit"
          disabled={fetching}
        >
          Start
        </Button>
      </div>

      {error && <p className="mt-6 text-red-700 text-xl">{error}</p>}
    </form>
  )
}

RoomForm.defaultProps = defaultProps

export default RoomForm

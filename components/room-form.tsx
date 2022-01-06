import type { FormEvent } from 'react'
import { useState } from 'react'
import { GameType } from '../lib/types/game.types'
import { cx } from '../lib/util/dom'
import { styleLinearGradient } from '../lib/util/dom-style'
import Button from './control/button'
import Input from './control/input'
import SkeletonBox from './layout/skeleton-box'

type Props = typeof defaultProps & {
  type?: GameType
  generatedRoom?: string
  error?: string | null
  fetching?: boolean
  animate?: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onChangeGameClick: () => void
}

const defaultProps = {
  classNames: '',
}

export default function RoomForm({
  type,
  error,
  onSubmit,
  onChangeGameClick,
  generatedRoom,
  fetching,
  animate,
  classNames,
}: Props) {
  const [room, setRoom] = useState<string | null>(null)

  const handleRoomChange = (e: FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.toLowerCase()
    const re = /^[-a-zA-Z0-9\b]+$/
    if (val === '' || re.test(val)) {
      setRoom(val)
    }
  }

  return (
    <>
      <form
        className={cx('flex-center flex-col', classNames)}
        onSubmit={onSubmit}
      >
        <div className="w-72 max-w-full space-y-3">
          {generatedRoom == null ? (
            <SkeletonBox className="w-full h-12" />
          ) : (
            <Input
              className="w-full h-12 px-3 py-1 text-3xl font-medium"
              htmlType="text"
              name="room"
              placeholder="Room Code"
              value={room ?? generatedRoom}
              required
              onChange={handleRoomChange}
              selectOnFocus
            />
          )}

          <Button
            className={cx('w-full h-12 font-bold text-3xl text-center', {
              'opacity-20': fetching,
              'text-black hover:text-white': animate,
              'animate-shift': animate,
            })}
            style={
              animate
                ? styleLinearGradient(type ?? 'freq', '-60deg', '300%')
                : {}
            }
            color={animate ? 'none' : 'blue'}
            htmlType="submit"
            disabled={fetching || !type}
          >
            Start
          </Button>

          <Button
            className={cx('w-full font-bold text-xl text-center', {
              'opacity-20': fetching,
            })}
            color="blue"
            disabled={fetching || !type}
            onClick={onChangeGameClick}
          >
            Change Game
          </Button>
        </div>

        {error && <p className="mt-6 text-red-700 text-xl">{error}</p>}
      </form>
    </>
  )
}

RoomForm.defaultProps = defaultProps

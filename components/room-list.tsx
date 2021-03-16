import { useRouter } from 'next/router'
import React from 'react'
import { GameView } from '../types/game.types'
import { cx } from '../util/dom'
import Button from './button'
import IconSvg from './icon-svg'
import Layout from './layout'
import LayoutMain from './layout-main'
import RoomCard from './room-card'

type Props = typeof defaultProps & {
  rooms: GameView[]
  onToggleFormClick?: () => void
  onRefresh?: () => void
}

const defaultProps = {
  loading: false,
}

export default function RoomList({
  rooms,
  loading,
  onToggleFormClick,
  onRefresh,
}: Props) {
  const router = useRouter()

  const handleClick = (room: string) => {
    router.push(`/${room}`)
  }

  return (
    <Layout>
      <LayoutMain>
        <h1
          className={cx(
            'flex items-center',
            'w-full text-3xl font-semibold mt-8 mb-6 md:mb-8 pl-4 md:pl-0'
          )}
        >
          <span>Recent Games</span>
          <span className="flex-1"></span>
          <Button
            className={cx('text-base ml-4', { 'text-right': loading })}
            gray
            disabled={loading}
            bg={false}
            onClick={onRefresh}
          >
            {loading ? (
              <IconSvg name="spinner" className="w-5 h-5 text-white" />
            ) : (
              'Refresh'
            )}
          </Button>
        </h1>

        {rooms.map((game) => (
          <RoomCard
            key={game.room}
            game={game}
            className="mb-6 md:mb-8"
            onClick={handleClick}
          ></RoomCard>
        ))}

        <Button
          className="md:self-start text-2xl px-4 py-1"
          onClick={onToggleFormClick}
        >
          Join or Create New Room
        </Button>
      </LayoutMain>
    </Layout>
  )
}

RoomList.defaultProps = defaultProps

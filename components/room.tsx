import React from 'react'
import { useGameWithError } from '../hooks/use-game'
import { User } from '../types/user.types'
import Layout from './layout'
import GameBoard from './game-board'
import TitleMessage from './title-message'

type Props = typeof defaultProps & {
  user: User
}

const defaultProps = {}

export default function Room(_props: Props) {
  const [game, error] = useGameWithError()

  if (error) {
    const msg = error
      ? error?.data?.message ?? error?.message ?? String(error)
      : ''
    console.error('Game state error:', msg)
    return <TitleMessage error>🤷‍♀️ Sorry... ({msg})</TitleMessage>
  }

  if (!game) {
    return <TitleMessage subtle>Loading room...</TitleMessage>
  }

  const roomUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${game.room}`

  return (
    <Layout title={game?.room} game={game}>
      <main>
        <GameBoard roomUrl={roomUrl} />
      </main>

      <style jsx>{`
        main {
          width: 100%;
          max-width: 768px;
          padding: var(--stack-lg) var(--inset-sm);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        label {
          display: block;
          text-align: center;
          color: var(--subtle);
        }

        @media screen and (max-width: 768px) {
          main {
            padding: 0 0 var(--stack-md);
          }
        }
      `}</style>
    </Layout>
  )
}

Room.defaultProps = defaultProps

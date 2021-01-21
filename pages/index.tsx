import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Container from '../components/container'
import Title from '../components/title'
import { getCookie } from '../util/io'

type Props = typeof defaultProps & {
  cookie: string
}

const defaultProps = {}

export default function HomePage({ cookie }: Props) {
  const router = useRouter()
  const [roomID, setRoomID] = useState('')

  const handleRoomIDChange = (e: React.FormEvent<HTMLInputElement>) => {
    setRoomID(e.currentTarget.value.toUpperCase())
  }

  const handleStart = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    router.push(`/${roomID}`)
  }

  return (
    <Container cookie={cookie}>
      <main>
        <Title animate={true} />

        <p>
          Type an existing game&apos;s name to join or just click{' '}
          <Link href={`/${encodeURIComponent(roomID)}`}>
            <a>Start</a>
          </Link>{' '}
          to create a new game.
        </p>

        <form onSubmit={handleStart}>
          <input
            type="text"
            placeholder="Room Key"
            value={roomID}
            onChange={handleRoomIDChange}
          />
          <Link href={`/${encodeURIComponent(roomID)}`}>
            <a>Start</a>
          </Link>
        </form>
      </main>

      <footer>
        <p>adamsome</p>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        form {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        form input {
          height: 3rem;
          margin-right: 1rem;
          flex: 1;
          width: 100%;
          max-width: 15rem;
        }

        form input,
        form a {
          font-size: var(--font-size-xl);
        }

        form a {
          flex: 0 1 auto;
          white-space: nowrap;
        }
      `}</style>
    </Container>
  )
}

HomePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookie: getCookie(req),
    },
  }
}

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from '../components/container'
import LoginForm from '../components/login-form'
import Title from '../components/title'
import useUser from '../hooks/use-user'
import { generateRoomKey, isRoomValid } from '../lib/room'
import { head } from '../util/array'
import fetchJson from '../util/fetch-json'

type Props = typeof defaultProps & {
  cookie: string
  room: string
}

const defaultProps = {
  animate: true,
}

export const HomePage = ({ cookie, room: randomRoom, animate }: Props) => {
  const [user, mutateUser] = useUser()

  const router = useRouter()
  const { error: queryError } = router.query

  const [error, setError] = useState<string | null>(head(queryError) ?? null)
  const [fetching, setFetching] = useState(false)
  const [delayedFetching, setDelayedFetching] = useState<boolean | null>(null)

  useEffect(() => {
    let timer: number
    if (delayedFetching != null) {
      timer = window.setTimeout(() => {
        setFetching(delayedFetching)
        setDelayedFetching(null)
      }, 3000)
    }
    return () => {
      if (timer != null) clearTimeout(timer)
    }
  }, [delayedFetching])

  const room = user?.connected ? user.room : randomRoom

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fetching) return
    setFetching(true)

    const handleError = (error: any) => {
      console.error('An unexpected error happened:', error)
      setError(error.data?.message ?? error.message ?? 'Unexpected Error')
      setFetching(false)
    }

    const room = e.currentTarget?.room?.value?.toLowerCase()

    if (!room) {
      return handleError(new Error('No room found on login.'))
    }

    if (!isRoomValid(room)) {
      return setError('Room code must be two words separated by a dash.')
    }

    try {
      const user = await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room }),
        })
      )
      if (user?.connected) {
        router.push(`/${user.room}`)
      } else {
        handleError(new Error('User could not login.'))
      }
      setDelayedFetching(false)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Container cookie={cookie}>
      <main>
        <Title animate={animate} />

        <p>
          Type an existing game&apos;s name to join or just click Start to
          create a new game.
        </p>

        <LoginForm
          room={room}
          error={error}
          fetching={fetching}
          animate={animate}
          onSubmit={handleStart}
        ></LoginForm>
      </main>

      <footer>
        <p>adamsome</p>
      </footer>

      <style jsx>{`
        main {
          padding: var(--stack-md) 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        p {
          margin-bottom: 1.7rem;
          text-align: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Container>
  )
}

HomePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookie: req.headers.cookie ?? '',
      room: generateRoomKey(),
    },
  }
}

export default HomePage

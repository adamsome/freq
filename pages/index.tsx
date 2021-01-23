import { GetServerSideProps } from 'next'
import React, { useState } from 'react'
import Container from '../components/container'
import LoginForm from '../components/login-form'
import Title from '../components/title'
import useUser from '../hooks/use-user'
import fetchJson from '../util/fetch-json'

type Props = typeof defaultProps & {
  cookie: string
}

const defaultProps = {}

export const HomePage = ({ cookie }: Props) => {
  const [, mutateUser] = useUser({
    redirectIfFound: true,
    redirectTo: (user) => user.room ?? '/',
  })

  const [error, setError] = useState<string | null>(null)

  const handleStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const body = {
      room: e.currentTarget.room.value,
    }

    try {
      await mutateUser(
        fetchJson('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      )
    } catch (error) {
      console.error('An unexpected error happened:', error)
      setError(error.data.message)
    }
  }

  return (
    <Container cookie={cookie}>
      <main>
        <Title animate={true} />

        <p>
          Type an existing game&apos;s name to join or just click Start to
          create a new game.
        </p>

        <LoginForm onSubmit={handleStart} error={error}></LoginForm>
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
      `}</style>
    </Container>
  )
}

HomePage.defaultProps = defaultProps

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookie: req.headers.cookie ?? '',
    },
  }
}

export default HomePage

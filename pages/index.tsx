import { GetServerSideProps } from 'next'
import React from 'react'
import Container from '../components/container'
import LoginFormContainer from '../components/login-form-container'
import Title from '../components/title'
import { generateRoomKey } from '../lib/room'

type Props = typeof defaultProps & {
  cookie: string
  room: string
}

const defaultProps = {}

export const HomePage = ({ cookie, room }: Props) => {
  return (
    <Container cookie={cookie}>
      <main>
        <Title animate={true} />

        <p>
          Type an existing game&apos;s name to join or just click Start to
          create a new game.
        </p>

        <LoginFormContainer room={room}></LoginFormContainer>
      </main>

      <footer>
        <a
          href="https://github.com/adamsome/freq"
          target="_blank"
          rel="noreferrer"
        >
          adamsome
        </a>
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

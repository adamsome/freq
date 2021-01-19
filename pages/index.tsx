import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [gameID, setName] = useState('')

  const handleStart = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    router.push(`/${gameID}`)
  }

  return (
    <div className="container">
      <Head>
        <title>Freq</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Freq</h1>

        <p>
          Type an existing game's name to join or just click{' '}
          <Link href={`/${encodeURIComponent(gameID)}`}>
            <a>Start</a>
          </Link>{' '}
          to create a new game.
        </p>

        <form onSubmit={(e) => handleStart(e)}>
          <input
            type="text"
            placeholder="Room Key"
            value={gameID}
            onChange={(e) => setName(e.target.value)}
          />
          <Link href={`/${encodeURIComponent(gameID)}`}>
            <a>Start</a>
          </Link>
        </form>
      </main>

      <footer>adamsome</footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #151515;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }

        form {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        form input {
          height: 3rem;
          margin-right: 1rem;
          width: 15rem;
        }

        form input,
        form a {
          font-size: 1.5rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

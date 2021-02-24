import React from 'react'
import { cx } from '../util/dom'
import Layout from './layout'
import Title from './title'

type Props = typeof defaultProps & {
  children: React.ReactNode
  message?: string
  invisible?: boolean
  subtle?: boolean
  error?: boolean
}

const defaultProps = {}

export default function TitleMessage({
  children,
  message,
  invisible,
  subtle,
  error,
}: Props) {
  return (
    <Layout>
      <main>
        <Title animate={true} />

        <div
          className={cx({ invisible: invisible, subtle: subtle, error: error })}
        >
          <p>{message ? message : children}</p>

          {message && children}
        </div>
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

        div {
          flex: 0 0 16rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          min-height: 16rem;
          text-align: center;
          color: var(--body);
        }

        div > * {
          flex: 0;
        }

        div.invisible {
          visibility: hidden;
        }

        div.subtle {
          color: var(--subtle);
        }

        div.error {
          color: brown;
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
    </Layout>
  )
}

TitleMessage.defaultProps = defaultProps

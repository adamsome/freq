import React, { useState } from 'react'
import { cx } from '../util/dom'
import { styleLinearGradient } from '../util/dom-style'

type Props = typeof defaultProps & {
  room?: string
  name?: string
  error?: string | null
  fetching?: boolean
  animate?: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const defaultProps = {}

const LoginForm = ({
  error,
  onSubmit,
  room: initRoom,
  name: initName,
  fetching,
  animate,
}: Props) => {
  const [room, setRoom] = useState(initRoom ?? '')
  const [name, setName] = useState(initName ?? '')

  const handleRoomChange = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value.toLowerCase()
    const re = /^[-a-zA-Z0-9\b]+$/
    if (val === '' || re.test(val)) {
      setRoom(val)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="wrapper">
        <div className="field">
          <input
            type="text"
            name="room"
            placeholder="Room Code"
            value={room}
            onChange={handleRoomChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.currentTarget.value.substr(0, 15))}
          />
        </div>

        <button
          className={cx({ fetching, animate, 'animate-shift': animate })}
          style={animate ? styleLinearGradient('Freq', '-60deg', '300%') : {}}
          type="submit"
          disabled={fetching}
        >
          <span>Start</span>

          {error && <p className="error">{error}</p>}
        </button>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .field {
          flex: 1;
          width: 100%;
          max-width: 18rem;
        }

        input {
          height: 3rem;
          width: 100%;
          font-weight: 500;
          border-radius: var(--border-radius-lg);
          margin-bottom: var(--stack-md);
        }

        input,
        button {
          font-size: var(--font-size-xl);
          white-space: nowrap;
        }

        button {
          flex: 0 1 auto;
          height: 3rem;
          width: 100%;
          font-weight: 700;
          margin-top: 2px;
          color: var(--primary);
          border: 0;
          outline: 0;
          white-space: nowrap;
          cursor: pointer;
          transition: 180ms color ease-in-out;
        }

        button.animate {
          color: var(--body-dark);
        }

        button.animate:hover {
          color: var(--body-light);
        }

        button:hover {
          color: var(--primary-lit);
        }

        button:focus {
          border-radius: var(--border-radius-md);
        }

        button.fetching,
        button:disabled {
          opacity: 0.2;
        }

        .error {
          color: brown;
          margin: var(--stack-sm) 0 0;
        }
      `}</style>
    </form>
  )
}

LoginForm.defaultProps = defaultProps

export default LoginForm

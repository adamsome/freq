import React, { useState } from 'react'

type Props = typeof defaultProps & {
  room?: string
  error?: string | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const defaultProps = {}

const LoginForm = ({ error, onSubmit, room: initRoom }: Props) => {
  const [room, setRoom] = useState(initRoom ?? '')

  const handleRoomChange = (e: React.FormEvent<HTMLInputElement>) => {
    setRoom(e.currentTarget.value.toUpperCase().substr(0, 4))
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="wrapper">
        <input
          type="text"
          name="room"
          placeholder="Room Code"
          value={room}
          onChange={handleRoomChange}
          required
        />

        <button type="submit">Start</button>
      </div>

      {error && <p className="error">{error}</p>}

      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input {
          height: 3rem;
          margin-right: 1rem;
          flex: 1;
          width: 100%;
          max-width: 15rem;
        }

        input,
        button {
          font-size: var(--font-size-xl);
        }

        button {
          flex: 0 1 auto;
          background: transparent;
          color: var(--primary);
          border: 0;
          outline: 0;
          white-space: nowrap;
          cursor: pointer;
          transition: 180ms color ease-in-out;
        }

        button:hover {
          color: var(--primary-lit);
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

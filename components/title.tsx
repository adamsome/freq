import React from 'react'
import { cx } from '../util/dom'

type Props = typeof defaultProps & {
  animate?: boolean
}

const defaultProps = {
  title: 'Freq' as string,
}

const Title = ({ title, animate }: Props) => {
  return (
    <>
      <h1 className={cx({ animate })}>{title}</h1>

      <style jsx>{`
        @keyframes shift {
          0% {
            background-position: 0 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0 50%;
          }
        }

        @keyframes shake {
          0% {
            transform: skewX(-30deg);
          }
          5% {
            transform: skewX(30deg);
          }
          10% {
            transform: skewX(-30deg);
          }
          15% {
            transform: skewX(30deg);
          }
          20% {
            transform: skewX(0deg);
          }
          100% {
            transform: skewX(0deg);
          }
        }

        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: var(--font-size-2x);
          text-align: center;
        }

        .animate {
          background: linear-gradient(-60deg, #c02425, #f0cb35, #38ef7d);
          background-size: 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shift 30s ease-in-out infinite;
        }

        .animate:hover {
          animation: shift 30s ease-in-out infinite, 0.8s shake;
        }
      `}</style>
    </>
  )
}

Title.defaultProps = defaultProps

export default Title

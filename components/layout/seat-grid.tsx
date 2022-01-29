import { Children, ReactNode } from 'react'
import { cx } from '../../lib/util/dom'
import Arrow from '../control/arrow'

interface Arrow {
  content: JSX.Element | string
  classes: string
}

type Props = typeof defaultProps & {
  children: ReactNode | ReactNode[]
}

const defaultProps = {
  classNames: '',
}

export default function SeatGrid({ children, classNames }: Props) {
  const count = Children.count(children)

  const classesPerItemByCount: Record<number, string[]> = {
    3: [
      'col-start-3 row-start-3 self-start',
      'col-start-1 row-start-1 self-end',
      'col-start-5 row-start-1 self-end',
    ],
    4: [
      'col-start-3 row-start-3 self-end',
      'col-start-1 row-start-1 row-span-3',
      'col-start-3 row-start-1 self-start',
      'col-start-5 row-start-1 row-span-3',
    ],
    5: [
      'col-start-3 row-start-3 self-end',
      'col-start-1 row-start-3 self-start',
      'col-start-1 row-start-1 self-end',
      'col-start-5 row-start-1 self-end',
      'col-start-5 row-start-3 self-start',
    ],
    6: [
      'col-start-3 row-start-3 self-end',
      'col-start-1 row-start-3 self-start',
      'col-start-1 row-start-1 self-end',
      'col-start-3 row-start-1 self-start',
      'col-start-5 row-start-1 self-end',
      'col-start-5 row-start-3 self-start',
    ],
  }

  const arrowsPerItemByCount: Record<number, (Arrow | null)[]> = {
    3: [
      {
        content: <Arrow left up />,
        classes: 'col-start-2 row-start-2',
      },
      {
        content: <Arrow right classNames="" />,
        classes: 'col-start-2 col-span-3 row-start-1 items-start mt-10',
      },
      {
        content: <Arrow left down />,
        classes: 'col-start-4 row-start-2',
      },
    ],
    4: [
      {
        content: <Arrow left up />,
        classes: 'col-start-2 row-start-3 items-start mt-6',
      },
      {
        content: <Arrow right up />,
        classes: 'col-start-2 row-start-1 items-end mb-6',
      },
      {
        content: <Arrow right down />,
        classes: 'col-start-4 row-start-1 items-end mb-6',
      },
      {
        content: <Arrow left down />,
        classes: 'col-start-4 row-start-3 items-start mt-6',
      },
    ],
    5: [
      { content: <Arrow left />, classes: 'col-start-2 row-start-3' },
      { content: <Arrow up />, classes: 'col-start-1 row-start-2' },
      {
        content: <Arrow right />,
        classes: 'col-start-2 col-span-3 row-start-1 items-start mt-10',
      },
      { content: <Arrow down />, classes: 'col-start-5 row-start-2' },
      { content: <Arrow left />, classes: 'col-start-4 row-start-3' },
    ],
    6: [
      { content: <Arrow left />, classes: 'col-start-2 row-start-3' },
      { content: <Arrow up />, classes: 'col-start-1 row-start-2' },
      { content: <Arrow right />, classes: 'col-start-2 row-start-1' },
      { content: <Arrow right />, classes: 'col-start-4 row-start-1' },
      { content: <Arrow down />, classes: 'col-start-5 row-start-2' },
      { content: <Arrow left />, classes: 'col-start-4 row-start-3' },
    ],
  }

  return (
    <div
      className={cx(
        'grid',
        'grid-cols-[repeat(2,minmax(0,1fr)_1.5rem)_minmax(0,1fr)]',
        'grid-rows-[minmax(4.5rem,1fr)_1rem_minmax(4.5rem,1fr)]',
        'items-center',
        classNames
      )}
    >
      {Children.map(children, (child, i) => {
        const classesPerItem = classesPerItemByCount[count] ?? []
        const classes = classesPerItem[i % classesPerItem.length]
        const arrowsPerItem = arrowsPerItemByCount[count] ?? []
        const arrow = arrowsPerItem[i % arrowsPerItem.length]
        return (
          <>
            <div key={i} className={classes}>
              {child}
            </div>
            {arrow && (
              <div
                key={i + 'arrow'}
                className={cx(
                  'text-center w-full h-full flex p-1',
                  arrow.classes,
                  !arrow.classes.includes('items-') && 'items-center'
                )}
              >
                {arrow.content}
              </div>
            )}
          </>
        )
      })}
    </div>
  )
}

SeatGrid.defaultProps = defaultProps

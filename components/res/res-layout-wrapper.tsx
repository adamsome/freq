import Image from 'next/image'
import React from 'react'
import { cx } from '../../lib/util/dom'

type Props = { children: React.ReactNode }

export default function ResLayoutWrapper({ children }: Props) {
  return (
    <div
      className={cx(
        'relative max-h-screen overflow-hidden',
        'bg-phosphorus-950 text-white'
      )}
    >
      <div
        className={cx(
          'relative flex h-full flex-shrink flex-grow overflow-hidden',
          '-top-[5rem] bg-[#9b5ced] sm:bg-black',
          'before:absolute before:inset-0 before:z-10 before:h-full before:w-full',
          "before:bg-phosphorus-950 before:mix-blend-lighten before:content-['']"
        )}
      >
        <Image
          src="/res/bg.png"
          alt="bg"
          width={702}
          height={1520}
          className={cx(
            'relative h-full w-full max-w-full flex-shrink-0 flex-grow',
            'mix-blend-multiply blur-0 contrast-100 grayscale filter'
          )}
        />
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 z-10 overflow-auto">
        {children}
      </div>
    </div>
  )
}

import React from 'react'
import { ResPlayerProps } from '../../lib/types/res.types'
import IconSvg from '../control/icon-svg'
import Tag from '../control/tag'

type Props = ResPlayerProps

export default function ResCardTitle(props: Props) {
  const { name, you, lead, spy } = props
  return (
    <div className="relative flex w-full items-center">
      {lead && (
        <IconSvg
          name="chevron"
          className="mr-1 w-[13px] min-w-[13px] text-phosphorus-500"
          top="-2px"
        />
      )}
      <div className="font-spaced-medium mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
        {name}
      </div>
      {you && <Tag className="relative -top-0.5 ml-1 bg-purple-400">YOU</Tag>}
      {spy && <Tag className="relative -top-0.5 ml-1 bg-rose-500">ENEMY</Tag>}
    </div>
  )
}

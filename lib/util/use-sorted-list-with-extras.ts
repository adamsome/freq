import { useCallback, useEffect, useState } from 'react'
import { WithIndex } from '../types/object.types'
import { withIndexComparer } from './array'
import { withIndex } from './object'

type UseSortedListWithExtrasResult<T> = [
  sortedList: WithIndex<T>[],
  addExtra: (extraItem: T) => void,
  resetExtras: () => void
]

export function useSortedListWithExtras<T extends object>(
  list: T[] = []
): UseSortedListWithExtrasResult<T> {
  const [sortedList, setSortedList] = useState<WithIndex<T>[]>([])
  const [extras, setExtras] = useState<WithIndex<T>[]>([])

  useEffect(() => {
    setSortedList(list.map(withIndex).concat(extras).sort(withIndexComparer))
  }, [setSortedList, list, extras])

  function addExtra(extraItem: T): void {
    const length = list.length ?? 0
    const prevListIndex = length > 0 ? length - 1 : 0
    const prevExtrasIndex = extras.length ? extras[extras.length - 1].index : 0
    const index = Math.max(prevListIndex, prevExtrasIndex) + 0.1
    setExtras([...extras, { ...extraItem, index }])
  }

  const resetExtras = useCallback((): void => setExtras([]), [setExtras])

  return [sortedList, addExtra, resetExtras]
}

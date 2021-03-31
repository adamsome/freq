import { useEffect, useState } from 'react'
import { resolveValueFn, ValueFn } from '../util/value-fn'
import { useDebounceCallback } from './use-debounce'
import usePrevious from './use-previous'

export interface UseConditionalDebounceOptions<T> {
  /** Equality function that when true, prevents the value change */
  equalsFn?: (a?: T, b?: T) => boolean
  /** Time in milliseconds to conditionally debounce the value change. */
  debounceTime?: ValueFn<number>
}

const defaultEqualsFn = <T>(a?: T, b?: T) => a === b

/**
 * Tracks a value and its previous value, when they differ output the new
 * value. However, the new value will be debounced, delaying its change,
 * if a condition function comparing the previous and next value returns
 * true.
 *
 * @param value Value to conditionally debounce its change.
 * @param conditionFn Determines whether to debounce the change or not.
 * @param options Option to change the equals function and debounce time.
 * @returns Conditionally debounced changed value.
 */
export default function useConditionalDebounce<T>(
  value: T,
  /** Compares new value; if true, debounces the value change */
  conditionFn: (prev?: T, next?: T) => boolean | undefined,
  options: UseConditionalDebounceOptions<T> = {}
) {
  const { equalsFn = defaultEqualsFn, debounceTime = 2000 } = options

  const [nextValue, setNextValue] = useState<T | undefined>()
  const prevValue = usePrevious(nextValue)

  const [debouncedValue, rawSetDebouncedValue] = useState<T | undefined>()

  const setDebouncedValue = useDebounceCallback(
    rawSetDebouncedValue,
    resolveValueFn(debounceTime)
  )

  // Update internal/next value when the input changes
  useEffect(() => {
    setNextValue(value)
  }, [value])

  // Update the output value when the next value is changed from the previous
  // and debounce the change if the condition is met
  useEffect(() => {
    if (equalsFn(prevValue, nextValue)) return

    if (conditionFn(prevValue, nextValue)) {
      setDebouncedValue(nextValue)
    } else {
      rawSetDebouncedValue(nextValue)
    }
  }, [prevValue, nextValue])

  return debouncedValue
}

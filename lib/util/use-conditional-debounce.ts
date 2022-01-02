import { useEffect, useState } from 'react'
import { useDebounceCallback } from './use-debounce'
import usePrevious from './use-previous'
import { resolveValueFn, ValueFn } from './value-fn'

export interface UseConditionalDebounceOptions<T> {
  /**
   * Compares new value to previous; if true, debounces the value change.
   * If omitted, value change is always debounced.
   */
  conditionFn?: (prev?: T, next?: T) => boolean | undefined
  /**
   * Equality function that, when true, prevents the value change.
   * If omitted, reference equality is used.
   */
  equalsFn?: (a?: T, b?: T) => boolean
  /** Time in milliseconds to conditionally debounce the value change. */
  debounceTime?: ValueFn<number>
}

const defaultConditionFn = <T>(_prev?: T, _next?: T) => true
const defaultEqualsFn = <T>(prev?: T, next?: T) => prev === next

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
  options: UseConditionalDebounceOptions<T> = {}
): T | undefined {
  const {
    conditionFn = defaultConditionFn,
    equalsFn = defaultEqualsFn,
    debounceTime = 2000,
  } = options

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
  }, [prevValue, nextValue, conditionFn, equalsFn, setDebouncedValue])

  return debouncedValue
}

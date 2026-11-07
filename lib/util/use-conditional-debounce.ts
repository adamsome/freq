import { useEffect, useState } from 'react'
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

  const [prevValue, setPrevValue] = useState<T | undefined>()
  const [debouncedValue, setDebouncedValue] = useState<T | undefined>()
  /** A change waiting out the debounce time (boxed so undefined can pend). */
  const [pending, setPending] = useState<{ value: T } | null>(null)

  // When the input changes, output it now or (if the condition is met) after
  // the debounce time. Adjusted during render rather than in an effect.
  if (!equalsFn(prevValue, value)) {
    setPrevValue(value)
    if (conditionFn(prevValue, value)) {
      setPending({ value })
    } else {
      setPending(null)
      setDebouncedValue(value)
    }
  }

  // A newer change (or unmount) cancels the pending one.
  const delay = resolveValueFn(debounceTime)
  useEffect(() => {
    if (!pending) return
    const timeout = setTimeout(() => setDebouncedValue(pending.value), delay)
    return () => clearTimeout(timeout)
  }, [pending, delay])

  return debouncedValue
}

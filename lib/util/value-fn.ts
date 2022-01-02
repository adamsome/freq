import { type } from './assertion'

export type ValueAccessor<T, TDatum, TOut = T | undefined> =
  | T
  | ((d: TDatum, i?: number) => TOut)

export function resolveValueAccessor<TDatum>(
  numberValueOrFunction: ValueAccessor<number, TDatum>,
  d: TDatum,
  i?: number
): number
export function resolveValueAccessor<TDatum>(
  stringValueOrFunction: ValueAccessor<string, TDatum>,
  d: TDatum,
  i?: number
): string
export function resolveValueAccessor<TDatum>(
  fn: ValueAccessor<string | number, TDatum>,
  d: TDatum,
  i?: number
): string | number
export function resolveValueAccessor<T, TDatum>(
  fn: ValueAccessor<T, TDatum>,
  d: TDatum,
  i?: number
): T
export function resolveValueAccessor<T, TDatum>(
  fn: ValueAccessor<T | string | number, TDatum>,
  d: TDatum,
  i?: number
): T | string | number | undefined {
  return type(fn) === 'Function' ? (fn as any)(d, i) : fn
}

export type ValueFn<T> = T | (() => T)

export function resolveValueFn(fn: ValueFn<number>): number
export function resolveValueFn(fn: ValueFn<string>): string
export function resolveValueFn(fn: ValueFn<string | number>): string | number
export function resolveValueFn<T>(fn: ValueFn<T>): T
export function resolveValueFn<T>(fn: ValueFn<T>): T | string | number {
  return type(fn) === 'Function' ? (fn as any)() : fn
}

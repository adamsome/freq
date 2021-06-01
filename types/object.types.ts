export type Merge<T, P> = P & Omit<T, keyof P>

export type Dict<T = any> = Record<string, T>

export type BooleanLike = boolean | 'true' | 'false'

export type StringOrNumber = string | number

export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

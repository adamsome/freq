export type Merge<T, P> = P & Omit<T, keyof P>

export type Dict<T = unknown> = Record<string, T>

export type Diff<T extends string, U extends string> = ({ [P in T]: P } & {
  [P in U]: never
} & { [x: string]: never })[T]

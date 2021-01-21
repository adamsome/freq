export type HasResponseSetHeader = {
  setHeader(name: string, value: number | string | ReadonlyArray<string>): void
}

export interface HasObjectID {
  _id: any
}

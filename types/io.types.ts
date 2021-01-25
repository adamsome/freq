import { ObjectId } from 'mongodb'
import { GetServerSidePropsContext, NextApiRequest } from 'next'
import { Session } from 'next-iron-session'

export type HasResponseSetHeader = {
  setHeader(name: string, value: number | string | ReadonlyArray<string>): void
}

export interface HasObjectID {
  _id: ObjectId
}

export type RequestWithSession = NextApiRequest & { session: Session }

export type SessionContext = GetServerSidePropsContext & {
  req: RequestWithSession
}

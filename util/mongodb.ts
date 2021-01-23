import { Db, MongoClient } from 'mongodb'
import { HasObjectID } from '../types/io.types'
import { omit } from './object'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

interface MongoClientDb {
  client: MongoClient
  db: Db
}

interface MongoCache {
  conn: MongoClientDb | null
  promise: Promise<MongoClientDb> | null
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: MongoCache = (global as any)?.mongo

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null }
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cached.promise = MongoClient.connect(MONGODB_URI!, opts).then(
      (client): MongoClientDb => {
        return {
          client,
          db: client.db(MONGODB_DB),
        }
      }
    )
  }
  cached.conn = await cached.promise
  return cached.conn
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function omitID<T extends object>(obj?: T & Partial<HasObjectID>): T
// eslint-disable-next-line @typescript-eslint/ban-types
export function omitID<T extends object>(
  obj?: (T & Partial<HasObjectID>) | null
): T | null
// eslint-disable-next-line @typescript-eslint/ban-types
export function omitID<T extends object>(
  obj?: (T & Partial<HasObjectID>) | null
): T | null {
  return obj ? (omit(obj, '_id') as T) : null
}

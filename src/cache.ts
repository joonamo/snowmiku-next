import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { logInfo } from './logger'

const Bucket = String(process.env.S3_BUCKET)
const client = new S3Client({
  credentials: {
    accessKeyId: String(process.env.S3_KEY),
    secretAccessKey: String(process.env.S3_SECRET),
  },
  endpoint: String(process.env.S3_URL),
  region: 'auto',
})

export interface CachedObject<T> {
  validUntil: number
  data: T
}
export interface cachedResponse<T> {
  data?: T
  validUntil?: number
  stale?: boolean
}

export const getCached = async <T>(key: string, allowStale = false): Promise<cachedResponse<T>> => {
  const cacheResult = await client
    .send(
      new GetObjectCommand({
        Bucket,
        Key: key,
      }),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      if (e.Code === 'NoSuchKey') {
        logInfo('Cache miss', { key })
        return undefined
      } else {
        throw e
      }
    })

  const cachedString = await cacheResult?.Body?.transformToString()

  if (!cachedString) {
    return {}
  }

  const cachedObject: CachedObject<T> = JSON.parse(cachedString)
  const stale = new Date().getTime() > cachedObject.validUntil
  if (!stale || allowStale) {
    logInfo('Cache hit', { key, stale })
    return {
      ...cachedObject,
      stale,
    }
  }

  logInfo('Cache stale', { key })
  return {}
}

export const storeCache = async (key: string, data: unknown, lifetimeMillis: number) => {
  const Expires = new Date(new Date().getTime() + lifetimeMillis)

  await client.send(
    new PutObjectCommand({
      Bucket,
      Key: key,
      Body: JSON.stringify({ data, validUntil: Expires.getTime() }),
      Expires,
    }),
  )
}

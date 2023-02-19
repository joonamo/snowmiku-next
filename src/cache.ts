import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'

const Bucket = String(process.env.S3_BUCKET)
const client = new S3Client({
  credentials: {
    accessKeyId: String(process.env.S3_KEY),
    secretAccessKey: String(process.env.S3_SECRET)
  },
  endpoint: String(process.env.S3_URL),
  region: 'auto'
})

export interface CachedObject<T> {
  validUntil: number
  data: T
}

export const getCached = async <T>(key: string): Promise<T | undefined> => {
  const cacheResult = await client.send(new GetObjectCommand({
    Bucket,
    Key: key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })).catch((e: any) => {
    if (e.Code === 'NoSuchKey') {
      return undefined
    } else {
      throw e
    }
  })

  const cachedString = await cacheResult?.Body?.transformToString()

  if (!cachedString) {
    return undefined
  }

  const cachedObject: CachedObject<T> = JSON.parse(cachedString)
  if (new Date().getTime() < cachedObject.validUntil) {
    console.log(`cache hit "${key}"`)
    return cachedObject.data
  }

  return undefined
}

export const storeCache = async (key: string, data: unknown, lifetimeMillis: number) => {
  const Expires = new Date(new Date().getTime() + lifetimeMillis)
  
  await client.send(new PutObjectCommand({
    Bucket,
    Key: key,
    Body: JSON.stringify({ data, validUntil: Expires.getTime() }),
    Expires
  }))
}

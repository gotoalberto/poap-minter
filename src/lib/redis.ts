import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface MintRecord {
  twitterId: string
  twitterName: string
  recipientType: "email" | "address" | "ens"
  recipient: string
  eventId: string
  tokenId?: string
  mintedAt: string
}

export async function saveMintRecord(record: MintRecord) {
  const key = `mint:${record.twitterId}:${record.eventId}`
  await redis.set(key, JSON.stringify(record))
  await redis.sadd(`mints:${record.eventId}`, key)
  return key
}

export async function getMintsByEvent(eventId: string): Promise<MintRecord[]> {
  const keys = await redis.smembers(`mints:${eventId}`)
  if (!keys || keys.length === 0) return []
  
  const mints = await Promise.all(
    keys.map(async (key) => {
      const data = await redis.get(key)
      return data ? JSON.parse(data as string) : null
    })
  )
  
  return mints.filter(Boolean) as MintRecord[]
}

export async function hasMinted(twitterId: string, eventId: string): Promise<boolean> {
  const key = `mint:${twitterId}:${eventId}`
  const exists = await redis.exists(key)
  return exists === 1
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getLatestYear } from '@/src/miku-scrape'

export default async function handler() {
  return new Response(JSON.stringify({
    firstYear: 2012,
    lastYear: await getLatestYear()
  }))
}

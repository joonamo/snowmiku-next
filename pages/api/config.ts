// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { latestTag, processPage } from '@/src/miku-scrape'
import type { NextApiRequest } from 'next'

export default function handler(
  req: NextApiRequest,
) {
  return new Response(JSON.stringify(processPage('2023', latestTag)))
}

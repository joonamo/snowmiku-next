// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { latestTag, processPage } from '@/src/miku-scrape'
import type { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
) {
  const year = String(req.query?.['year']) ?? '2020'
  const page = Number(req.query?.['page']) ?? 1
  return new Response(JSON.stringify(await processPage(year, latestTag, page)))
}

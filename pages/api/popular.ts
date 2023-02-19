// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { popularTag, processPage } from '@/src/miku-scrape'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const year = String(req.query?.['year'] ?? '2020')
  const page = Number(req.query?.['page'] ?? 1)
  res.json(await processPage(year, popularTag, page))
}

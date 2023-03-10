// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { runCors } from '@/src/cors'
import { popularTag, processPage } from '@/src/miku-scrape'
import { prefetchPage } from '@/src/prefetch'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCors(req, res)

  const year = String(req.query?.['year'] ?? '2020')
  const page = Number(req.query?.['page'] ?? 1)
  const doPrefetch = !req.query?.noprefetch

  const result = await processPage(year, popularTag, page)
  if (result.results.length > 0 && doPrefetch) {
    prefetchPage(year, 'popular', page + 1)
  }

  res.setHeader('Cache-Control', `public, s-maxage=${5 * 60}, stale-while-revalidate=${10 * 60}`)
  res.json(await processPage(year, popularTag, page))
}

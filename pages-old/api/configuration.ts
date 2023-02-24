// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { runCors } from '@/src/cors'
import { getLatestYear } from '@/src/miku-scrape'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runCors(req, res)

  res.setHeader('Cache-Control', `public, s-maxage=${30 * 60}, stale-while-revalidate=${30 * 24 * 60 * 60}`)
  res.json({
    firstYear: 2012,
    latestYear: await getLatestYear()
  })
}

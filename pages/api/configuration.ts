// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getLatestYear } from '@/src/miku-scrape'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
) {
  res.json({
    firstYear: 2012,
    lastYear: await getLatestYear()
  })
}

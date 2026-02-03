import JSSoup, { SoupTag } from 'jssoup'
import { getCached, storeCache } from './cache'
import { logInfo } from './logger'
import { metadatabase } from './metadatabase'
import { randomUUID } from 'node:crypto'

export interface MikuResult {
  name: string
  author: string
  link: string
  image: string
  views: number
  postTime: string
  authorIcon?: string
  isFinalist?: boolean
  isWinner?: boolean
}

export interface ResultsPage {
  results: MikuResult[]
  piaproUrl: string
  pageCount: number
}

export const latestTag = 'sd'
export const popularTag = 'cv'

export const getYearTag = (year: string) => {
  const tens = year[year.length - 2]
  const ones = year[year.length - 1]
  return `%EF%BC%92%EF%BC%90%EF%BC%9${tens}%EF%BC%9${ones}`
}

const getId = (href?: string) => {
  if (!href) {
    return randomUUID()
  }

  const split = href.split('/')
  return split[split.length - 1]
}

// Deprecated
// const imageRegex = /url\(\/\/(.*)0250_0250(\..*)\)/
// const imageLink = (styleAttr: string) => {
//   const re = imageRegex.exec(styleAttr)
//   return `https://${re?.[1]}0740_0500${re?.[2]}`
// }

// const viewsRegex = /閲覧数:([\d,]+)/
// const getViews = (html: string) => {
//   const re = viewsRegex.exec(html)
//   return (re && parseInt(re[1].replace(',', ''), 10)) ?? 0
// }

// const postTimeRegex = /(\d\d\d\d\/\d\d\/\d\d \d\d:\d\d)/ // Beautiful
// const getPostTime = (html: string) => {
//   const re = postTimeRegex.exec(html)
//   return re?.[1] ?? ''
// }

export const paginatorRegex = /new Paginator\('_paginator', ([0-9]*)/
const pageCount = (page?: SoupTag) => {
  const pager = page?.find(undefined, 'pager_list')
  const last = pager.contents[pager.contents.length - 1]
  const firstTry = parseInt(last.text, 10)
  
  if (Number.isInteger(firstTry))
    return firstTry
  
  const secondToLast = pager.contents[pager.contents.length - 2]
  const secondTry = parseInt(secondToLast.text, 10)
  if (Number.isInteger(secondTry))
    return secondTry

  return null
}

export const processPage = async (
  year: string,
  orderTag: string,
  page = 1,
): Promise<ResultsPage> => {
  const cacheKey = `page-result-v10/${year}/${orderTag}/${page}`
  const cached = await getCached<ResultsPage>(cacheKey)
  if (cached.data) {
    return cached.data
  }

  const yearTag = getYearTag(year)
  const piaproUrl = `https://piapro.jp/content_tag/image/${yearTag}%E5%B9%B4%E9%9B%AA%E3%83%9F%E3%82%AF%E8%A1%A3%E8%A3%85/${page}?order=${orderTag}`

  logInfo(`Calling Piapro`, { piaproUrl })
  const mikuReq = await fetch(piaproUrl)
  console.log(`got response`, { status: mikuReq.status, ok: mikuReq.ok })
  const mikuHtml = await mikuReq.text()

  const processed = processHtml(mikuHtml, year, page)
  const result = { ...processed, piaproUrl }

  await storeCache(cacheKey, result, 5 * 60 * 1000)

  return result
}

export const processHtml = (mikuHtml: string, year: string, page: number) => {
  try {
    const soup = new JSSoup(mikuHtml)
    const images = soup.find(undefined, 'tmblist_list').contents
    const yearFinalists = metadatabase[year]

    const results = images.map((item: SoupTag): MikuResult => {
      const linkElem: SoupTag = item.find('a')
      const id = getId(linkElem.attrs['href'] as string)

      return {
        name: item.find(undefined, 'tmblist_list_title').text,
        author: item.find(undefined, 'tmblist_list_creator_txt').text,
        authorIcon:
          item.find(undefined, 'tmblist_list_creator_userimg')?.find('img').attrs['src'].replace('_0048.', '_0150.') ??
          null,
        image: item.find(undefined, 'tmblist_list_tmb_inner')?.find('img').attrs['src'].replace('0250_0250.', '0860_0600.'),
        link: `https://piapro.jp/t/${id}`,
        isFinalist: Boolean(yearFinalists?.finalists?.includes(id)),
        isWinner: yearFinalists?.winner === id,

        // Views and post time not available in current Piapro listing
        views: 0,
        postTime: '',
      }
    })

    const result = {
      pageCount: pageCount(soup) ?? page,
      results,
    }

    return result
  }
  catch (e: any)
  {
    logInfo("Failed to process year ${year} page ${page}", e)
    return {
      pageCount: 0,
      results: []
    }
  }
}

export const getLatestYear = async (): Promise<number> => {
  const cacheKey = 'latestYear'
  const cached = await getCached<{ latestYear: number }>(cacheKey, true)
  if (cached.data?.latestYear && !cached.stale) {
    return cached.data.latestYear
  }

  const maxYear = new Date().getFullYear() + 1
  let latestYear = cached.data?.latestYear
  if (maxYear === latestYear) {
    console.log('Stale cache, but valid year, accepting for 24h')
    await storeCache(cacheKey, { latestYear }, 24 * 60 * 60 * 1000)
  } else {
    const promises = []
    for (let year = maxYear; year >= 2024; year--) {
      promises.push(processPage(year.toString(), latestTag))
    }

    const results = await Promise.all(promises)
    latestYear = maxYear - results.findIndex((result) => result.results.length != 0)
    await storeCache(cacheKey, { latestYear }, 60 * 60 * 1000)
  }

  return latestYear
}

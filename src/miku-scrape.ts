import JSSoup, { SoupTag } from 'jssoup'
import { getCached, storeCache } from './cache'
import { logInfo } from './logger'

export interface MikuResult {
  name: string
  author: string
  link: string
  image: string
  views: number
  postTime: string
  authorIcon?: string
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

const imageRegex = /url\(\/\/(.*)0150_0150(\..*)\)/
const imageLink = (styleAttr: string) => {
  const re = imageRegex.exec(styleAttr)
  return `https://${re?.[1]}0740_0500${re?.[2]}`
}

const viewsRegex = /閲覧数:([\d,]+)/
const getViews = (html: string) => {
  const re = viewsRegex.exec(html)
  return (re && parseInt(re[1].replace(',', ''), 10)) ?? 0
}

const postTimeRegex = /(\d\d\d\d\/\d\d\/\d\d \d\d:\d\d)/ // Beautiful
const getPostTime = (html: string) => {
  const re = postTimeRegex.exec(html)
  return re?.[1] ?? ''
}

export const paginatorRegex = /new Paginator\('_paginator', ([0-9]*)/
const pageCount = (page?: string) => Number((page && paginatorRegex.exec(page)?.[1]) ?? 1)

export const processPage = async (
  year: string,
  orderTag: string,
  page = 1,
): Promise<ResultsPage> => {
  const cacheKey = `page-result-v4/${year}/${orderTag}/${page}`
  const cached = await getCached<ResultsPage>(cacheKey)
  if (cached.data) {
    return cached.data
  }

  const yearTag = getYearTag(year)
  const piaproUrl = `https://piapro.jp/content_list/?view=image&tag=${yearTag}%E5%B9%B4%E9%9B%AA%E3%83%9F%E3%82%AF%E8%A1%A3%E8%A3%85&order=${orderTag}&page=${page}`

  logInfo(`Calling Piapro`, { piaproUrl })
  const mikuReq = await fetch(piaproUrl)
  console.log(`got response`, { status: mikuReq.status, ok: mikuReq.ok })
  const mikuHtml = await mikuReq.text()
  const soup = new JSSoup(mikuHtml)
  const images = soup.findAll('div', 'i_main')

  const results = images.map((item: SoupTag): MikuResult => {
    const linkElem: SoupTag = item.find(undefined, 'i_image')
    const asString = item.toString()
    return {
      name: item.find(undefined, 'thumb_over').text,
      author: item.find(undefined, 'i_title').text,
      authorIcon:
        item.find(undefined, 'i_icon')?.find('img').attrs['src'].replace('_0048.', '_0150.') ??
        null,
      image: imageLink(linkElem.attrs['style']),
      views: getViews(asString),
      postTime: getPostTime(asString),
      link: `https://piapro.jp${linkElem.attrs['href']}`,
    }
  })

  const result = {
    pageCount: pageCount(mikuHtml),
    results,
    piaproUrl,
  }

  await storeCache(cacheKey, result, 5 * 60 * 1000)

  return result
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

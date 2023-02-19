import JSSoup, { SoupTag } from 'jssoup'
import { example } from './example'

export interface MikuResult {
  name: string
  author: string
  link: string
  image: string
  authorIcon: string
  piaproUrl?: string
}

export interface ResultsPage {
  results: MikuResult[]
  pageCount: number
}

export const latestTag = "sd"
export const popularTag = "cv"

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

export const paginatorRegex = /new Paginator\('_paginator', ([0-9]*)/
const pageCount = (page?: string) => Number((page && paginatorRegex.exec(page)?.[1]) ?? 1)

export const processPage = (year: string, orderTag: string, page = 1): ResultsPage => {
  const yearTag = getYearTag(year)
  const piaproUrl = `https://piapro.jp/content_list/?view=image&tag=${yearTag}%E5%B9%B4%E9%9B%AA%E3%83%9F%E3%82%AF%E8%A1%A3%E8%A3%85&order=${orderTag}&page=${page}`
  
  const soup = new JSSoup(example)
  const images = soup.findAll('div', 'i_main')

  const results = images.map((item: SoupTag) => {
    const linkElem: SoupTag = item.find(undefined, 'i_image')
    return {
      name: item.find(undefined, 'thumb_over').text,
      author: item.find(undefined, 'i_title').text,
      authorIcon: item.find(undefined, 'i_icon')?.find('img').attrs['href'],
      image: imageLink(linkElem.attrs['style']),
      link: `https://piapro.jp${linkElem.attrs['href']}`,
      piaproUrl
    }
  })
  
  return {
    pageCount: pageCount(example),
    results
  }
}

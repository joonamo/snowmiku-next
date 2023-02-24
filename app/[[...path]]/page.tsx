import { AppProps, MikuPage } from '@/components/App'
import { defaultViewMode } from '@/components/staticConfig'
import { getLatestYear, latestTag, popularTag, processPage } from '@/src/miku-scrape'
import React from 'react'
import { notFound } from 'next/navigation'

const yearRe = /^20\d\d$/

const MikuApp = async ({ params }: { params: { path: string[] } }) => {
  const [yearParam, viewModeParam, pageParam] = params?.path ?? []

  if (yearParam && !yearRe.test(yearParam ?? '')) {
    throw notFound()
  }

  const configuration = {
    firstYear: 2012,
    latestYear: await getLatestYear(),
  }

  const yearParsed = yearParam && Number.parseInt(yearParam, 10)
  const year =
    yearParsed &&
    Number.isFinite(yearParsed) &&
    yearParsed <= configuration.latestYear + 1 &&
    yearParsed >= configuration.firstYear
      ? yearParsed
      : configuration.latestYear
  const currentPageParsed = pageParam && Number.parseInt(pageParam, 10)
  const currentPage =
    currentPageParsed && Number.isFinite(currentPageParsed) ? currentPageParsed : 1
  const viewMode =
    viewModeParam === 'Latest'
      ? 'Latest'
      : viewModeParam === 'Popular'
      ? 'Popular'
      : year === configuration.latestYear
      ? defaultViewMode
      : 'Popular'

  const { pageCount, results } = await processPage(
    String(year),
    viewMode === 'Latest' ? latestTag : popularTag,
    currentPage,
  )

  const props: AppProps = {
    configuration,
    currentPage,
    imagesInfos: results,
    pageCount,
    viewMode,
    year: String(year),
    generatedAt: new Date().toISOString(),
  }

  // const revalidate = year === configuration.latestYear ? 5 * 60 : 60 * 60

  // const configuration = {
  //   firstYear: 2012,
  //   latestYear: await getLatestYear(),
  // }

  // const year = configuration.latestYear
  // const page = 1

  // const { pageCount, results } = await processPage(String(year), latestTag, page)

  // const props: AppProps = {
  //   configuration,
  //   currentPage: 1,
  //   imagesInfos: results,
  //   pageCount,
  //   viewMode: defaultViewMode,
  //   year: String(year),
  //   generatedAt: new Date().toISOString(),
  // }

  return (
    <MikuPage
      configuration={props.configuration ?? null}
      currentPage={props.currentPage ?? 1}
      imagesInfos={props.imagesInfos ?? []}
      isLoading={false}
      pageCount={props.pageCount ?? 1}
      viewMode={props.viewMode ?? defaultViewMode}
      year={props.year ?? null}
      generatedAt={props.generatedAt}
      overrideTitle={props.overrideTitle}
    />
  )
}

export default MikuApp

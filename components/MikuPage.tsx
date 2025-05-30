import { getLatestYear, latestTag, popularTag, processPage } from '@/src/piapro-api'
import { GetStaticPaths, GetStaticProps } from 'next'
import { AppProps, ViewMode } from '@/components/App'
import { ParsedUrlQuery } from 'querystring'
import { defaultViewMode } from './staticConfig'
import { metadatabase } from '@/src/metadatabase'

interface YearQuery extends ParsedUrlQuery {
  year?: string
  viewMode?: ViewMode
  page?: string
}

const yearRe = /^20\d\d$/

export const getStaticPropsBase: GetStaticProps<AppProps, YearQuery> = async (query) => {
  if (query.params?.year != 'null' && !yearRe.test(query.params?.year ?? '')) {
    return { notFound: true }
  }

  const configuration = {
    firstYear: 2012,
    latestYear: await getLatestYear(),
  }

  const yearParsed = query.params?.year && Number.parseInt(query.params?.year, 10)
  const year =
    yearParsed &&
    Number.isFinite(yearParsed) &&
    yearParsed <= configuration.latestYear + 1 &&
    yearParsed >= configuration.firstYear
      ? yearParsed
      : configuration.latestYear
  const currentPageParsed = query.params?.page && Number.parseInt(query.params?.page, 10)
  const currentPage =
    currentPageParsed && Number.isFinite(currentPageParsed) ? currentPageParsed : 1
  const viewMode =
    query.params?.viewMode === 'Latest'
      ? 'Latest'
      : query.params?.viewMode === 'Popular'
      ? 'Popular'
      : year === configuration.latestYear
      ? defaultViewMode
      : 'Popular'

  const { pageCount, results, piaproUrl } = await processPage(
    String(year),
    viewMode === 'Latest' ? latestTag : popularTag,
    currentPage,
  )

  const metaEntry = metadatabase[String(year)]

  const props: AppProps = {
    configuration,
    currentPage,
    imagesInfos: results,
    pageCount,
    viewMode,
    year: String(year),
    officialPage: metaEntry?.officialPage ?? null,
    theme: metaEntry?.theme ?? null,
    themeTranslated: metaEntry?.themeTranslated ?? null,
    piaproUrl: piaproUrl
  }

  const revalidate = year === configuration.latestYear ? 5 * 60 : 60 * 60

  return {
    props,
    revalidate,
  }
}

export const getStaticPathsBase: GetStaticPaths = () => ({
  paths: [],
  fallback: true,
})

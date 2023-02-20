import { getLatestYear, latestTag, popularTag, processPage } from '@/src/miku-scrape'
import { GetStaticPaths, GetStaticProps } from 'next'
import { AppProps, ViewMode } from '@/components/App'
import { ParsedUrlQuery } from 'querystring'
import { defaultViewMode } from './staticConfig'

interface YearQuery extends ParsedUrlQuery {
  year?: string
  viewMode?: ViewMode
  page?: string
}

export const getStaticPropsBase: GetStaticProps<AppProps, YearQuery> = async (query) => {
  const configuration = {
    firstYear: 2012,
    latestYear: await getLatestYear()
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
  const currentPage = currentPageParsed && Number.isFinite(currentPageParsed) ? currentPageParsed : 1
  const viewMode = 
    query.params?.viewMode === 'Latest' ? 'Latest' :
    query.params?.viewMode === 'Popular' ? 'Popular' :
    defaultViewMode

  const { pageCount, results } = await processPage(String(year), viewMode === 'Latest' ? latestTag : popularTag, currentPage)

  const props: AppProps = {
    configuration,
    currentPage,
    imagesInfos: results,
    pageCount,
    viewMode,
    year: String(year),
    generatedAt: new Date().toISOString()
  }

  return {
    props,
    revalidate: 5 * 60,
  }
}

export const getStaticPathsBase: GetStaticPaths = () => ({
  paths: [], fallback: true
})

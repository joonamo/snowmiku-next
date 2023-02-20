import { getLatestYear, latestTag, processPage } from '@/src/miku-scrape'
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

  const year = query.params?.year ?? configuration.latestYear
  const currentPage = Number(query.params?.page ?? 1)
  const viewMode = 
    query.params?.viewMode === 'Latest' ? 'Latest' :
    query.params?.viewMode === 'Popular' ? 'Popular' :
    defaultViewMode

  const { pageCount, results } = await processPage(String(year), latestTag, currentPage)

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

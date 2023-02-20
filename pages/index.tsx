import { getLatestYear, latestTag, processPage } from '@/src/miku-scrape'
import { GetStaticProps } from 'next'
import { App, AppProps } from '@/components/App'

export default App

export const getStaticProps: GetStaticProps<AppProps> = async () => {
  const configuration = {
    firstYear: 2012,
    latestYear: await getLatestYear()
  }
  
  const year = configuration.latestYear
  const page = 1

  const {pageCount, results} = await processPage(String(year), latestTag, page)
  
  const props: AppProps = {
    configuration,
    currentPage: 1,
    imagesInfos: results,
    pageCount,
    viewMode: 'Latest',
    year: String(year)
  }

  return {
    props,
    revalidate: 5 * 60,
  }
}

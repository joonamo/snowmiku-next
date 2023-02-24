import { App, AppProps } from "@/components/App"
import { defaultViewMode } from "@/components/staticConfig"
import { getLatestYear } from "@/src/miku-scrape"
import { GetStaticProps } from "next"

export default App

export const getStaticProps: GetStaticProps<AppProps> = async () => {
  const configuration = {
    firstYear: 2012,
    latestYear: await getLatestYear(),
  }

  const props: AppProps = {
    configuration,
    currentPage: 1,
    imagesInfos: [
      {
        name: 'Server error 5XX',
        author: 'Click Miku to see latest designs!',
        image: '/logo.png',
        authorIcon: '/logo.png',
        link: '/',
        postTime: '',
        views: 500,
      },
    ],
    pageCount: 1,
    viewMode: defaultViewMode,
    year: configuration.latestYear.toString(),
    generatedAt: new Date().toISOString(),
    overrideTitle: 'Server error',
  }

  return {
    props,
    revalidate: 5 * 60,
  }
}
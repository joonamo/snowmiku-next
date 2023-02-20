import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"

import { Disclaimer } from "./Disclaimer"
import { Paginator } from "./Paginator"
import { ResultsSkeleton } from "./SkeletonResults"
import { defaultViewMode } from "./staticConfig"
import { Titlebar } from "./Titlebar"

export type ViewMode = "Latest" | "Popular"

export interface ImageInfo {
  name: string
  author: string
  link: string
  image: string
  authorIcon?: string
}

export interface Configuration {
  latestYear: number
  firstYear: number
}

export interface AppProps {
  imagesInfos: ImageInfo[]
  viewMode: ViewMode
  year: string | null
  currentPage: number
  pageCount: number
  configuration: Configuration | null
  isLoading?: boolean
  generatedAt?: string
}

export const App: React.FC<Partial<AppProps>> = (props) => {
  const router = useRouter()
  
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);
    const handleComplete = (url: string) => (url === router.asPath) && setLoading(false);

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })


  return <MikuPage 
    configuration={props.configuration ?? null}
    currentPage={props.currentPage ?? 1}
    imagesInfos={props.imagesInfos ?? []}
    isLoading={router.isFallback || loading}
    pageCount={props.pageCount ?? 1}
    viewMode={props.viewMode ?? defaultViewMode}
    year={props.year ?? null}
    generatedAt={props.generatedAt}
  />
}

const MikuPage: React.FunctionComponent<AppProps> = ({
  imagesInfos,
  viewMode,
  year,
  currentPage,
  pageCount,
  configuration,
  isLoading,
  generatedAt
}) => {  
  const title = `Snow Miku ${year ?? ""}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Browse Snow Miku ${
            year ?? ""
          } design competition entries in high resolution gallery`}
        />

        <link rel="icon" type="image/png" href="favicon.png" />

        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://snowmiku.net" />
        <meta property="og:image" content="logo.png" />
      </Head>
      <Titlebar
        viewMode={viewMode}
        year={year}
        configuration={configuration}
      />
      <section className="section">
        <div className="container">
          <h2 className="title">
            {viewMode === "Popular"
              ? "Most Popular Entries"
              : "Latest Entries"}
          </h2>
          <div>
            <Paginator
              currentPage={currentPage}
              pageCount={pageCount}
              key="head-paginator"
              year={year}
              viewMode={viewMode}
            />
            {!configuration || isLoading ? (
              <ResultsSkeleton />
            ) : (
              <>
                <Results results={imagesInfos} />
                <Paginator
                  currentPage={currentPage}
                  pageCount={pageCount}
                  key="footer-paginator"
                  year={year}
                  viewMode={viewMode}
                />
              </>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Disclaimer generatedAt={generatedAt} />
        </div>
      </section>
    </>
  )
}

interface ResultsProps {
  results: ImageInfo[]
  depth?: number
}
const Results: React.FunctionComponent<ResultsProps> = (props) => {
  const [_1, _2, ...rest] = props.results
  const depth = props.depth ?? 0

  return _1 ? (
    <>
      <div
        className="tile is-ancestor is-horizontal"
        key={`parent-tile-${depth}`}
      >
        {[_1, _2].map((r, i) => (
          <Result result={r} depth={depth} key={`${depth}-${i}`} />
        ))}
      </div>
      <Results results={rest} depth={depth + 1} />
    </>
  ) : null
}

interface ResultProps {
  result?: ImageInfo
  depth?: number
}
const Result: React.FunctionComponent<ResultProps> = ({ result, depth }) => {
  return result ? (
    <div className="tile is-parent" key={result.link}>
      <div className="tile is-child card" key={result.link}>
        <a href={result.link} target="blank">
          <div className="card-image">
            <figure className="image is-16by9">
              <img
                className="fit-contain"
                src={result.image}
                loading={depth === 0 ? "eager" : "lazy"}
              />
            </figure>
          </div>
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                  <img
                    className="is-rounded"
                    src={result.authorIcon}
                    loading="lazy"
                  />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-5">{result.name}</p>
                <p className="subtitle is-5">{result.author}</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  ) : null
}

/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'

import { Disclaimer } from './Disclaimer'
import { Paginator } from './Paginator'
import { Ribbon } from './Ribbon'
import { ResultsSkeleton } from './SkeletonResults'
import { defaultViewMode } from './staticConfig'
import { Titlebar } from './Titlebar'
import { MikuResult } from '@/src/miku-scrape'
import { ThemeTitle } from './ThemeTitle'

export type ViewMode = 'Latest' | 'Popular'

export interface Configuration {
  latestYear: number
  firstYear: number
}

export interface AppProps {
  imagesInfos: MikuResult[]
  viewMode: ViewMode
  year: string | null
  currentPage: number
  pageCount: number
  configuration: Configuration | null
  isLoading?: boolean
  generatedAt?: string
  overrideTitle?: string
  officialPage?: string | null
  theme?: string | null
  themeTranslated?: string | null
}

export const App: React.FC<Partial<AppProps>> = (props) => {
  const router = useRouter()

  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return (
    <MikuPage
      configuration={props.configuration ?? null}
      currentPage={props.currentPage ?? 1}
      imagesInfos={props.imagesInfos ?? []}
      isLoading={router.isFallback || loading}
      pageCount={props.pageCount ?? 1}
      viewMode={props.viewMode ?? defaultViewMode}
      year={props.year ?? null}
      generatedAt={props.generatedAt}
      overrideTitle={props.overrideTitle}
      officialPage={props.officialPage ?? null}
      theme={props.theme ?? null}
      themeTranslated={props.themeTranslated ?? null}
    />
  )
}

const MikuPage: React.FunctionComponent<AppProps> = ({
  imagesInfos,
  viewMode,
  year,
  currentPage,
  pageCount,
  configuration,
  isLoading,
  generatedAt,
  overrideTitle,
  officialPage,
  theme,
  themeTranslated
}) => {
  const title = `Snow Miku ${year ?? ''}`
  const pageTitle =
    overrideTitle ?? (viewMode === 'Popular' ? 'Most Popular Entries' : 'Latest Entries')
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name='description'
          content={`Browse Snow Miku ${
            year ?? ''
          } design competition entries in high resolution gallery`}
        />

        <link rel='icon' type='image/png' href='/favicon.png' />
        <meta name='theme-color' content='hsl(207, 61%, 53%)' />

        <meta property='og:title' content={title} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://snowmiku.net' />
        <meta property='og:image' content='logo.png' />
      </Head>
      <Titlebar
        viewMode={viewMode}
        year={year}
        configuration={configuration}
        officialPage={officialPage}
      />
      <section className='section pt-2'>
        <div className='container'>
          <div className='columns title-columns'>
            <div className='column is-hidden-mobile is-narrow'>
              <h1 className='title'>{pageTitle}</h1>
            </div>
            <div className='column'>
              <ThemeTitle theme={theme} themeTranslated={themeTranslated} />
            </div>
            <div className='column is-hidden-tablet pt-0 pb-0'>
              <h1 className='title'>{pageTitle}</h1>
            </div>
          </div>
          <div>
            <Paginator
              currentPage={currentPage}
              pageCount={pageCount}
              key='head-paginator'
              year={year}
              viewMode={viewMode}
            />
            {!configuration || isLoading ? <ResultsSkeleton /> : <Results results={imagesInfos} />}
            <Paginator
              currentPage={currentPage}
              pageCount={pageCount}
              key='footer-paginator'
              year={year}
              viewMode={viewMode}
            />
          </div>
        </div>
      </section>
      <section className='section'>
        <div className='container'>
          <Disclaimer generatedAt={generatedAt} />
        </div>
      </section>
    </>
  )
}

interface ResultsProps {
  results: MikuResult[]
  depth?: number
}
const Results: React.FunctionComponent<ResultsProps> = (props) => {
  const [_1, _2, ...rest] = props.results
  const depth = props.depth ?? 0

  return _1 ? (
    <>
      <div className='tile is-ancestor is-horizontal' key={`parent-tile-${depth}`}>
        {[_1, _2].map((r, i) => (
          <Result result={r} depth={depth} key={`${depth}-${i}`} />
        ))}
      </div>
      <Results results={rest} depth={depth + 1} />
    </>
  ) : null
}

interface ResultProps {
  result?: MikuResult
  depth?: number
}
const Result: React.FunctionComponent<ResultProps> = ({ result, depth }) => {
  return result ? (
    <div className='tile is-parent' key={result.link}>
      <div className='tile is-child card is-clipped' key={result.link}>
        <a
          href={result.link}
          target={result.link.startsWith('http') ? '_blank' : ''}
          rel='noreferrer'
        >
          <div className='card-image has-background-grey-lighter'>
            <figure className='image is-16by9'>
              <img
                className='fit-contain'
                src={result.image}
                loading={depth === 0 ? 'eager' : 'lazy'}
                alt={`${result.name} by ${result.author}`}
              />
            </figure>
          </div>
          <div className='card-content is-paddingless'>
            {(result.isFinalist || result.isWinner) && (
              <Ribbon type={result.isWinner ? 'winner' : 'finalist'} />
            )}
            <div className='media p-3'>
              <div className='media-left'>
                <figure className='image is-48x48'>
                  <img
                    className='is-rounded'
                    src={result.authorIcon}
                    loading='lazy'
                    alt={`Avatar of ${result.author}`}
                    width='48px'
                    height='48px'
                  />
                </figure>
              </div>
              <div className='media-content'>
                <p className='title is-5'>{result.name}</p>
                <p className='subtitle is-5 mb-1'>{result.author}</p>
                <p className='subtitle is-7'>
                  {result.postTime} views {result.views.toLocaleString('en-US')}
                </p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  ) : null
}

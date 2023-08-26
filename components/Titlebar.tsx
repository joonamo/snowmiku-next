/* eslint-disable no-unused-vars */
import ClassNames from 'classnames'
import Link from 'next/link'
import * as React from 'react'
import { Configuration, ViewMode } from './App'
import { ExternalLink } from './ExternalLink'
import { Logo } from './logo'
import { metadatabase } from '@/src/metadatabase'

interface TitlebarProps {
  viewMode: ViewMode
  year: string | null
  configuration: Configuration | null
  officialPage?: string
}

export const Titlebar: React.FunctionComponent<TitlebarProps> = ({
  viewMode,
  year,
  configuration,
  officialPage,
}) => {
  const [burgerOpen, setBurgerOpen] = React.useState<boolean>(false)
  const [sortDropdownOpen, setSortDropdownOpen] = React.useState<boolean>(false)
  const [yearDropdownOpen, setYearDropdownOpen] = React.useState<boolean>(false)

  const closeSubmenus = React.useCallback(() => {
    setSortDropdownOpen(false)
    setYearDropdownOpen(false)
  }, [setSortDropdownOpen, setYearDropdownOpen])

  const closeAll = React.useCallback(() => {
    closeSubmenus()
    setBurgerOpen(false)
  }, [setBurgerOpen, closeSubmenus])

  const toggleBurger = React.useCallback(() => {
    if (burgerOpen) {
      closeAll()
    } else {
      setBurgerOpen(true)
    }
  }, [burgerOpen, setBurgerOpen, closeAll])

  const toggleSortDropdown = React.useCallback(() => {
    if (sortDropdownOpen) {
      setSortDropdownOpen(false)
    } else {
      closeSubmenus()
      setSortDropdownOpen(true)
    }
  }, [sortDropdownOpen, setSortDropdownOpen, closeSubmenus])

  const toggleYearDropdown = React.useCallback(() => {
    if (yearDropdownOpen) {
      setYearDropdownOpen(false)
    } else {
      closeSubmenus()
      setYearDropdownOpen(true)
    }
  }, [yearDropdownOpen, setYearDropdownOpen, closeSubmenus])

  return (
    <nav
      className='navbar is-info is-fixed-top add-shadow'
      role='navigation'
      aria-label='main navigation'
    >
      <div className='logo-container'>
        <Logo />
      </div>
      <div className='navbar-brand'>
        <div className='navbar-item is-paddingless is-hidden-touch'>
          <p className='title has-text-white'>Snow Miku</p>
        </div>
        <div className='is-paddingless navbar-item is-hidden-desktop flex-1'>
          <p className='title main-title flex-1 has-text-white has-text-right-mobile'>
            Snow Miku {year}
          </p>
        </div>

        <YearSelector
          configuration={configuration}
          isTitle={true}
          closeMenu={closeAll}
          toggleYearDropdown={toggleYearDropdown}
          year={year}
          yearDropdownOpen={yearDropdownOpen}
        />

        <a
          role='button'
          className={ClassNames('navbar-burger', {
            'is-active': burgerOpen,
          })}
          aria-label='menu'
          aria-expanded='false'
          onClick={toggleBurger}
        >
          <span aria-hidden='true' />
          <span aria-hidden='true' />
          <span aria-hidden='true' />
        </a>
      </div>

      <div
        className={ClassNames('navbar-menu', {
          'is-active': burgerOpen,
        })}
      >
        <div className='navbar-start'>
          <YearSelector
            configuration={configuration}
            isTitle={false}
            closeMenu={closeAll}
            toggleYearDropdown={toggleYearDropdown}
            year={year}
            yearDropdownOpen={yearDropdownOpen}
          />

          <div
            className={ClassNames('navbar-item', 'has-dropdown', {
              'is-active': sortDropdownOpen,
            })}
          >
            <a className='navbar-link' onClick={toggleSortDropdown} role='button'>
              {`Sort: ${viewMode}`}
            </a>

            <div
              className={ClassNames('navbar-dropdown', {
                'is-hidden-touch': !sortDropdownOpen,
              })}
            >
              <Link href={`/${year}/Latest`} className='navbar-item' onClick={closeAll}>
                Latest
              </Link>
              <Link href={`/${year}/Popular`} className='navbar-item' onClick={closeAll}>
                Popular
              </Link>
            </div>
          </div>

          {officialPage && (
            <a href={officialPage} target='_blank' className='navbar-item'>
              <span>Official Design Contest page</span>
              <span className='icon'>
                <ExternalLink />
              </span>
            </a>
          )}

          <a href='https://snowmiku.com/' target='blank' className='navbar-item'>
            <span>SnowMiku.com</span>
            <span className='icon'>
              <ExternalLink />
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}

interface YearSelectorProps {
  year: string | null
  isTitle: boolean
  yearDropdownOpen: boolean
  toggleYearDropdown: () => void
  closeMenu: () => void
  configuration: Configuration | null
}
const YearSelector: React.FunctionComponent<YearSelectorProps> = ({
  year,
  isTitle,
  yearDropdownOpen,
  toggleYearDropdown,
  configuration,
  closeMenu,
}) => (
  <div
    className={ClassNames(
      'navbar-item',
      'has-dropdown',
      { 'is-active': yearDropdownOpen },
      isTitle ? 'is-hidden-touch' : 'is-hidden-desktop',
    )}
  >
    <a className='navbar-link navbar-item' onClick={toggleYearDropdown} role='button'>
      <p className={isTitle ? 'title has-text-white' : ''}>
        {!isTitle ? 'Year:' : ''} {year}
      </p>
    </a>

    <div
      className={ClassNames('navbar-dropdown', {
        'is-hidden-touch': !yearDropdownOpen,
      })}
    >
      <YearSelectors configuration={configuration} closeMenu={closeMenu} />
    </div>
  </div>
)

interface YearSelectorsProps {
  configuration: Configuration | null
  closeMenu: () => void
}
const YearSelectors: React.FunctionComponent<YearSelectorsProps> = ({
  configuration,
  closeMenu,
}) => {
  if (configuration) {
    const selectors = []
    for (let year = configuration.latestYear; year >= configuration.firstYear; year--) {
      const themeTranslated = metadatabase[String(year)]?.themeTranslated ?? undefined
      selectors.push(
        <Link
          className='navbar-item is-tabular-numeric'
          onClick={closeMenu}
          href={`/${year}`}
          key={`year-selector-${year}`}
        >
          {year}{themeTranslated ? `: ${themeTranslated}`: ''}
        </Link>,
      )
    }
    return <>{selectors}</>
  } else {
    return null
  }
}

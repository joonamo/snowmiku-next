import { defaultTheme, defaultThemeTranslated } from '@/src/metadatabase'
import classNames from 'classnames'

type Props = {
  theme?: string[] | null
  themeTranslated?: string | null
}

export const ThemeTitle: React.FC<Props> = ({ theme, themeTranslated }) => {
  const usedTheme = (theme ?? defaultTheme).join?.('​')
  return (
    <div className='theme-container' aria-hidden='true' aria-disabled='true'>
      <div className={classNames('calligraphy', usedTheme.length > 6 && 'long-title')} lang='jp'>
        {usedTheme}
      </div>
      <div className='theme-translated'>{themeTranslated ?? defaultThemeTranslated}</div>
    </div>
  )
}

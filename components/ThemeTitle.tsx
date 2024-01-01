import { defaultTheme, defaultThemeTranslated } from '@/src/metadatabase'

type Props = {
  theme?: string
  themeTranslated?: string
}

export const ThemeTitle: React.FC<Props> = ({ theme, themeTranslated }) => (
  <div className='theme-container' aria-hidden='true' aria-disabled='true'>
    <div className='calligraphy'>{theme ?? defaultTheme}</div>
    <div className='theme-translated'>{themeTranslated ?? defaultThemeTranslated}</div>
  </div>
)

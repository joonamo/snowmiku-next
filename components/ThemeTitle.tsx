import { defaultTheme, defaultThemeTranslated } from "@/src/metadatabase"

type Props = {
  theme?: string
  themeTranslated?: string
}

export const ThemeTitle: React.FC<Props> = ({ theme, themeTranslated }) => (
  <div className='theme-container'>
    <div className='calligraphy'>{theme ?? defaultTheme}</div>
    <div className='theme-translated'>{themeTranslated ?? defaultThemeTranslated}</div>
  </div>
)

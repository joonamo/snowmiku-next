type YearMetadata = {
  winner?: string
  finalists?: string[]
  officialPage?: string
  theme?: string
  themeTranslated?: string
}

export const defaultTheme = '雪ミク'
export const defaultThemeTranslated = 'Snow Miku'

// Look at this fancy database!
export const metadatabase: Record<string, YearMetadata> = {
  '2024': {
    winner: 'H6zW',
    finalists: ['lixB', 'J9L4', 'hSdP', '9nud', 'H6zW', 'R29y'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2024snowmiku_p7hemqu6/',
    theme: 'ごちそう',
    themeTranslated: 'Feast',
  },
  '2023': {
    winner: 'sMw9',
    finalists: ['f23G', 'MVrT', 'mUlf', 'sMw9', 'p0xi', 'iQlv'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2023snowmiku_s5gnpkaj/',
    theme: '空模様',
    themeTranslated: 'Patterns of the Sky',
  },
  '2022': {
    winner: '-URY',
    finalists: ['NE6v', '-URY', 'IzMb', 'CPH6', 'nay8', '2m3q'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2022snowmiku_pb4vp5/',
    theme: '海',
    themeTranslated: 'Ocean',
  },
  '2021': {
    winner: 'CySS',
    finalists: ['CySS', 'ibL9', 'oJbN', '4hY9', 'bjDz', '6BM0'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2021snowmiku',
    theme: 'イルミネーション',
    themeTranslated: 'Illumination',
  },
  '2020': {
    winner: 'HnGM',
    finalists: ['HnGM', 'YxrR', 'saxQ', 'sWBP', 'lO2m', 'P9Kf'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2020snowmiku/',
    theme: '楽器',
    themeTranslated: 'Musical Instruments',
  },
  '2019': {
    winner: '70Dn',
    finalists: ['70Dn', '1oP2', '579f', 'e6cX', 'Mne6', 'liso'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2019snowmiku/',
    theme: 'プリンセス',
    themeTranslated: 'Princess',
  },
  '2018': {
    winner: 'u9XO',
    finalists: ['u9XO', 'faiV', '5r3E', 'qyP6', '_ytg', 'xBrM'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2018snowmiku',
    theme: 'どうぶつ',
    themeTranslated: 'Animals',
  },
  '2017': {
    winner: 'HKTc',
    finalists: ['HKTc', 'v0kt', '1WSt', 'S5v3', 'muF1', 'PYTJ'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2017snowmiku',
    theme: '星空/星座',
    themeTranslated: 'Starry Sky/Constellations',
  },
  '2016': {
    winner: 'uDla',
    finalists: ['uDla', 'tfBD', 'cAEy', 'XXfw'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2016snowmiku',
    theme: 'ウインタースポーツ',
    themeTranslated: 'Winter Sports',
  },
  '2015': {
    winner: 'w8W1',
    finalists: ['w8W1'],
    officialPage: 'https://piapro.jp/pages/official_collabo/2015snowmiku/',
    theme: '植物',
    themeTranslated: 'Plants',
  },
  '2014': {
    winner: 'xy8T',
    finalists: ['xy8T'],
    officialPage: 'https://piapro.jp/static/?view=2014yukimiku',
    theme: '魔法少女',
    themeTranslated: 'Magical Girl',
  },
  '2013': {
    winner: 'XSGC',
    finalists: ['XSGC'],
    officialPage: 'https://piapro.jp/static/?view=2013yukimiku',
    theme: 'お菓子',
    themeTranslated: 'Sweets',
  },
  '2012': {
    winner: 'Broe',
    finalists: ['Broe'],
    officialPage: 'https://piapro.jp/static/?view=2012yukimiku',
    theme: '宝石',
    themeTranslated: 'Jewels'
  },
}

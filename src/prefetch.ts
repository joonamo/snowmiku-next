const baseurl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`

export const prefetchPage = (year: string, orderTag: string, page: number) => {
  if (baseurl) {
    const apiUrl = `${baseurl}/api/${orderTag}?year=${year}&page=${page}&noprefetch=${true}`
    console.log(`Prefetching ${baseurl}`)
    void fetch(apiUrl)
  }
}

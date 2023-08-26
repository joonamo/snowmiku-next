import "@/styles/style.scss"
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

import classNames from 'classnames'
import { Html, Head, Main, NextScript } from 'next/document'
import { inter } from './_app'

export default function Document() {
  return (
    <Html lang='en' className={classNames('has-navbar-fixed-top','has-background-info-light',inter.className)}>
      <Head>
        {/* <!-- Cloudflare Web Analytics --> */}
        <script
          defer
          src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "b67ae99479644c5bae13a7d868bd7dfd"}'
        ></script>
        {/* <!-- End Cloudflare Web Analytics --> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

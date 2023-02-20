import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="has-navbar-fixed-top has-background-info-light">
      <Head>
        {/* <!-- Cloudflare Web Analytics --> */}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
          data-cf-beacon='{"token": "b67ae99479644c5bae13a7d868bd7dfd"}'></script>
        {/* <!-- End Cloudflare Web Analytics --> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

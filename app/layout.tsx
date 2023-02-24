import '@/styles/style.scss'
 import Script from 'next/script'
import React from 'react'

export default function Rootlayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className='has-navbar-fixed-top has-background-info-light'>
      {/* <!-- Cloudflare Web Analytics --> */}
      <Script
        defer
        src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "b67ae99479644c5bae13a7d868bd7dfd"}'
      />
      {/* <!-- End Cloudflare Web Analytics --> */}
      <body>{children}</body>
    </html>
  )
}

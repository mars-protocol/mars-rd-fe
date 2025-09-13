'use client'

import { useMemo } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { usePathname } from 'next/navigation'

import PAGE_METADATA from 'constants/pageMetadata'

const helmetContext = {}

function PageMetadata() {
  const pathname = usePathname()

  const metadata = useMemo(() => {
    const route = pathname.split('/').reverse()[0] as keyof typeof PAGE_METADATA
    return PAGE_METADATA[route] || PAGE_METADATA['main']
  }, [pathname])

  return (
    <HelmetProvider context={helmetContext}>
      <Helmet>
        <title>{metadata.title}</title>
        <meta content={metadata.title} property='og:title' />
        <meta name='description' content={metadata.description} property='og:description' />
        <meta name='keywords' content={metadata.keywords} property='og:keywords' />
      </Helmet>
    </HelmetProvider>
  )
}

export default PageMetadata

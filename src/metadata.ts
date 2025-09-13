import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    default: 'Mars Protocol Risk Dashboard',
    template: '%s | Mars Protocol Risk Dashboard',
  },
  description:
    'Insights for Mars Protocol - Check liquidations, perps markets, tokenomics, and protocol health in real-time.',
  keywords: [
    'Mars Protocol',
    'DeFi',
    'Risk Dashboard',
    'Liquidations',
    'Perpetuals',
    'Tokenomics',
    'Cosmos',
    'Neutron',
    'Osmosis',
  ],
  authors: [{ name: 'Mars Protocol' }],
  creator: 'Mars Protocol',
  publisher: 'Mars Protocol',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://stats.marsprotocol.io'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://stats.marsprotocol.io',
    siteName: 'Mars Protocol Risk Dashboard',
    title: 'Mars Protocol Risk Dashboard',
    description:
      'Insights for Mars Protocol - Check liquidations, perps markets, tokenomics, and protocol health in real-time.',
    images: [
      {
        url: 'https://stats.marsprotocol.io/og-images/main.jpg',
        width: 1032,
        height: 540,
        alt: 'Mars Protocol Risk Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mars_protocol',
    creator: '@mars_protocol',
    title: 'Mars Protocol Risk Dashboard',
    description:
      'Insights for Mars Protocol - Check liquidations, perps markets, tokenomics, and protocol health in real-time.',
    images: ['https://stats.marsprotocol.io/og-images/main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

// Page-specific metadata configurations
export const pageMetadata = {
  home: {
    title: 'Overview',
    description:
      'Mars Protocol risk dashboard overview - Monitor key metrics, liquidations, and protocol health across all supported chains.',
    openGraph: {
      title: 'Mars Protocol Risk Dashboard - Overview',
      description:
        'Mars Protocol risk dashboard overview - Monitor key metrics, liquidations, and protocol health across all supported chains.',
      images: [
        {
          url: 'https://stats.marsprotocol.io/og-images/main.jpg',
          width: 1032,
          height: 540,
          alt: 'Mars Protocol Risk Dashboard - Overview',
        },
      ],
    },
    twitter: {
      title: 'Mars Protocol Risk Dashboard - Overview',
      description:
        'Mars Protocol risk dashboard overview - Monitor key metrics, liquidations, and protocol health across all supported chains.',
      images: ['https://stats.marsprotocol.io/og-images/main.jpg'],
    },
  },
  liquidations: {
    title: 'Liquidations',
    description:
      'Real-time liquidation monitoring for Mars Protocol - Track liquidation events, volumes, and trends across all markets.',
    openGraph: {
      title: 'Mars Protocol - Liquidations Dashboard',
      description:
        'Real-time liquidation monitoring for Mars Protocol - Track liquidation events, volumes, and trends across all markets.',
      images: [
        {
          url: 'https://stats.marsprotocol.io/og-images/liquidations.jpg',
          width: 1032,
          height: 540,
          alt: 'Mars Protocol - Liquidations Dashboard',
        },
      ],
    },
    twitter: {
      title: 'Mars Protocol - Liquidations Dashboard',
      description:
        'Real-time liquidation monitoring for Mars Protocol - Track liquidation events, volumes, and trends across all markets.',
      images: ['https://stats.marsprotocol.io/og-images/liquidations.jpg'],
    },
  },
  perps: {
    title: 'Perpetuals Overview',
    description:
      'Mars Protocol perpetuals markets overview - Monitor trading volumes, open interest, and market statistics.',
    openGraph: {
      title: 'Mars Protocol - Perpetuals Markets',
      description:
        'Mars Protocol perpetuals markets overview - Monitor trading volumes, open interest, and market statistics.',
      images: [
        {
          url: 'https://stats.marsprotocol.io/og-images/perps.jpg',
          width: 1032,
          height: 540,
          alt: 'Mars Protocol - Perpetuals Markets',
        },
      ],
    },
    twitter: {
      title: 'Mars Protocol - Perpetuals Markets',
      description:
        'Mars Protocol perpetuals markets overview - Monitor trading volumes, open interest, and market statistics.',
      images: ['https://stats.marsprotocol.io/og-images/perps.jpg'],
    },
  },
  tokenomics: {
    title: 'Tokenomics',
    description:
      'Mars Protocol tokenomics dashboard - Track MARS token supply, distribution, and key economic metrics.',
    openGraph: {
      title: 'Mars Protocol - Tokenomics Dashboard',
      description:
        'Mars Protocol tokenomics dashboard - Track MARS token supply, distribution, and key economic metrics.',
      images: [
        {
          url: 'https://stats.marsprotocol.io/og-images/tokenomics.jpg',
          width: 1032,
          height: 540,
          alt: 'Mars Protocol - Tokenomics Dashboard',
        },
      ],
    },
    twitter: {
      title: 'Mars Protocol - Tokenomics Dashboard',
      description:
        'Mars Protocol tokenomics dashboard - Track MARS token supply, distribution, and key economic metrics.',
      images: ['https://stats.marsprotocol.io/og-images/tokenomics.jpg'],
    },
  },
}

// Generate dynamic metadata for perps market pages
export const generatePerpsMarketMetadata = (marketName: string): Metadata => {
  const title = `${marketName} Market`
  const description = `Detailed analytics for ${marketName} perpetuals market on Mars Protocol - Trading data, open interest, funding rates, and more.`

  return {
    title,
    description,
    openGraph: {
      title: `Mars Protocol - ${title}`,
      description,
      images: [
        {
          url: `/api/og/perps/${encodeURIComponent(marketName.toLowerCase())}`,
          width: 1032,
          height: 540,
          alt: `${marketName} Market Analytics`,
        },
      ],
    },
    twitter: {
      title: `Mars Protocol - ${title}`,
      description,
      images: [`/api/og/perps/${encodeURIComponent(marketName.toLowerCase())}`],
    },
  }
}

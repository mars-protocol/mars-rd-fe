import Fallback from 'components/common/Fallback'
import { Metadata } from 'next'
import { Suspense } from 'react'
import getPerpsMarkets from 'api/perps/getPerpsMarkets'
import { generatePerpsMarketMetadata } from '../../../metadata'
import PerpsMarketPageContent from './components/PerpsMarketPageContent'

interface PerpsMarketPageProps {
  params: Promise<{
    market: string
  }>
}

export async function generateStaticParams() {
  const perpsMarkets = await getPerpsMarkets()
  return perpsMarkets.map((asset) => ({
    market: asset.denom.replace('perps/', ''), // Remove 'perps/' prefix for URL
  }))
}

export async function generateMetadata({ params }: PerpsMarketPageProps): Promise<Metadata> {
  const { market } = await params
  const fullDenom = `perps/${market}`

  // Find the asset data to get the correct symbol and description
  const perpsMarkets = await getPerpsMarkets()
  const marketAsset = perpsMarkets.find((asset) => asset.denom === fullDenom)
  const marketSymbol = marketAsset?.symbol || market.toUpperCase()
  const marketDescription =
    marketAsset?.description || market.charAt(0).toUpperCase() + market.slice(1)

  return generatePerpsMarketMetadata(marketSymbol, marketDescription, market)
}

export default async function PerpsMarketPage({ params }: PerpsMarketPageProps) {
  const { market } = await params
  const fullDenom = `perps/${market}` // Convert URL param back to full denom
  return (
    <Suspense fallback={<Fallback />}>
      <PerpsMarketPageContent market={fullDenom} />
    </Suspense>
  )
}

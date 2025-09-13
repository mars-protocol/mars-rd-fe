import { CircularProgress } from 'components/common/CircularProgress'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { neutronPerps } from '../../../data/assets/neutron-perps'
import { generatePerpsMarketMetadata } from '../../../metadata'
import PerpsMarketPageContent from './components/PerpsMarketPageContent'

interface PerpsMarketPageProps {
  params: Promise<{
    market: string
  }>
}

export function generateStaticParams() {
  return neutronPerps.map((asset) => ({
    market: asset.denom.replace('perps/', ''), // Remove 'perps/' prefix for URL
  }))
}

export async function generateMetadata({ params }: PerpsMarketPageProps): Promise<Metadata> {
  const { market } = await params
  const marketName = market.toUpperCase()
  return generatePerpsMarketMetadata(marketName)
}

export default async function PerpsMarketPage({ params }: PerpsMarketPageProps) {
  const { market } = await params
  const fullDenom = `perps/${market}` // Convert URL param back to full denom
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center w-full h-screen'>
          <CircularProgress size={32} />
        </div>
      }
    >
      <PerpsMarketPageContent market={fullDenom} />
    </Suspense>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import PerpsPageContent from '../../components/PerpsPageContent'

interface PerpsMarketPageContentProps {
  market: string
}

export default function PerpsMarketPageContent({ market }: PerpsMarketPageContentProps) {
  const router = useRouter()

  useEffect(() => {
    // placeholder for side-effects if needed
  }, [market])

  return <PerpsPageContent selectedMarket={market} />
}

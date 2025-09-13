import { Metadata } from 'next'
import { Suspense } from 'react'
import { pageMetadata } from '../../metadata'
import PerpsPageContent from './components/PerpsPageContent'

export const metadata: Metadata = pageMetadata.perps

export default function PerpsPage() {
  return (
    <Suspense fallback={null}>
      <PerpsPageContent />
    </Suspense>
  )
}

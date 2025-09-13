import { Metadata } from 'next'
import { Suspense } from 'react'
import { pageMetadata } from '../../metadata'
import PerpsPageContent from './components/PerpsPageContent'
import Fallback from 'components/common/Fallback'

export const metadata: Metadata = pageMetadata.perps

export default function PerpsPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <PerpsPageContent />
    </Suspense>
  )
}

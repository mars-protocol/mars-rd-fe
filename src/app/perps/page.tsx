import { CircularProgress } from 'components/common/CircularProgress'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { pageMetadata } from '../../metadata'
import PerpsPageContent from './components/PerpsPageContent'

export const metadata: Metadata = pageMetadata.perps

export default function PerpsPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center w-full h-screen'>
          <CircularProgress size={32} />
        </div>
      }
    >
      <PerpsPageContent />
    </Suspense>
  )
}

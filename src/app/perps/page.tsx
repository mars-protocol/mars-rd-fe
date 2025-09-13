import { Metadata } from 'next'
import { pageMetadata } from '../../metadata'
import PerpsPageContent from './components/PerpsPageContent'

export const metadata: Metadata = {
  title: pageMetadata.perps.title,
  description: pageMetadata.perps.description,
  openGraph: pageMetadata.perps.openGraph,
}

export default function PerpsPage() {
  return <PerpsPageContent />
}

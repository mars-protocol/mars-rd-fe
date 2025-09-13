import { Metadata } from 'next'
import { pageMetadata } from '../../metadata'
import TokenomicsPageContent from './components/TokenomicsPageContent'

export const metadata: Metadata = {
  title: pageMetadata.tokenomics.title,
  description: pageMetadata.tokenomics.description,
  openGraph: pageMetadata.tokenomics.openGraph,
}

export default function TokenomicsPage() {
  return <TokenomicsPageContent />
}

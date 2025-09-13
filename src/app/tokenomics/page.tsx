import { Metadata } from 'next'
import { pageMetadata } from '../../metadata'
import TokenomicsPageContent from './components/TokenomicsPageContent'

export const metadata: Metadata = pageMetadata.tokenomics

export default function TokenomicsPage() {
  return <TokenomicsPageContent />
}

import { Metadata } from 'next'
import { pageMetadata } from '../../metadata'
import LiquidationsPageContent from './components/LiquidationsPageContent'

export const metadata: Metadata = {
  title: pageMetadata.liquidations.title,
  description: pageMetadata.liquidations.description,
  openGraph: pageMetadata.liquidations.openGraph,
}

export default function LiquidationsPage() {
  return <LiquidationsPageContent />
}

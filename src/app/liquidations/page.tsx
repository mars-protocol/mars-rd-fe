import { pageMetadata } from 'metadata'
import { Metadata } from 'next'
import LiquidationsPageContent from 'app/liquidations/components/LiquidationsPageContent'

export const metadata: Metadata = pageMetadata.liquidations

export default function LiquidationsPage() {
  return <LiquidationsPageContent />
}

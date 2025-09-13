import { Metadata } from 'next'
import { pageMetadata } from '../../metadata'
import LiquidationsPageContent from './components/LiquidationsPageContent'

export const metadata: Metadata = pageMetadata.liquidations

export default function LiquidationsPage() {
  return <LiquidationsPageContent />
}

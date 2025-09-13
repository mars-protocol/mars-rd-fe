import { Metadata } from 'next'
import { pageMetadata } from '../metadata'
import MainPageContent from './components/MainPageContent'

export const metadata: Metadata = {
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  openGraph: pageMetadata.home.openGraph,
}

export default function HomePage() {
  return <MainPageContent />
}

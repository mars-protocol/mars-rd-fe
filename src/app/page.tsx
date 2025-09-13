import { Metadata } from 'next'
import { pageMetadata } from '../metadata'
import MainPageContent from './components/MainPageContent'

export const metadata: Metadata = pageMetadata.home

export default function HomePage() {
  return <MainPageContent />
}

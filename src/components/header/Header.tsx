'use client'

import { MarsToken } from 'components/common/Icons'
import ChainSelect from 'components/header/ChainSelect'
import DesktopNavigation from 'components/header/navigation/desktop/DesktopNavigation'
import { NavLink } from 'components/header/navigation/desktop/NavLink'
import MobileNavigation from 'components/header/navigation/mobile/MobileNavigation'
import MobileNavigationToggle from 'components/header/navigation/mobile/MobileNavigationToggle'
import { useSearchParams } from 'next/navigation'

const menuTree = (chainConfig: ChainConfig): MenuTreeEntry[] => [
  {
    pages: ['main' as Page],
    label: 'Home',
  },
  {
    pages: ['liquidations' as Page],
    label: 'Liquidations',
  },
  {
    pages: ['tokenomics' as Page],
    label: 'Tokenomics',
  },
  ...(chainConfig.perps
    ? [
        {
          pages: ['perps' as Page],
          label: 'Perps',
        },
      ]
    : []),
]

export default function Header() {
  const searchParams = useSearchParams()
  const isIframeView = searchParams?.get('iframeView') === 'on'

  if (isIframeView) return null

  return (
    <>
      <header className='fixed top-0 left-0 z-50 w-full max-w-screen-full bg-surface-dark'>
        <div className='flex justify-between items-center px-4 py-4 h-18'>
          <div className='flex relative z-50 flex-1 items-center'>
            <NavLink isHome item={{ pages: ['main'], label: 'home' }}>
              <span className='block w-10 h-10'>
                <MarsToken className='text-white' />
              </span>
            </NavLink>
            <DesktopNavigation menuTree={menuTree} />
          </div>
          <div className='flex gap-4'>
            <ChainSelect className='hidden md:flex' />
            <MobileNavigationToggle className='md:hidden' />
          </div>
        </div>
      </header>
      <MobileNavigation menuTree={menuTree} />
    </>
  )
}

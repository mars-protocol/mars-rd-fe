import classNames from 'classnames'
import { Logo } from 'components/common/Icons'
import ChainSelect from 'components/header/ChainSelect'
import DesktopNavigation from 'components/header/navigation/desktop/DesktopNavigation'
import { NavLink } from 'components/header/navigation/desktop/NavLink'
import MobileNavigation from 'components/header/navigation/mobile/MobileNavigation'
import MobileNavigationToggle from 'components/header/navigation/mobile/MobileNavigationToggle'
import { isMobile } from 'react-device-detect'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams] = useSearchParams()
  const isIframeView = searchParams.get('iframeView') === 'on'

  if (isIframeView) return null

  return (
    <>
      <header
        className={classNames(
          'fixed left-0 top-0 z-50 w-full max-w-screen-full',
          'before:content-[" "] before:absolute before:inset-0 before:-z-1 before:h-full before:w-full before:rounded-sm before:backdrop-blur-sticky',
        )}
      >
        <div className='flex items-center justify-between px-4 py-4 border-b h-18 border-white/20'>
          <div className='relative z-50 flex items-center flex-1'>
            <NavLink isHome item={{ pages: ['main'], label: 'home' }}>
              <span className='block w-10 h-10'>
                <Logo className='text-white' />
              </span>
            </NavLink>
            {!isMobile && <DesktopNavigation menuTree={menuTree} />}
          </div>
          <div className='flex gap-4'>
            {!isMobile && <ChainSelect className='hidden md:flex' />}
            {isMobile && <MobileNavigationToggle className='md:hidden' />}
          </div>
        </div>
      </header>
      {isMobile && <MobileNavigation menuTree={menuTree} />}
    </>
  )
}

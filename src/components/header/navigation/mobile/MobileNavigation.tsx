import classNames from 'classnames'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { ChevronDown } from 'components/common/Icons'
import Text from 'components/common/Text'
import ChainSelect from 'components/header/ChainSelect'
import useChainConfig from 'hooks/chain/useChainConfig'
import useStore from 'store'
import { getPage, getRoute } from 'utils/route'

interface Props {
  menuTree: (chainConfig: ChainConfig) => MenuTreeEntry[]
}

export default function MobileNavigation(props: Props) {
  const { menuTree } = props
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentPage = getPage(pathname)
  const chainConfig = useChainConfig()

  const menu = useMemo(() => menuTree(chainConfig), [menuTree, chainConfig])

  useEffect(() => {
    if (mobileNavExpanded) {
      document.body.classList.add('h-screen-full', 'overflow-hidden')
    } else {
      document.body.classList.remove('h-screen-full', 'overflow-hidden')
    }

    return () => {
      document.body.classList.remove('h-screen-full', 'overflow-hidden')
    }
  }, [mobileNavExpanded])

  const selectPage = useCallback(
    (page: Page) => {
      window.scrollTo(0, 0)
      if (typeof window !== 'undefined') setTimeout(() => window.scrollTo(0, 0), 200)
      useStore.setState({ mobileNavExpanded: false })
      navigate(getRoute(getPage(page), searchParams))
    },
    [navigate, searchParams],
  )

  return (
    <nav
      className={classNames(
        'fixed md:hidden max-w-screen-full w-screen-full top-18 p-2 pt-4 pb-20 transition-all overflow-y-scroll h-[calc(100dvh-72px)] z-20 items-start',
        mobileNavExpanded ? 'right-0 opacity-100' : '-right-full opacity-0',
      )}
    >
      <div className='flex flex-wrap gap-4'>
        <div className='flex items-center justify-between w-full'>
          <Text size='sm'>Outpost:</Text>
          <div className='relative'>
            <ChainSelect withText />
          </div>
        </div>
        <div className='flex items-center justify-between w-full'>
          <Text size='sm'>Page:</Text>
          <div className='relative'>
            <select
              className='py-1.5 pl-2 pr-6 text-sm text-white bg-transparent border rounded-sm appearance-none border-white/30 focus:outline-none active:outline-none'
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                selectPage(event.target.value as Page)
              }
            >
              {menu.map((item, index) => {
                if (item.submenu) {
                  return item.submenu.map((subItem, subIndex) => {
                    return (
                      <option
                        key={subIndex}
                        value={subItem.page}
                        selected={subItem.page === currentPage}
                      >
                        {`${item.label} - ${subItem.label}`}
                      </option>
                    )
                  })
                }

                return (
                  <option
                    key={index}
                    value={item.pages[0]}
                    selected={item.pages.indexOf(currentPage as Page) !== -1}
                  >
                    {item.label}
                  </option>
                )
              })}
            </select>
            <div className='absolute w-3 -translate-y-1/2 right-2 top-1/2 -z-1'>
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

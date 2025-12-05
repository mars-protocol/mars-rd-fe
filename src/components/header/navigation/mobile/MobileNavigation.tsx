'use client'

import classNames from 'classnames'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo } from 'react'

import { ChevronDown } from 'components/common/Icons'
import Text from 'components/common/Text'
import ChainSelect from 'components/header/ChainSelect'
import useChainConfig from 'hooks/chain/useChainConfig'
import useStore from 'store'
import { getPage } from 'utils/route'

interface Props {
  menuTree: (chainConfig: ChainConfig) => MenuTreeEntry[]
}

export default function MobileNavigation(props: Props) {
  const { menuTree } = props
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const currentPage = getPage(pathname)
  const chainConfig = useChainConfig()

  const menu = useMemo(() => menuTree(chainConfig), [menuTree, chainConfig])

  const selectedValue = useMemo(() => {
    for (const item of menu) {
      if (item.submenu) {
        const match = item.submenu.find((subItem) => subItem.page === currentPage)
        if (match) return match.page
      }
    }
    const regularItem = menu.find(
      (item) => !item.submenu && item.pages.includes(currentPage as Page),
    )
    return regularItem?.pages[0] ?? ''
  }, [menu, currentPage])

  useEffect(() => {
    if (typeof window === 'undefined') return

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
      const newPath = page === 'main' ? '/' : `/${page}`
      const params = new URLSearchParams(searchParams)
      router.push(`${newPath}?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <nav
      className={classNames(
        'overflow-y-scroll fixed z-20 items-start p-2 pt-4 pb-20 transition-all md:hidden max-w-screen-full w-screen-full top-18 h-[calc(100dvh-72px)] scrollbar-hide',
        mobileNavExpanded ? 'right-0 opacity-100' : '-right-full opacity-0',
      )}
    >
      <div className='flex flex-wrap gap-4'>
        <div className='flex justify-between items-center w-full'>
          <Text size='sm'>Outpost:</Text>
          <div className='relative'>
            <ChainSelect withText />
          </div>
        </div>
        <div className='flex justify-between items-center w-full'>
          <Text size='sm'>Page:</Text>
          <div className='relative'>
            <select
              className='py-1.5 pl-2 pr-6 text-sm text-white bg-transparent border appearance-none border-white/30 focus:outline-none active:outline-none'
              value={selectedValue}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                selectPage(event.target.value as Page)
              }
            >
              {menu.map((item, index) => {
                if (item.submenu) {
                  return item.submenu.map((subItem, subIndex) => {
                    return (
                      <option key={subIndex} value={subItem.page}>
                        {`${item.label} - ${subItem.label}`}
                      </option>
                    )
                  })
                }

                return (
                  <option key={index} value={item.pages[0]}>
                    {item.label}
                  </option>
                )
              })}
            </select>
            <div className='absolute right-2 top-1/2 w-3 -translate-y-1/2 -z-1'>
              <ChevronDown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

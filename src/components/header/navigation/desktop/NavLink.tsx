'use client'

import classNames from 'classnames'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

import { ExternalLink } from 'components/common/Icons'
import { getIsActive } from 'components/header/navigation/desktop/DesktopNavigation'

interface Props {
  children: string | ReactNode
  item: MenuTreeEntry
  isHome?: boolean
  className?: string
  onClick?: () => void
  onMouseOver?: () => void
}

export const NavLink = (props: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { isHome, item, className, onClick } = props

  const params = new URLSearchParams(searchParams || '')
  const page = item.pages[0]
  const itemLink = item.externalUrl
    ? item.externalUrl
    : page === 'main'
      ? `/?${params.toString()}`
      : `/${page}?${params.toString()}`
  const link = isHome ? `/?${params.toString()}` : itemLink

  if (item.externalUrl) {
    return (
      <a
        href={link}
        onClick={onClick ? onClick : undefined}
        className={classNames(
          className,
          'font-semibold hover:text-white active:text-white group-hover/submenuitem:text-white',
          'text-white/60',
        )}
        target='_blank'
        rel='noopener noreferrer'
      >
        <>
          {props.children}
          <ExternalLink className='inline-block w-4 ml-1 mb-0.5' />
        </>
      </a>
    )
  }

  return (
    <Link
      href={link}
      onClick={onClick ? onClick : undefined}
      className={classNames(
        className,
        'font-semibold hover:text-white active:text-white group-hover/submenuitem:text-white',
        getIsActive(item.pages, pathname) ? 'pointer-events-none text-white' : 'text-white/60',
      )}
    >
      {props.children}
    </Link>
  )
}

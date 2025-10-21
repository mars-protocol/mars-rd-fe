import classNames from 'classnames'
import { usePathname } from 'next/navigation'

import Divider from 'components/common/Divider'
import { ChevronDown } from 'components/common/Icons'
import Text from 'components/common/Text'
import { getIsActive } from 'components/header/navigation/desktop/DesktopNavigation'
import { NavLink } from 'components/header/navigation/desktop/NavLink'
import useToggle from 'hooks/common/useToggle'

interface Props {
  item: MenuTreeEntry
  index: number
}

export const NavMenu = (props: Props) => {
  const { item, index } = props
  const [showMenu, setShowMenu] = useToggle()
  const pathname = usePathname()

  if (!item.submenu) return null

  return (
    <div
      className={`@nav-${index}/navigation:inline-block hidden relative items-center pb-2 -mb-2 pt-0.5`}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div
        onMouseOver={() => {
          if (!showMenu) setShowMenu(true)
        }}
        className={classNames('text-base p-0 flex gap-2', showMenu && '!text-white')}
        onClick={() => setShowMenu(false)}
      >
        <NavLink
          key={index}
          item={{ pages: [item.pages[0]], label: item.label }}
          className={classNames(
            'whitespace-nowrap',
            (getIsActive(item.pages, pathname) || showMenu) && '!text-white',
          )}
        >
          {item.label}
        </NavLink>
        <ChevronDown className='w-3' />
      </div>
      {showMenu && (
        <>
          <div
            className='absolute left-0 top-full z-50'
            onMouseLeave={() => {
              if (showMenu) setShowMenu(false)
            }}
          >
            <ul
              className={classNames(
                'flex flex-wrap list-none backdrop-blur-lg bg-white/10',
                'isolate overflow-hidden relative max-w-full',
              )}
            >
              {item.submenu.map((submenuitem, index) => (
                <li className='p-0 m-0 w-full group/submenuitem' key={index}>
                  {index !== 0 && <Divider />}
                  <NavLink
                    item={{ pages: [submenuitem.page], label: submenuitem.label }}
                    onClick={() => {
                      if (showMenu) setShowMenu(false)
                    }}
                    className='flex gap-4 items-center p-4 w-full whitespace-nowrap'
                  >
                    {submenuitem.icon && <div className='w-6'>{submenuitem.icon}</div>}
                    <Text className='flex flex-wrap'>
                      {submenuitem.label}
                      {submenuitem.subtitle && (
                        <span
                          className={classNames(
                            'w-full text-sm group-hover/submenuitem:text-white',
                            getIsActive([submenuitem.page], pathname)
                              ? 'text-white'
                              : 'text-white/40',
                          )}
                        >
                          {submenuitem.subtitle}
                        </span>
                      )}
                    </Text>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

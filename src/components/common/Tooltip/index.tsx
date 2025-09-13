import Tippy, { TippyProps } from '@tippyjs/react'
import classNames from 'classnames'
import { ReactNode } from 'react'

import { Questionmark } from 'components/common/Icons'
import TooltipContent from 'components/common/Tooltip/TooltipContent'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'

interface Props extends TippyProps {
  content: ReactNode | string
  type: TooltipType
  className?: string
  delay?: number
  interactive?: boolean
  underline?: boolean
  hideArrow?: boolean
  contentClassName?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = (props: Props) => {
  const [reduceMotion] = useLocalStorage<boolean>(
    LocalStorageKeys.REDUCE_MOTION,
    DEFAULT_SETTINGS.reduceMotion,
  )

  const isInWalletAssetModal =
    typeof window !== 'undefined' ? document.getElementById('wallet-assets-modal') : null
  const isInModal = typeof window !== 'undefined' ? document.getElementById('modal') : null

  return (
    <Tippy
      appendTo={() =>
        isInWalletAssetModal ??
        isInModal ??
        (typeof window !== 'undefined' ? document.body : undefined)
      }
      interactive={props.interactive}
      animation={false}
      delay={[props.delay ?? 0, 0]}
      placement={props.placement ?? 'top'}
      render={() => (
        <TooltipContent
          hideArrow={props.hideArrow}
          type={props.type}
          content={props.content}
          className={props.contentClassName}
        />
      )}
      onClickOutside={props.onClickOutside}
      visible={props.visible}
    >
      {props.children ? (
        <div
          className={classNames(
            props.underline &&
              'border-b hover:cursor-help border-dashed border-white/20 pb-1 hover:border-transparent',
            !reduceMotion && 'transition-all duration-200',
            props.className,
          )}
        >
          {props.children}
        </div>
      ) : (
        <div
          className={classNames(
            'inline-block w-[16px] hover:cursor-pointer opacity-40 hover:opacity-80',
            props.className,
          )}
        >
          <Questionmark />
        </div>
      )}
    </Tippy>
  )
}

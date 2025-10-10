import classNames from 'classnames'
import { ReactNode } from 'react'

interface Props {
  children?: ReactNode | string
  content?: ReactNode | string
  className?: string
  hasBackdropIsolation?: boolean
  show: boolean
  setShow: (show: boolean) => void
}

export default function Overlay(props: Props) {
  const onClickAway = () => {
    props.setShow(false)
  }

  return props.show ? (
    <>
      <div
        className={classNames(
          'max-w-screen-full fixed isolate z-50 shadow-overlay backdrop-blur-lg',
          props.hasBackdropIsolation ? 'bg-body' : 'gradient-popover',
          'md:absolute',
          props.className,
        )}
      >
        {props.children ? props.children : props.content}
      </div>
      <div
        className='block fixed inset-0 z-40 w-full h-full hover:cursor-pointer'
        onClick={onClickAway}
        role='button'
      />
    </>
  ) : null
}

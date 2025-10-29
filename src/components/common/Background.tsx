'use client'

import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'

export default function Background() {
  const searchParams = useSearchParams()
  const isIframeView = searchParams?.get('iframeView') === 'on'

  if (isIframeView) return null

  return (
    <div
      className={classNames(
        'fixed inset-0',
        'w-screen-full h-screen-full',
        'overflow-hidden pointer-events-none background',
        'bg-body',
      )}
    />
  )
}

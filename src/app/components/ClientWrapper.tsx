// @ts-check
'use client'

import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { SWRConfig } from 'swr'

import { CircularProgress } from 'components/common/CircularProgress'
import Background from '../../components/common/Background'
import Footer from '../../components/common/Footer'
import PageMetadata from '../../components/common/PageMetadata'
import Header from '../../components/header/Header'
import useStore from '../../store'
import { debugSWR } from '../../utils/middleware'

interface ClientWrapperProps {
  children: React.ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)

  // Suppress React 19 ref deprecation warnings from @tippyjs/react until library is updated
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof console !== 'undefined') {
      const originalConsoleError = console.error
      console.error = (...args) => {
        // Filter out the specific React 19 ref deprecation warning from @tippyjs/react
        const message = args[0]
        if (
          typeof message === 'string' &&
          (message.includes('Accessing element.ref was removed in React 19') ||
            message.includes('ref is now a regular prop'))
        ) {
          return // Suppress this specific warning
        }
        originalConsoleError.apply(console, args)
      }

      // Also intercept the error handler for unhandled errors
      const originalErrorHandler = window.onerror
      window.onerror = (message, source, lineno, colno, error) => {
        if (
          typeof message === 'string' &&
          (message.includes('Accessing element.ref was removed in React 19') ||
            message.includes('ref is now a regular prop'))
        ) {
          return true // Suppress this specific error
        }
        return originalErrorHandler
          ? originalErrorHandler(message, source, lineno, colno, error)
          : false
      }
    }
  }, [])

  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center w-full h-screen'>
          <CircularProgress size={32} />
        </div>
      }
    >
      <ClientWrapperInner mobileNavExpanded={mobileNavExpanded}>{children}</ClientWrapperInner>
    </Suspense>
  )
}

function ClientWrapperInner({
  children,
  mobileNavExpanded,
}: ClientWrapperProps & { mobileNavExpanded: boolean }) {
  const searchParams = useSearchParams()
  const isIframeView = searchParams?.get('iframeView') === 'on'

  return (
    <>
      <Suspense
        fallback={
          <div className='flex justify-center items-center w-full h-screen'>
            <CircularProgress size={32} />
          </div>
        }
      >
        <PageMetadata />
      </Suspense>
      <Suspense
        fallback={
          <div className='flex justify-center items-center w-full h-screen'>
            <CircularProgress size={32} />
          </div>
        }
      >
        <Background />
      </Suspense>
      <Suspense
        fallback={
          <div className='flex justify-center items-center w-full h-screen'>
            <CircularProgress size={32} />
          </div>
        }
      >
        <Header />
      </Suspense>
      <main
        className={classNames(
          'md:min-h-[calc(100dvh-81px)]',
          !isIframeView && 'mt-[73px]',
          'flex',
          'min-h-screen-full w-full relative',
          'gap-4 p-2 pb-20',
          'md:gap-6 md:px-4 md:py-6',
          'justify-center',
          isMobile && 'items-start transition-all duration-500',
          mobileNavExpanded && isMobile && '-ml-full',
        )}
      >
        <SWRConfig value={{ use: [debugSWR] }}>
          <Suspense
            fallback={
              <div className='flex justify-center items-center w-full h-screen'>
                <CircularProgress size={32} />
              </div>
            }
          >
            <div
              className={classNames(
                'flex items-start mx-auto w-full max-w-screen-full',
                'md:max-w-content',
              )}
            >
              {children}
            </div>
          </Suspense>
        </SWRConfig>
      </main>
      <Suspense
        fallback={
          <div className='flex justify-center items-center w-full h-screen'>
            <CircularProgress size={32} />
          </div>
        }
      >
        <Footer />
      </Suspense>
    </>
  )
}

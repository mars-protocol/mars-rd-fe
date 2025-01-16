import classNames from 'classnames'
import { isMobile } from 'react-device-detect'
import { SWRConfig } from 'swr'

import Background from 'components/common/Background'
import Footer from 'components/common/Footer'
import PageMetadata from 'components/common/PageMetadata'
import Header from 'components/header/Header'
import { useRouter } from 'next/router'
import { Suspense } from 'react'
import useStore from 'store'
import { debugSWR } from 'utils/middleware'

export default function Layout({ children }: { children: React.ReactNode }) {
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)
  const router = useRouter()
  const isIframeView = router.query.iframeView === 'on'
  return (
    <Suspense
      fallback={
        <>
          <Background />
          <Header />
        </>
      }
    >
      <PageMetadata />
      <Background />
      {!isIframeView && <Header />}
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
          <div
            className={classNames(
              'mx-auto flex items-start w-full max-w-screen-full',
              'md:max-w-content',
            )}
          >
            {children}
          </div>
        </SWRConfig>
      </main>
      <Footer />
    </Suspense>
  )
}

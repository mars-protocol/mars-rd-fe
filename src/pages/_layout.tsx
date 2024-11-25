import classNames from 'classnames'
import { Suspense, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { SWRConfig } from 'swr'

import Background from 'components/common/Background'
import { CircularProgress } from 'components/common/CircularProgress'
import Footer from 'components/common/Footer'
import PageMetadata from 'components/common/PageMetadata'
import Text from 'components/common/Text'
import Header from 'components/header/Header'
import { DEFAULT_SETTINGS } from 'constants/defaultSettings'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useStore from 'store'
import { debugSWR } from 'utils/middleware'

interface Props {
  focusComponent: FocusComponent | null
  children: React.ReactNode
}

function PageContainer(props: Props) {
  return (
    <div className={classNames('mx-auto flex justify-center w-full max-w-content items-start')}>
      {props.children}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const focusComponent = useStore((s) => s.focusComponent)
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)

  useEffect(() => {
    if (!window) return
    const theme = localStorage.getItem(LocalStorageKeys.THEME) ?? DEFAULT_SETTINGS.theme
    const root = window.document.documentElement
    root.setAttribute('data-theme', theme)
  }, [])

  return (
    <>
      <SWRConfig value={{ use: [debugSWR] }}>
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen-full'>
              <div className='flex flex-wrap justify-center w-full gap-4'>
                <CircularProgress size={60} />
                <Text className='w-full text-center' size='2xl'>
                  Fetching data...
                </Text>
              </div>
            </div>
          }
        >
          <PageMetadata />
          <Background />
          <Header />
          <main
            className={classNames(
              'md:min-h-[calc(100dvh-81px)]',
              'mt-[73px]',
              'flex',
              'min-h-screen-full w-full relative',
              'gap-4 p-2 pb-20',
              'md:gap-6 md:px-4 md:py-6',
              'transition-all duration-500',
              'justify-center',
              isMobile && 'items-start transition-all duration-500',
              mobileNavExpanded && isMobile && '-ml-full',
            )}
          >
            <PageContainer focusComponent={focusComponent}>{children}</PageContainer>
          </main>
          <Footer />
        </Suspense>
      </SWRConfig>
    </>
  )
}

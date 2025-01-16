import classNames from 'classnames'
import { Suspense, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import { SWRConfig } from 'swr'

import chains from 'chains'
import Background from 'components/common/Background'
import { CircularProgress } from 'components/common/CircularProgress'
import Footer from 'components/common/Footer'
import PageMetadata from 'components/common/PageMetadata'
import Text from 'components/common/Text'
import Header from 'components/header/Header'
import useChainConfig from 'hooks/chain/useChainConfig'
import useCurrentChainId from 'hooks/localStorage/useCurrentChainId'
import useStore from 'store'
import { debugSWR } from 'utils/middleware'
import { useRouter } from 'next/router'

interface Props {
  focusComponent: FocusComponent | null
  children: React.ReactNode
}

function PageContainer(props: Props) {
  if (!props.focusComponent)
    return (
      <div
        className={classNames(
          'mx-auto flex items-start w-full max-w-screen-full',
          'md:max-w-content',
        )}
      >
        {props.children}
      </div>
    )

  return (
    <div className='relative flex items-center justify-center w-full h-full'>
      {props.focusComponent.component}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const focusComponent = useStore((s) => s.focusComponent)
  const mobileNavExpanded = useStore((s) => s.mobileNavExpanded)
  const [currentChainId, setCurrentChainId] = useCurrentChainId()
  const chainConfig = useChainConfig()
  useEffect(() => {
    if (currentChainId !== chainConfig.id) {
      setCurrentChainId(chainConfig.id)
      useStore.setState({ chainConfig: chains[currentChainId] })
    }
  }, [chainConfig.id, currentChainId, setCurrentChainId])
  const router = useRouter()
  const isIframeView = router.query.iframeView === 'on'

  if (isIframeView) {
    return (
      <SWRConfig value={{ use: [debugSWR] }}>
        <PageMetadata />
        <main
          className={classNames(
            'md:min-h-[calc(100dvh-81px)]',
            'mt-[73px]',
            'flex',
            'min-h-screen-full w-full relative',
            'gap-4 p-2 pb-20',
            'md:gap-6 md:px-4 md:py-6',
            'justify-center',
            focusComponent && 'items-center',
            isMobile && 'items-start transition-all duration-500',
            mobileNavExpanded && isMobile && '-ml-full',
          )}
        >
          <Suspense
            fallback={
              <div className='flex items-center justify-center w-full h-screen-full'>
                <div className='flex flex-wrap justify-center w-full gap-4'>
                  <CircularProgress size={60} />
                  <Text className='w-full text-center' size='2xl'>
                    Fetching on-chain data...
                  </Text>
                </div>
              </div>
            }
          >
            <PageContainer focusComponent={focusComponent}>{children}</PageContainer>
          </Suspense>
        </main>
        <Footer />
      </SWRConfig>
    )
  }

  return (
    <SWRConfig value={{ use: [debugSWR] }}>
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
          'justify-center',
          focusComponent && 'items-center',
          isMobile && 'items-start transition-all duration-500',
          mobileNavExpanded && isMobile && '-ml-full',
        )}
      >
        <Suspense
          fallback={
            <div className='flex items-center justify-center w-full h-screen-full'>
              <div className='flex flex-wrap justify-center w-full gap-4'>
                <CircularProgress size={60} />
                <Text className='w-full text-center' size='2xl'>
                  Fetching on-chain data...
                </Text>
              </div>
            </div>
          }
        >
          <PageContainer focusComponent={focusComponent}>{children}</PageContainer>
        </Suspense>
      </main>
      <Footer />
    </SWRConfig>
  )
}

'use client'

import classNames from 'classnames'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { useSWRConfig } from 'swr'

import chains from 'chains'
import Button from 'components/common/Button'
import { ChevronDown } from 'components/common/Icons'
import Overlay from 'components/common/Overlay'
import Text from 'components/common/Text'
import ChainLogo from 'components/common/chain/ChainLogo'
import useChainConfig from 'hooks/chain/useChainConfig'
import useToggle from 'hooks/common/useToggle'
import useStore from 'store'
import { ChainInfoID } from 'types/enums'
import { getChainName } from 'utils/getChainName'

interface Props {
  className?: string
  withText?: boolean
}

interface ChainOptionProps {
  chain: ChainConfig
  active: boolean
  index: number
}

export default function ChainSelect(props: Props) {
  const [showMenu, setShowMenu] = useToggle()
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const chainConfig = useChainConfig()

  const selectChain = useCallback(
    (chainConfig: ChainConfig) => {
      setShowMenu(false)

      mutate(() => true, undefined, { revalidate: false })
      useStore.setState({
        client: undefined,
        mobileNavExpanded: false,
      })

      const newParams = new URLSearchParams(searchParams)
      newParams.set('chain', getChainName(chainConfig.id))

      const currentPage = pathname.split('/').pop() || 'main'
      const newPath = currentPage === 'main' ? '/' : `/${currentPage}`
      router.push(`${newPath}?${newParams.toString()}`)
    },
    [router, searchParams, pathname, setShowMenu, mutate],
  )

  const ChainOption = (props: ChainOptionProps) => {
    const { active, chain, index } = props
    return (
      <div
        className={classNames(
          'flex items-center gap-2 px-4 py-3 bg-white/10 border-white/20 relative',
          active ? 'bg-white/30 pointer-events-none' : 'hover:bg-white/20',
          index > 0 && 'border-t',
        )}
        role='button'
        onClick={() => selectChain(chain)}
      >
        <ChainLogo chainID={chain.id} className='w-5' />
        <Text>{chain.name}</Text>
      </div>
    )
  }

  const availableChains = useMemo(() => {
    const availableChains: { chainId: ChainInfoID; name: string }[] = []

    Object.entries(chains).forEach(([chainId, chainConfig]) => {
      availableChains.push({ chainId: chainId as ChainInfoID, name: chainConfig.name })
    })

    return availableChains
  }, [])

  if (!chainConfig) return null
  return (
    <div className={classNames('relative', props.className)}>
      <Button
        leftIcon={<ChainLogo chainID={chainConfig.id} className='w-4' />}
        iconClassName='w-5 h-5'
        color='secondary'
        text={props.withText ? chainConfig.name : undefined}
        onClick={() => setShowMenu()}
        className={classNames(
          'flex items-center justify-center',
          props.withText ? 'w-auto !px-2 !pr-8 h-[32px]' : '!p-0 w-8',
        )}
      />
      {props.withText && (
        <div className='absolute right-2 top-1/2 w-3 -translate-y-1/2 z-1'>
          <ChevronDown />
        </div>
      )}
      <Overlay
        show={showMenu}
        setShow={setShowMenu}
        className='right-0 md:top-8 md:w-[200px] md:mt-2 overflow-hidden top-18 fixed md:absolute w-screen-full md:h-auto'
      >
        {availableChains.map((chain, index) => (
          <React.Fragment key={chain.chainId}>
            {!!chains[chain.chainId] && (
              <ChainOption
                index={index}
                chain={chains[chain.chainId]}
                active={chainConfig.name === chain.name}
              />
            )}
          </React.Fragment>
        ))}
      </Overlay>
    </div>
  )
}

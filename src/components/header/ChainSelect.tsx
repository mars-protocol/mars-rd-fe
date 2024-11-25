import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import chains from 'chains'
import Button from 'components/common/Button'
import { ChevronDown } from 'components/common/Icons'
import Overlay from 'components/common/Overlay'
import Text from 'components/common/Text'
import ChainLogo from 'components/common/chain/ChainLogo'
import useChainConfig from 'hooks/chain/useChainConfig'
import useToggle from 'hooks/common/useToggle'
import useCurrentChainId from 'hooks/localStorage/useCurrentChainId'
import useStore from 'store'
import { ChainInfoID } from 'types/enums'
import { getRoute } from 'utils/route'

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const chainConfig = useChainConfig()

  const [_, setCurrentChainId] = useCurrentChainId()

  const selectChain = useCallback(
    async (chainConfig: ChainConfig) => {
      setShowMenu(false)
      setCurrentChainId(chainConfig.id)
      mutate(() => true)
      useStore.setState({
        client: undefined,
        mobileNavExpanded: false,
        chainConfig,
      })
      console.log('chainConfig', chainConfig.perps)
      // Navigate to perps if supported, otherwise main
      navigate(getRoute(chainConfig.perps ? 'perps' : 'main', searchParams))
    },
    [setCurrentChainId, setShowMenu, mutate, navigate, searchParams],
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
        <div className='absolute w-3 -translate-y-1/2 right-2 top-1/2 z-1'>
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

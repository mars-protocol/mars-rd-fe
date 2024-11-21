import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import chains from 'chains'
import Button from 'components/common/Button'
import { ChevronDown, Cross } from 'components/common/Icons'
import Overlay from 'components/common/Overlay'
import Radio from 'components/common/Radio'
import Text from 'components/common/Text'
import ChainLogo from 'components/common/chain/ChainLogo'
import useChainConfig from 'hooks/chain/useChainConfig'
import useToggle from 'hooks/common/useToggle'
import useCurrentChainId from 'hooks/localStorage/useCurrentChainId'
import useStore from 'store'
import { ChainInfoID, NETWORK } from 'types/enums'
import { getRoute } from 'utils/route'

interface Props {
  className?: string
  withText?: boolean
}

interface ChainOptionProps {
  chainConfig?: ChainConfig
  onSelect?: (chain: ChainConfig) => void
  active: boolean
}

export default function ChainSelect(props: Props) {
  const [showMenu, setShowMenu] = useToggle()
  const chainConfig = useChainConfig()
  const { mutate } = useSWRConfig()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isV1 = useStore((s) => s.isV1)

  const [_, setCurrentChainId] = useCurrentChainId()

  const selectChain = useCallback(
    async (chainConfig: ChainConfig) => {
      setShowMenu(false)
      setCurrentChainId(chainConfig.id)
      mutate(() => true)
      useStore.setState({
        mobileNavExpanded: false,
        chainConfig,
      })
      navigate(getRoute('perps', searchParams))
    },
    [setCurrentChainId, setShowMenu, mutate, navigate, searchParams],
  )

  const ChainOption = (props: ChainOptionProps) => {
    const { onSelect, active, chainConfig } = props
    return (
      <div
        className={classNames(
          'w-full px-4 py-3 flex gap-3 group/chain text-white items-center',
          active ? 'pointer-events-none' : 'opacity-60 hover:opacity-100',
        )}
        role='button'
        onClick={
          onSelect && chainConfig
            ? () => onSelect(chainConfig)
            : () => {
                if (chainConfig) {
                  setCurrentChainId(chainConfig.id)
                  useStore.setState({
                    chainConfig,
                    mobileNavExpanded: false,
                  })
                }
              }
        }
      >
        <Radio active={active} className='group-hover/account:opacity-100' />
        <Text size='sm'>Dashboard</Text>
      </div>
    )
  }

  const availableChains = useMemo(() => {
    const currentNetworkType = process.env.NEXT_PUBLIC_NETWORK ?? NETWORK.TESTNET
    const availableChains: { chainId: ChainInfoID; name: string }[] = []
    Object.entries(chains).forEach(([chainId, chainConfig]) => {
      if (chainConfig.network !== currentNetworkType) return
      availableChains.push({ chainId: chainId as ChainInfoID, name: chainConfig.name })
    })
    if (currentNetworkType === NETWORK.TESTNET) return availableChains
    return availableChains
  }, [])

  return (
    <div className={classNames('relative', props.className)}>
      <Button
        leftIcon={<ChainLogo chainID={chainConfig.id} className='w-4' />}
        iconClassName='w-5 h-5'
        color='secondary'
        text={props.withText ? `${chainConfig.name} ${isV1 ? 'v1' : 'v2'}` : undefined}
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
            <div
              className={classNames(
                'flex items-center gap-2 px-4 py-3 border-b bg-white/10 border-white/20 relative',
                index > 0 && 'border-t',
              )}
            >
              <ChainLogo chainID={chain.chainId} className='w-5' />
              <Text>{chain.name}</Text>
              {props.withText && index === 0 && (
                <div className='absolute top-2 right-2'>
                  <Button
                    onClick={() => setShowMenu(false)}
                    leftIcon={<Cross />}
                    iconClassName='w-3'
                    color='tertiary'
                    className='w-8 h-8 '
                    size='xs'
                  />
                </div>
              )}
            </div>
            {!!chains[chain.chainId] && (
              <ChainOption
                chainConfig={chains[chain.chainId]}
                onSelect={() => selectChain(chains[chain.chainId])}
                active={chainConfig.name === chain.name && !isV1}
              />
            )}
          </React.Fragment>
        ))}
      </Overlay>
    </div>
  )
}

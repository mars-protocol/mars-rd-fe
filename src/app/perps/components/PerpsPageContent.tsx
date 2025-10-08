'use client'

import classNames from 'classnames'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import AssetImage from 'components/common/assets/AssetImage'
import Card from 'components/common/Card'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'
import Divider from 'components/common/Divider'
import Text from 'components/common/Text'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import PerpsMetrics from 'components/main/perps/PerpsMetrics'
import { PERPS_TIMEFRAME } from 'constants/timeframe'
import { neutronPerps } from 'data/assets/neutron-perps'
import useChainConfig from 'hooks/chain/useChainConfig'
import { useAllPerpsParamsSC } from 'hooks/perps/usePerpsParams'
import ClientWrapper from 'app/components/ClientWrapper'

interface PerpsPageContentProps {
  selectedMarket?: string
}

export default function PerpsPageContent({ selectedMarket }: PerpsPageContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: perpsParams } = useAllPerpsParamsSC()

  const perpsAssets = useMemo(
    () => neutronPerps.filter((p) => perpsParams?.some((ap) => ap.denom === p.denom)),
    [perpsParams],
  )

  const isIframeView = searchParams?.get('iframeView') === 'on'
  const chainConfig = useChainConfig()

  useEffect(() => {
    if (!chainConfig.perps) {
      router.push('/?chain=osmosis')
    }
  }, [chainConfig.perps, router])

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(PERPS_TIMEFRAME[2].value)
  const [selectedMarketOption, setSelectedMarketOption] = useState<string>(
    selectedMarket ? selectedMarket : 'total',
  )

  const handleSelectChange = (value: string) => {
    if (value === 'total') {
      router.push('/perps')
    } else {
      // Convert full denom to URL-friendly format (remove 'perps/' prefix)
      const urlParam = value.replace('perps/', '')
      router.push(`/perps/${urlParam}`)
    }
    setSelectedMarketOption(value)
  }

  const displayOptions = useMemo(
    () => [
      {
        label: (
          <div className='flex gap-2 w-full'>
            <Text size='sm' className='leading-4'>
              Total Statistics
            </Text>
          </div>
        ),
        value: 'total',
      },
      ...(perpsAssets || []).map((asset) => ({
        label: (
          <div className='flex gap-2 w-full'>
            <AssetImage asset={asset} className='w-4 h-4' />
            <Text size='sm' className='leading-4'>
              {asset.symbol}
            </Text>
          </div>
        ),
        value: asset.denom,
      })),
    ],
    [perpsAssets],
  )

  if (isIframeView) {
    return (
      <ClientWrapper>
        <div className='w-full'>
          <SelectionControlPanel
            timeframe={PERPS_TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            onTimeframeSelect={setSelectedTimeframe}
          />
          <Divider className='mt-2 mb-4' />
          <PerpsMarketStats timeframe={selectedTimeframe} selectedMarket={selectedMarketOption} />
        </div>
      </ClientWrapper>
    )
  }

  return (
    <ClientWrapper>
      <div className='w-full'>
        <PerpsMetrics />
        <Card
          className={classNames('p-1 md:p-4 bg-white/5', isIframeView ? 'bg-transparent' : 'mt-5')}
        >
          <SelectionControlPanel
            selectOptions={displayOptions}
            defaultSelectValue={selectedMarketOption}
            onSelectChange={handleSelectChange}
            timeframe={PERPS_TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            onTimeframeSelect={setSelectedTimeframe}
          />
          <Divider className='mt-2 mb-4' />
          <PerpsMarketStats timeframe={selectedTimeframe} selectedMarket={selectedMarketOption} />
        </Card>
      </div>
    </ClientWrapper>
  )
}

import AssetImage from 'components/common/assets/AssetImage'
import Card from 'components/common/Card'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'
import Divider from 'components/common/Divider'
import Text from 'components/common/Text'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import PerpsMetrics from 'components/main/perps/PerpsMetrics'
import usePerpsEnabledAssets from 'hooks/assets/usePerpsEnabledAssets'
import { getRoute } from 'utils/route'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { TIMEFRAME } from 'constants/timeframe'
import classNames from 'classnames'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function PerpsOverviewPage() {
  const navigate = useNavigate()
  const { asset } = useParams()
  const perpsAssets = usePerpsEnabledAssets()
  const [searchParams] = useSearchParams()
  const isIframeView = searchParams.get('iframeView') === 'on'
  const chainConfig = useChainConfig()

  useEffect(() => {
    if (!chainConfig.perps) {
      navigate('/main?chain=osmosis', { replace: true })
    }
  }, [chainConfig.perps, navigate])

  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[2].value)
  const [selectedOption, setSelectedOption] = useState<string>(asset ? `perps/${asset}` : 'total')

  const handleSelectChange = (value: string) => {
    if (value === 'total') {
      navigate(getRoute('perps', searchParams))
    } else {
      navigate(getRoute(value as Page, searchParams))
    }
    setSelectedOption(value)
  }

  const displayOptions = useMemo(
    () => [
      {
        label: (
          <div className='flex w-full gap-2'>
            <Text size='sm' className='leading-4'>
              Total Statistics
            </Text>
          </div>
        ),
        value: 'total',
      },
      ...(perpsAssets || []).map((asset) => ({
        label: (
          <div className='flex w-full gap-2'>
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
      <div className='w-full '>
        <SelectionControlPanel
          timeframe={TIMEFRAME}
          selectedTimeframe={selectedTimeframe}
          onTimeframeSelect={setSelectedTimeframe}
        />
        <Divider className='mt-2 mb-4' />
        <PerpsMarketStats timeframe={selectedTimeframe} selectedOption={selectedOption} />
      </div>
    )
  }
  return (
    <div className='w-full'>
      <PerpsMetrics />
      <Card
        className={classNames('p-1 md:p-4 bg-white/5', isIframeView ? 'bg-transparent' : 'mt-5')}
      >
        <SelectionControlPanel
          selectOptions={displayOptions}
          defaultSelectValue={selectedOption}
          onSelectChange={handleSelectChange}
          timeframe={TIMEFRAME}
          selectedTimeframe={selectedTimeframe}
          onTimeframeSelect={setSelectedTimeframe}
        />
        <Divider className='mt-2 mb-4' />
        <PerpsMarketStats timeframe={selectedTimeframe} selectedOption={selectedOption} />
      </Card>
    </div>
  )
}

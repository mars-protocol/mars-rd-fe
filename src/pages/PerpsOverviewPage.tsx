import Card from 'components/common/Card'
import Divider from 'components/common/Divider'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import Text from 'components/common/Text'
import useChainConfig from 'hooks/chain/useChainConfig'
import { ChainInfoID } from 'types/enums'
import { useMemo, useState } from 'react'
import { TIMEFRAME } from 'constants/timeframe'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'
import { PERPS_ASSETS } from 'constants/perps'
import AssetImage from 'components/common/assets/AssetImage'
import usePerpsEnabledAssets from 'hooks/assets/usePerpsEnabledAssets'

const perpsOptions = [
  { value: 'total', label: 'Total Statistics' },
  ...PERPS_ASSETS.map((asset) => ({
    value: asset.denom,
    label: `${asset.description} Statistics`,
  })),
].filter((option) => option.value === 'total' || !option.value.includes('UUSDC'))

export default function PerpsOverviewPage() {
  const chainConfig = useChainConfig()
  const isOsmosis = chainConfig.id === ChainInfoID.Osmosis1
  const perpAssets = usePerpsEnabledAssets()
  console.log(perpAssets, 'perpAssets')
  const [selectedOption, setSelectedOption] = useState<string>(perpsOptions[0].value)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0].value)

  const displayOptions = useMemo(
    () =>
      perpAssets.map((asset, index) => ({
        label: (
          <div className='flex w-full gap-2'>
            <AssetImage asset={asset} className='w-4 h-4' />
            <Text size='sm' className='leading-4'>
              {asset.name} Statistics
            </Text>
          </div>
        ),
        value: asset.denom,
      })),
    [],
  )

  return (
    <div className='w-full'>
      {isOsmosis ? (
        <div className='flex items-center justify-center h-full'>
          <Text size='2xl'>Please switch to the Neutron chain to see available data.</Text>
        </div>
      ) : (
        <>
          <Card className='mt-5 bg-white/5 p-4 flex flex-col'>
            <SelectionControlPanel
              selectOptions={displayOptions}
              defaultSelectValue={selectedOption}
              onSelectChange={setSelectedOption}
              timeframe={TIMEFRAME}
              selectedTimeframe={selectedTimeframe}
              onTimeframeSelect={setSelectedTimeframe}
            />
            <Divider className='mt-2' />

            <div className='flex flex-col gap-4 mt-4'>
              <PerpsMarketStats timeframe={selectedTimeframe} selectedOption={selectedOption} />
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

import AssetImage from 'components/common/assets/AssetImage'
import Card from 'components/common/Card'
import Divider from 'components/common/Divider'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import Text from 'components/common/Text'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'
import { PERPS_ASSETS_TEST } from 'constants/perps'
import { TIMEFRAME } from 'constants/timeframe'
import { useMemo, useState } from 'react'

export default function PerpsOverviewPage() {
  const [selectedOption, setSelectedOption] = useState<string>('total')
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0].value)

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
      ...PERPS_ASSETS_TEST.map((asset) => ({
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
    ],
    [],
  )

  return (
    <div className='w-full'>
      <Card className='mt-5 p-4 bg-white/5'>
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
    </div>
  )
}

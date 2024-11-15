import Card from 'components/common/Card'
import Divider from 'components/common/Divider'
import PerpsGlobalMetrics from 'components/main/perps/PerpsGlobalMetrics'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import Text from 'components/common/Text'
import useChainConfig from 'hooks/chain/useChainConfig'
import { ChainInfoID } from 'types/enums'
import { useMemo, useState } from 'react'
import { TIMEFRAME } from 'constants/timeframe'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'

const perpsOptions = [
  { value: 'total', label: 'Total Statistics' },
  { value: 'factory/neutron166t9ww3p6flv7c86376fy0r92r88t3492xxj2h/ubtc', label: 'BTC Statistics' },
  // { value: 'ueth', label: 'ETH Statistics' },
  { value: 'untrn', label: 'NTRN Statistics' },
  // { value: 'utia', label: 'TIA Statistics' },
  // { value: 'upepe', label: 'PEPE Statistics' },
]

export default function PerpsOverviewPage() {
  const chainConfig = useChainConfig()
  const isOsmosis = chainConfig.id === ChainInfoID.Osmosis1
  const [selectedOption, setSelectedOption] = useState<string>(perpsOptions[0].value)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0].value)

  const displayOptions = useMemo(
    () =>
      perpsOptions.map((option, index) => ({
        label: (
          <div className='flex w-full gap-2' key={index}>
            <Text size='sm' className='text-center'>
              {option.label}
            </Text>
          </div>
        ),
        value: option.value,
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
          <PerpsGlobalMetrics />

          <Card className='mt-10 bg-white/5 p-4 flex flex-col'>
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

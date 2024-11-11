import useChainConfig from 'hooks/chain/useChainConfig'
import Text from 'components/common/Text'
import { ChainInfoID } from 'types/enums'
import PerpsGlobalMetrics from 'components/main/perps/PerpsGlobalMetrics'
import Card from 'components/common/Card'
import { useMemo, useState } from 'react'
import { TIMEFRAME } from 'constants/timeframe'
import Divider from 'components/common/Divider'
import PerpsMarketStats from 'components/main/perps/perpsMarketStats'
import Select from 'components/common/Select'

const perpsOptions = [
  { value: 'total', label: 'Total Statistics' },
  { value: 'btc', label: 'BTC Statistics' },
  { value: 'eth', label: 'ETH Statistics' },
  { value: 'ntrn', label: 'NTRN Statistics' },
  { value: 'tia', label: 'TIA Statistics' },
  { value: 'atom', label: 'ATOM Statistics' },
  { value: 'pepe', label: 'PEPE Statistics' },
]

export default function PerpsOverviewPage() {
  const chainConfig = useChainConfig()
  const isOsmosis = chainConfig.id === ChainInfoID.Osmosis1
  const [selectedOption, setSelectedOption] = useState<string>(perpsOptions[0].value)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[2])

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
            <Select
              options={displayOptions}
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              className='relative border w-60 rounded-base border-white/10 bg-white/10'
              containerClassName='justify-center'
            />
            <Divider className='mt-2' />

            <div className='flex flex-col gap-4 mt-4'>
              <PerpsMarketStats />
            </div>
          </Card>
        </>
      )}
    </div>
  )
}

import Text from 'components/common/Text'
import { useMemo, useState } from 'react'
import SelectionControlPanel from 'components/common/Chart/SelectionControlPanel'
import Card from 'components/common/Card'
import DuoLineChart from 'components/common/Chart/DuoLineChart'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import BarChart from './BarChart'
import { dummyDataSets } from 'components/common/Chart/dummydata'

interface Props {
  className?: string
}

const options = [
  { value: 'supplied/borrowed', label: 'Supplied/Borrowed' },
  { value: 'deposits/withdrawals', label: 'Deposits/Withdrawals' },
]

const timeframe = ['1D', '7D', '1M', '1Y']

export default function ChartCard(props: Props) {
  const { className } = props
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(timeframe[2])

  const { data: overviewData, isLoading: isOverviewDataLoading } =
    useOverviewData(selectedTimeFrame)

  const supplyBorrowData = overviewData?.formattedSupplyBorrow

  const displayOptions = useMemo(
    () =>
      options.map((option, index) => ({
        label: (
          <div className='flex w-full gap-2' key={index}>
            <Text size='sm' className='w-4 h-4 leading-4 text-center'>
              {option.label}
            </Text>
          </div>
        ),
        value: option.value,
      })),
    [],
  )

  return (
    <Card contentClassName='px-2 md:px-3 py-3 bg-white/5' className={className}>
      <SelectionControlPanel
        selectOptions={displayOptions}
        defaultSelectValue={selectedOption}
        onSelectChange={setSelectedOption}
        timeframes={timeframe}
        selectedTimeframe={selectedTimeFrame}
        onTimeframeSelect={setSelectedTimeFrame}
      />

      {selectedOption === 'supplied/borrowed' && (
        <BarChart
          data={supplyBorrowData}
          dataKeys={{ supply: 'Supplied', borrow: 'Borrowed' }}
          // className='rounded-t-none before:content-none'
        />
      )}

      {/* TODO: update with correct data */}
      {selectedOption === 'deposits/withdrawals' && (
        <DuoLineChart
          selectedOption={selectedOption}
          options={options}
          selectedTimeframe={selectedTimeFrame}
          data={dummyDataSets}
        />
      )}
    </Card>
  )
}

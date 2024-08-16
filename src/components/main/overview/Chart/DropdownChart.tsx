import BarChart from 'components/common/Chart/BarChart'
import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/ChartError'
import DuoLineChart from 'components/common/Chart/DuoLineChart'
import SelectionControlPanel from 'components/common/Chart/SelectionControlPanel'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import Text from 'components/common/Text'
import { dummyDataSets } from 'components/common/Chart/dummydata'
import { useEffect, useMemo, useState } from 'react'

interface Props {
  className?: string
}

const options = [
  { value: 'supplied/borrowed', label: 'Supplied/Borrowed' },
  { value: 'deposits/withdrawals', label: 'Deposits/Withdrawals' },
]

const timeframe = ['1D', '7D', '1M', '1Y']

export default function DropdownChart(props: Props) {
  const { className } = props
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe[2])

  const {
    data: overviewData,
    isLoading: isOverviewDataLoading,
    error,
    isValidating,
    mutate,
  } = useOverviewData(selectedTimeframe, 'dropdown')

  // useEffect(() => {
  //   console.log('mutating')
  //   mutate(['tokenomics/overviewData', selectedTimeframe, 'dropdown'])
  // }, [selectedTimeframe])

  const handleRefetch = async () => {
    await mutate(['tokenomics/overviewData', selectedTimeframe, 'dropdown'])
  }

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
        timeframe={timeframe}
        selectedTimeframe={selectedTimeframe}
        onTimeframeSelect={setSelectedTimeframe}
      />

      {error ? (
        <ChartError handleRefetch={handleRefetch} />
      ) : (
        <>
          {selectedOption === 'supplied/borrowed' && (
            <BarChart
              data={supplyBorrowData}
              dataKeys={{ supply: 'Supplied', borrow: 'Borrowed' }}
              loading={isValidating || isOverviewDataLoading}
            />
          )}

          {/* TODO: update with correct data */}
          {selectedOption === 'deposits/withdrawals' && (
            <DuoLineChart
              selectedOption={selectedOption}
              options={options}
              selectedTimeframe={selectedTimeframe}
              data={dummyDataSets}
            />
          )}
        </>
      )}
    </Card>
  )
}

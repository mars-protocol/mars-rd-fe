import BarChart from 'components/common/Chart/BarChart'
import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/common/ChartError'
import SelectionControlPanel from 'components/common/Chart/common/SelectionControlPanel'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import Text from 'components/common/Text'
import { useMemo, useState } from 'react'
import { TIMEFRAME } from 'constants/timeframe'

interface Props {
  className?: string
}

const options = [{ value: 'supplied/borrowed', label: 'Supplied/Borrowed' }]

export default function DropdownChart(props: Props) {
  const { className } = props
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value)
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[2])

  const {
    data: dropdownOverviewData,
    isLoading: isDropdownOverviewDataLoading,
    error,
    isValidating,
    mutate,
  } = useOverviewData(selectedTimeframe, 'dropdown')

  const handleRefetch = async () => {
    await mutate(['tokenomics/overviewData', selectedTimeframe, 'dropdown'])
  }

  const supplyBorrowData: BarChartData = dropdownOverviewData?.formattedSupplyBorrow

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
        timeframe={TIMEFRAME}
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
              dataKeys={{ valueOne: 'supply', valueTwo: 'borrow' }}
              loading={isValidating || isDropdownOverviewDataLoading}
            />
          )}
        </>
      )}
    </Card>
  )
}

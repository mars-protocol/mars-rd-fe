import Text from 'components/common/Text'
import { useMemo, useState } from 'react'
import SelectionControlPanel from 'components/common/Chart/SelectionControlPanel'
import Card from 'components/common/Card'
import DuoLineChart from 'components/common/Chart/DuoLineChart'

interface Props {
  className?: string
  data: DummyData
}

const options = [
  { value: 'supplied/borrowed', label: 'Supplied/Borrowed' },
  { value: 'deposits/withdrawals', label: 'Deposits/Withdrawals' },
]

const timeframe = ['1H', '1D', '1W', '1Y']

export default function ChartCard(props: Props) {
  const { className, data } = props
  const [selectedOption, setSelectedOption] = useState<string>(options[0].value)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>(timeframe[0])

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

      <DuoLineChart
        selectedOption={selectedOption}
        options={options}
        selectedTimeframe={selectedTimeFrame}
        data={data}
      />
    </Card>
  )
}

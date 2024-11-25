import React from 'react'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import Select from 'components/common/Select'

interface Props {
  selectOptions: { value: string; label: React.ReactNode }[]
  defaultSelectValue: string
  onSelectChange: (value: string) => void
  timeframe: TimeframeOption[]
  selectedTimeframe: string
  onTimeframeSelect: (timeframe: string) => void
}

export default function SelectionControlPanel(props: Props) {
  const {
    selectOptions,
    defaultSelectValue,
    onSelectChange,
    timeframe,
    selectedTimeframe,
    onTimeframeSelect,
  } = props
  return (
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full'>
      <Select
        options={selectOptions}
        defaultValue={defaultSelectValue}
        onChange={onSelectChange}
        className='relative border w-full sm:w-60 rounded-base border-white/10 bg-white/10'
        containerClassName='justify-center w-full sm:w-auto'
      />
      <TimeframeSelector
        timeframe={timeframe}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={onTimeframeSelect}
        className='ml-auto'
      />
    </div>
  )
}

import React from 'react'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import Select from 'components/common/Select'

interface Props {
  selectOptions: { value: string; label: React.ReactNode }[]
  defaultSelectValue: string
  onSelectChange: (value: string) => void
  timeframe: string[]
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
    <div className='flex flex-wrap sm:justify-between gap-5 sm:gap-0'>
      <Select
        options={selectOptions}
        defaultValue={defaultSelectValue}
        onChange={onSelectChange}
        className='relative border w-60 rounded-base border-white/10 bg-white/10'
        containerClassName='justify-center'
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

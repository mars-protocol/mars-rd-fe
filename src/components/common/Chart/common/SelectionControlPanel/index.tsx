import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import Select from 'components/common/Select'
import React from 'react'

interface Props {
  selectOptions?: { value: string; label: React.ReactNode }[]
  defaultSelectValue?: string
  onSelectChange?: (value: string) => void
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
    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full my-2'>
      {selectOptions && onSelectChange && defaultSelectValue && (
        <Select
          options={selectOptions}
          defaultValue={defaultSelectValue}
          onChange={onSelectChange}
          className='relative w-full sm:w-60'
          containerClassName='justify-center w-full sm:w-auto'
        />
      )}
      <TimeframeSelector
        timeframe={timeframe}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={onTimeframeSelect}
        className={!selectOptions ? 'ml-0' : 'ml-auto'}
      />
    </div>
  )
}

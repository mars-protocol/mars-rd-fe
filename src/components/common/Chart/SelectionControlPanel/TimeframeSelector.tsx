import classNames from 'classnames'
import Button from 'components/common/Button'

interface Props {
  timeframe: string[]
  selectedTimeframe: string
  setSelectedTimeframe: (timeframe: string) => void
  className?: string
}

export default function TimeframeSelector(props: Props) {
  const { timeframe, selectedTimeframe, setSelectedTimeframe, className } = props

  return (
    <div className={classNames('flex flex-row gap-3 my-3', className)}>
      {timeframe.map((time, index) => (
        <Button
          variant='solid'
          color='tertiary'
          onClick={() => setSelectedTimeframe(time)}
          hasFocus={time === selectedTimeframe}
          key={index}
          text={time}
          size='sm'
        />
      ))}
    </div>
  )
}

import classNames from 'classnames'
import Button from 'components/common/Button'

interface Props {
  timeframes: string[]
  selectedTimeframe: string
  setSelectedTimeframe: (timeframe: string) => void
  className?: string
}

export default function TimeframeSelector(props: Props) {
  const { timeframes, setSelectedTimeframe, className } = props
  return (
    <div className={classNames('flex flex-row gap-3 my-3', className)}>
      {timeframes.map((time, index) => (
        <Button
          variant='solid'
          color='tertiary'
          onClick={() => setSelectedTimeframe(time)}
          key={index}
          text={time}
          size='sm'
        />
      ))}
    </div>
  )
}

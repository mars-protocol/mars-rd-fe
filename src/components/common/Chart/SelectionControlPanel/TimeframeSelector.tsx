import Button from 'components/common/Button'

interface Props {
  timeframes: string[]
  selectedTimeframe: string
  setSelectedTimeframe: (timeframe: string) => void
}

export default function TimeframeSelector(props: Props) {
  const { timeframes, setSelectedTimeframe } = props
  return (
    <div className='flex flex-row gap-3 mx-5 my-2'>
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
